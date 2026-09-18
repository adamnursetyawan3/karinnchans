import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

const distIndex = path.join(__dirname, 'dist', 'index.html');
const staticDir = fs.existsSync(distIndex) ? path.join(__dirname, 'dist') : __dirname;

// MELAYANI FILE STATIS WEB
app.use(express.static(staticDir));
app.use('/cv', express.static(path.join(__dirname, 'cv')));

// RUTE DOWNLOAD FILE PDF CV
app.get(['/cv/cv.pdf', '/cv.pdf', '/download-cv', '/cv/download'], (req, res) => {
  const pdfCandidates = [
    path.join(staticDir, 'cv', 'cv.pdf'),
    path.join(__dirname, 'cv', 'cv.pdf'),
    path.join(staticDir, 'cv.pdf'),
    path.join(__dirname, 'cv.pdf')
  ];
  for (const p of pdfCandidates) {
    if (fs.existsSync(p)) {
      return res.download(p, 'CV-Adam-Nur-Setyawan.pdf');
    }
  }
  res.status(404).send('File CV PDF tidak ditemukan');
});

// RUTE KHUSUS HALAMAN RESUME & CURRICULUM VITAE (CV)
app.get(['/cv', '/cv/', '/resume', '/resume/', '/cv.html', '/resume.html'], (req, res) => {
  const cvPath = path.join(staticDir, 'cv', 'index.html');
  const localCvPath = path.join(__dirname, 'cv', 'index.html');
  
  if (fs.existsSync(cvPath)) {
    return res.sendFile(cvPath);
  }
  if (fs.existsSync(localCvPath)) {
    return res.sendFile(localCvPath);
  }
  res.sendFile(path.join(staticDir, 'index.html'));
});

// RUTE CADANGAN (FALLBACK) KE INDEX.HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
