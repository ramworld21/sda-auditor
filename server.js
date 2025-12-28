import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { logScanToExcel } from './src/utils/excelLogger.js';
// import pkg from 'pg';
import fs from 'fs';

function generateHTMLReport(url, cliOutput) {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>تقرير الفحص</title>
<style>
  body { font-family: Arial, sans-serif; background:#f7f7f7; padding:20px; }
  .box { background:white; padding:20px; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.1); }
  h1 { margin-top:0; }
  .section { margin-bottom:20px; }
  .section h2 { margin-bottom:10px; font-size:20px; }
  .good { color:green; font-weight:bold; }
  .bad { color:red; font-weight:bold; }
</style>
</head>
<body>
<div class="box">
  <h1>تقرير فحص الموقع</h1>
  <div class="section">
    <h2>الرابط</h2>
    <p>${url}</p>
  </div>
  <div class="section">
    <h2>مخرجات الفحص</h2>
    <pre>${cliOutput}</pre>
  </div>
  <div class="section">
    <h2>إجمالي الحالة</h2>
    <p class="good">✔ تم إنشاء التقرير بنجاح</p>
  </div>
</div>
</body>
</html>
`;
}
// const { Pool } = pkg;

// Setup Postgres pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// });

// Ensure table exists
// (async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS submissions (
//       id SERIAL PRIMARY KEY,
//       email VARCHAR(255) NOT NULL,
//       url TEXT,
//       fast_mode BOOLEAN,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `;
//   await pool.query(createTableQuery);
// })();

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

  // Validate URL hostname against allowed Saudi domain suffixes
  let hostname;
  try {
    let parsed;
    try {
      parsed = new URL(url);
    } catch (e) {
      // Try adding https:// if caller omitted protocol
      parsed = new URL('https://' + url);
    }
    hostname = parsed.hostname.toLowerCase();
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  const allowedSuffixes = ['.gov.sa', '.edu.sa', '.org.sa', '.med.sa', '.sch.sa'];
  if (!allowedSuffixes.some(s => hostname.endsWith(s))) {
    return res.status(400).json({ error: 'الرجاء إدخال موقع ينتهي بـ .gov.sa أو .edu.sa أو .org.sa أو .med.sa أو .sch.sa' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Generate unique scan ID
  const scanId = `${email}-${Date.now()}`;

  // Check if user has an active scan
  const existingUserScan = Array.from(activeScans.values()).find(scan => scan.email === email && scan.inProgress);
  if (existingUserScan) {
    return res.status(429).json({ error: 'لديك فحص جاري بالفعل، يرجى الانتظار حتى ينتهي' });
  }

  // Save email to database
  // try {
  //   await pool.query(
  //     'INSERT INTO submissions(email, url, fast_mode) VALUES($1, $2, $3)',
  //     [email, url, fastMode || false]
  //   );
  // } catch (dbErr) {
  //   console.error('❌ Failed to save email to database:', dbErr);
  // }

  // Log to Excel
  try {
    logScanToExcel(email, url, fastMode);
  } catch (error) {
    console.error('❌ Failed to log to Excel:', error);
  }

  // Mark scan as in progress
  activeScans.set(scanId, { email, url, inProgress: true, timestamp: Date.now() });

  const fastFlag = fastMode ? '--fast' : '';
  const cmd = `node cli.js "${url}" ${fastFlag}`.trim();

  exec(cmd, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    const scanData = activeScans.get(scanId);
    if (scanData) scanData.inProgress = false;

    // Cleanup old scans
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [id, scan] of activeScans.entries()) {
      if (!scan.inProgress && scan.timestamp < fiveMinutesAgo) activeScans.delete(id);
    }

    if (err) {
      const errorMsg = stderr || err.message || 'فشل الفحص';
      return res.status(500).json({ error: errorMsg });
    }

    try {
      // Read latest JSON produced by CLI to derive unique report path
      const jsonPath = path.join(__dirname, 'reports', 'color-audit.json');
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(raw);
      const ts = data.timestamp ? new Date(data.timestamp).getTime() : Date.now();
      const domainPart = (data.url || url || 'site')
        .replace(/^https?:\/\//, '')
        .replace(/[\/:?&#%\s]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const slug = `${domainPart}-${ts}`;
      const reportUrl = `/reports/${slug}/report.html`;
      return res.json({ success: true, reportUrl });
    } catch (fsErr) {
      console.error('❌ Failed to locate generated report path:', fsErr);
      // Fallback to legacy path
      return res.json({ success: true, reportUrl: '/reports/report.html' });
    }
  });
});

// Lightweight health endpoint for frontend checks
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// GET /emails - retrieve all submitted emails (for testing/verification)
// app.get('/emails', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT id, email, url, fast_mode, created_at FROM submissions ORDER BY created_at DESC');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('❌ Failed to fetch emails:', err);
//     res.status(500).json({ error: 'Failed to fetch emails from database' });
//   }
// });

// Generate a PDF of the latest HTML report using Playwright (server-side rendering)
app.get('/report-pdf', async (req, res) => {
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    // Load the requested report HTML so relative assets resolve correctly
    const requestedPath = req.query.path;
    const reportUrl = (requestedPath && String(requestedPath).startsWith('/reports/'))
      ? `${req.protocol}://${req.get('host')}${requestedPath}`
      : `${req.protocol}://${req.get('host')}/reports/report.html`;
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
      margin: { top: '20mm', bottom: '20mm', left: '12mm', right: '12mm' },
      preferCSSPageSize: true,
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