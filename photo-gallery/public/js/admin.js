const loginSection = document.getElementById('login-section');
const uploadSection = document.getElementById('upload-section');
const loginForm = document.getElementById('login-form');
const uploadForm = document.getElementById('upload-form');
const loginMessage = document.getElementById('login-message');
const uploadMessage = document.getElementById('upload-message');
const photoInput = document.getElementById('photo');
const preview = document.getElementById('preview');
const logoutBtn = document.getElementById('logout-btn');
const adminPhotoList = document.getElementById('admin-photo-list');

// Cek status login saat halaman dimuat
async function checkAuth() {
  try {
    const res = await fetch('/api/check-auth');
    const data = await res.json();
    if (data.isAdmin) {
      showUploadSection();
      loadAdminPhotos();
    }
  } catch (err) {
    console.error('Gagal cek auth:', err);
  }
}

function showUploadSection() {
  loginSection.style.display = 'none';
  uploadSection.style.display = 'block';
}

function showLoginSection() {
  loginSection.style.display = 'block';
  uploadSection.style.display = 'none';
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();

    if (data.success) {
      loginMessage.className = 'message success';
      loginMessage.textContent = data.message;
      setTimeout(() => {
        showUploadSection();
        loadAdminPhotos();
      }, 600);
    } else {
      loginMessage.className = 'message error';
      loginMessage.textContent = data.message || 'Password salah!';
    }
  } catch (err) {
    loginMessage.className = 'message error';
    loginMessage.textContent = 'Gagal terhubung ke server.';
  }
});

// Preview foto sebelum upload
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = '';
  }
});

// Upload foto
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = photoInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('photo', file);

  uploadMessage.className = 'message';
  uploadMessage.textContent = 'Mengupload...';
  uploadMessage.style.display = 'block';
  uploadMessage.style.background = '#FFF3CD';
  uploadMessage.style.color = '#856404';

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      uploadMessage.className = 'message success';
      uploadMessage.textContent = data.message;
      photoInput.value = '';
      preview.innerHTML = '';
      loadAdminPhotos();
    } else {
      uploadMessage.className = 'message error';
      uploadMessage.textContent = data.error || 'Gagal upload.';
    }
  } catch (err) {
    uploadMessage.className = 'message error';
    uploadMessage.textContent = 'Gagal terhubung ke server.';
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  showLoginSection();
  document.getElementById('password').value = '';
  loginMessage.className = 'message';
  loginMessage.style.display = 'none';
});

// Load daftar foto di admin
async function loadAdminPhotos() {
  try {
    const res = await fetch('/api/photos');
    const photos = await res.json();

    if (!photos || photos.length === 0) {
      adminPhotoList.innerHTML = '<p style="text-align:center;color:#A67C52;">Belum ada foto.</p>';
      return;
    }

    adminPhotoList.innerHTML = photos.map(photo => `
      <div class="admin-photo-item">
        <img src="${photo.url}" alt="${photo.filename}">
        <span>${photo.filename}</span>
        <button class="btn-delete" onclick="deletePhoto('${photo.filename}')">Hapus</button>
      </div>
    `).join('');
  } catch (err) {
    adminPhotoList.innerHTML = '<p style="text-align:center;color:#E74C3C;">Gagal memuat daftar foto.</p>';
  }
}

// Hapus foto
async function deletePhoto(filename) {
  if (!confirm(`Yakin ingin menghapus foto ini?\n${filename}`)) return;

  try {
    const res = await fetch(`/api/photos/${filename}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      loadAdminPhotos();
    } else {
      alert(data.error || 'Gagal menghapus foto.');
    }
  } catch (err) {
    alert('Gagal terhubung ke server.');
  }
}

// Init
document.addEventListener('DOMContentLoaded', checkAuth);
