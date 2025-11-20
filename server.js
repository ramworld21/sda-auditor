import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { chromium } from 'playwright';
import Solver from '2captcha';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix: define __dirname BEFORE using it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use('/reports', express.static(path.join(__dirname, 'reports')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(cors());
app.use(express.json());

// POST /scan - expects { url: "https://example.com" }
app.post('/scan', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  const { exec } = require('child_process');

  exec(`node cli.js "${url}"`, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }
    res.json({ result: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`SDA Auditor backend running on port ${PORT}`);
});