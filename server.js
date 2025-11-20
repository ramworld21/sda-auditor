import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Allow all origins
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /scan - expects { url: "https://example.com" }
app.post('/scan', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

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
