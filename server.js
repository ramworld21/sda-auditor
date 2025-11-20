import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { chromium } from 'playwright';
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
app.post('/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for CAPTCHA if detected
    let captcha = await page.$('iframe[src*="captcha"], .g-recaptcha');
    if (captcha) {
      console.log('CAPTCHA detected! Please solve it manually in the browser...');
      while (captcha) {
        await page.waitForTimeout(5000);
        captcha = await page.$('iframe[src*="captcha"], .g-recaptcha');
      }
    }

    // Example: take screenshot and save to reports folder
    const screenshotPath = path.join(__dirname, 'reports', 'screenshot.png');
    await page.screenshot({ path: screenshotPath });

    await browser.close();

    res.json({ result: `Scan completed. Screenshot saved at /reports/screenshot.png` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SDA Auditor backend running on port ${PORT}`);
});