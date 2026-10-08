# 📸 Galeri Foto Lucu

Website galeri foto publik dengan fitur upload khusus admin.

## Fitur
- ✅ Siapa saja bisa melihat foto
- ✅ Siapa saja bisa download foto
- ✅ Hanya admin yang bisa upload foto (password protected)
- ✅ Background cream soft
- ✅ Setiap foto dihiasi bingkai warna-warni + stiker kartun
- ✅ Responsive (HP & Desktop)
- ✅ Lightbox saat foto diklik

## Cara Menjalankan di Komputer Sendiri

```bash
cd photo-gallery
npm install
npm start
```

- Galeri publik  → http://localhost:3000
- Halaman admin  → http://localhost:3000/admin
- Password admin → `admin123`

## Ganti Password Admin

Di file `server.js` atau lewat Environment Variable:
```
ADMIN_PASSWORD=passwordbaruanda
```

---

## 🚀 Deploy ke Internet (Gratis) — Render.com

### Langkah-langkah:

1. **Buat akun GitHub** (kalau belum punya) → https://github.com

2. **Upload kode ke GitHub**
   - Buat repository baru (misalnya: `galeri-foto`)
   - Upload semua file di dalam folder `photo-gallery` ke repository tersebut

3. **Daftar di Render** → https://render.com  
   (bisa login pakai akun GitHub, **tidak perlu kartu kredit**)

4. **Buat Web Service baru**
   - Klik **New +** → **Web Service**
   - Pilih repository GitHub yang tadi
   - Isi pengaturan:
     | Setting          | Isi                  |
     |------------------|----------------------|
     | Name             | galeri-foto (bebas)  |
     | Runtime          | Node                 |
     | Build Command    | `npm install`        |
     | Start Command    | `npm start`          |
     | Instance Type    | **Free**             |

5. **Tambah Environment Variable** (opsional tapi disarankan)
   - Klik **Advanced** → **Add Environment Variable**
   - Key: `ADMIN_PASSWORD`
   - Value: password yang kamu mau (contoh: `fotoku2026`)

6. Klik **Create Web Service**

7. Tunggu 2–5 menit sampai status **Live**

8. Buka URL yang diberikan Render (contoh: `https://galeri-foto-xxxx.onrender.com`)

### Catatan Penting tentang Penyimpanan Foto

Di **paket gratis** Render:
- File yang di-upload akan **hilang** kalau server restart / sleep / redeploy.
- Server gratis akan tidur setelah 15 menit tidak ada pengunjung (cold start ±1 menit).

**Solusi jika ingin foto permanen:**
- Nanti bisa upgrade ke paket berbayar + Persistent Disk, atau
- Gunakan layanan cloud storage seperti Cloudinary / Supabase Storage (gratis juga).

---

## Struktur Folder
```
photo-gallery/
├── server.js
├── package.json
├── uploads/
└── public/
    ├── index.html
    ├── admin.html
    ├── css/style.css
    └── js/
        ├── main.js
        └── admin.js
```

Dibuat dengan 💛
