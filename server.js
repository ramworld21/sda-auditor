import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { logScanToExcel } from './src/utils/excelLogger.js';
import pkg from 'pg';
const { Pool } = pkg;

// Setup Postgres pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://sda_auditor_db_user:jGOvYgeIjwNuKqJx5tcr4AkP9hbcRw5i@dpg-d4k99gqdbo4c73cr72b0-a/sda_auditor_db',
  ssl: { rejectUnauthorized: false }
});

// Ensure table exists
(async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      url TEXT,
      fast_mode BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
})();

// Fix: define __dirname BEFORE using it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Track active scans to handle concurrent requests
const activeScans = new Map();

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use("/reports", express.static(path.join(__dirname, "reports")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(cors());
app.use(express.json());

// POST /scan - expects { url: "https://example.com", email: "user@example.com", fastMode: boolean }
app.post('/scan', async (req, res) => {
  const { url, email, fastMode } = req.body;
  console.log('📧 Received scan request:', { url, email, fastMode });
  
  if (!url) return res.status(400).json({ error: 'Missing URL' });
  if (!email) return res.status(400).json({ error: 'Missing email' });

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Generate unique scan ID for concurrent handling
  const scanId = `${email}-${Date.now()}`;
  
  // Check if user has an active scan
  const existingUserScan = Array.from(activeScans.values()).find(scan => scan.email === email && scan.inProgress);
  if (existingUserScan) {
    return res.status(429).json({ error: 'لديك فحص جاري بالفعل، يرجى الانتظار حتى ينتهي' });
  }

  // Save email to database
  try {
    await pool.query(
      'INSERT INTO submissions(email, url, fast_mode) VALUES($1, $2, $3)',
      [email, url, fastMode || false]
    );
    console.log('✅ Email saved to database');
  } catch (dbErr) {
    console.error('❌ Failed to save email to database:', dbErr);
  }

  // Log to Excel immediately
  try {
    console.log('📝 Attempting to log to Excel...');
    logScanToExcel(email, url, fastMode);
    console.log('✅ Successfully logged to Excel');
  } catch (error) {
    console.error('❌ Failed to log to Excel:', error);
    // Continue with scan even if logging fails
  }

  // Mark scan as in progress
  activeScans.set(scanId, { email, url, inProgress: true, timestamp: Date.now() });

  const fastFlag = fastMode ? '--fast' : '';
  const cmd = `node cli.js "${url}" ${fastFlag}`.trim();
  
  exec(cmd, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    // Mark scan as complete
    const scanData = activeScans.get(scanId);
    if (scanData) {
      scanData.inProgress = false;
    }
    
    // Clean up old completed scans (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [id, scan] of activeScans.entries()) {
      if (!scan.inProgress && scan.timestamp < fiveMinutesAgo) {
        activeScans.delete(id);
      }
    }

    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }
    res.json({ result: stdout, scanId });
  });
});

// Lightweight health endpoint for frontend checks
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// GET /emails - retrieve all submitted emails (for testing/verification)
app.get('/emails', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, url, fast_mode, created_at FROM submissions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Failed to fetch emails:', err);
    res.status(500).json({ error: 'Failed to fetch emails from database' });
  }
});

// Generate a PDF of the latest HTML report using Playwright (server-side rendering)
app.get('/report-pdf', async (req, res) => {
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    // Load the hosted report HTML so relative assets resolve correctly
    const reportUrl = `${req.protocol}://${req.get('host')}/reports/report.html`;
    await page.goto(reportUrl, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Expand hidden sections for export
    await page.evaluate(() => {
      const hidden = document.getElementById('failures-hidden');
      if (hidden) hidden.style.display = 'flex';
      const filter = document.getElementById('color-filter');
      if (filter) {
        filter.value = 'all';
        const rows = document.querySelectorAll('.color-table-row');
        rows.forEach(row => { row.style.display = 'table-row'; row.style.opacity = '1'; });
      }
    });
    
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true, 
      margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
      preferCSSPageSize: false,
      displayHeaderFooter: false
    });
    await browser.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-report.pdf"');
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating PDF on server:', err);
    return res.status(500).json({ error: 'PDF generation failed on server: ' + err.message });
  }
});
 

app.listen(PORT, () => {
  console.log(`SDA Auditor backend running on port ${PORT}`);
});