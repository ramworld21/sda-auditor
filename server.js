import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix: define __dirname BEFORE using it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// POST /scan - expects { url: "https://example.com" }
app.post('/scan', (req, res) => {
  const { url, fastMode } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  const fastFlag = fastMode ? '--fast' : '';
  const cmd = `node cli.js "${url}" ${fastFlag}`.trim();
  exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }
    res.json({ result: stdout });
  });
});

// Lightweight health endpoint for frontend checks
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Generate a PDF of the latest HTML report using Playwright (server-side rendering)
app.get('/report-pdf', async (req, res) => {
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    // Load the hosted report HTML so relative assets resolve correctly
    const reportUrl = `${req.protocol}://${req.get('host')}/reports/report.html`;
    await page.goto(reportUrl, { waitUntil: 'networkidle' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '18mm', bottom: '18mm', left: '12mm', right: '12mm' } });
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