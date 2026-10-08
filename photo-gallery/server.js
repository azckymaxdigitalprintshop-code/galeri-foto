const express = require('express');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Pastikan folder uploads ada
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

app.use(session({
  secret: 'galeri-foto-rahasia-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 hari
}));

// Konfigurasi Multer untuk upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'foto-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan (jpg, png, gif, webp)'));
    }
  }
});

// Password admin — bisa diganti lewat Environment Variable di hosting
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware cek login admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Silakan login dulu.' });
}

// === ROUTES ===

// Login admin
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.json({ success: true, message: 'Login berhasil!' });
  } else {
    res.status(401).json({ success: false, message: 'Password salah!' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Cek status login
app.get('/api/check-auth', (req, res) => {
  res.json({ isAdmin: !!(req.session && req.session.isAdmin) });
});

// Ambil daftar semua foto
app.get('/api/photos', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal membaca folder foto' });
    }
    const photos = files
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map(f => ({
        filename: f,
        url: `/uploads/${f}`,
        downloadUrl: `/download/${f}`
      }))
      .sort((a, b) => b.filename.localeCompare(a.filename)); // terbaru di atas
    res.json(photos);
  });
});

// Upload foto (hanya admin)
app.post('/api/upload', requireAdmin, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang diupload' });
  }
  res.json({
    success: true,
    message: 'Foto berhasil diupload!',
    photo: {
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`
    }
  });
});

// Download foto
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  // Cegah path traversal
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return res.status(400).send('Invalid filename');
  }

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename);
  } else {
    res.status(404).send('Foto tidak ditemukan');
  }
});

// Hapus foto (opsional, hanya admin)
app.delete('/api/photos/:filename', requireAdmin, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  if (!filename || filename.includes('..')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Foto berhasil dihapus' });
  } else {
    res.status(404).json({ error: 'Foto tidak ditemukan' });
  }
});

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Halaman admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Galeri Foto berjalan di http://localhost:${PORT}`);
  console.log(`📷 Halaman publik  : http://localhost:${PORT}`);
  console.log(`🔐 Halaman admin   : http://localhost:${PORT}/admin`);
  console.log(`🔑 Password admin  : ${ADMIN_PASSWORD}\n`);
});
