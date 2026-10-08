// Elemen kartun yang akan digilir
const CARTOONS = ['🐰', '🐱', '🐶', '🐻', '🐼', '🦊', '🐸', '🦄', '🌸', '⭐', '💕', '🌈', '🦋', '🍀', '🎈', '🎀'];

function getRandomCartoons() {
  const shuffled = [...CARTOONS].sort(() => 0.5 - Math.random());
  return {
    topLeft: shuffled[0],
    topRight: shuffled[1],
    bottomLeft: shuffled[2],
    bottomRight: shuffled[3]
  };
}

async function loadPhotos() {
  const loading = document.getElementById('loading');
  const empty = document.getElementById('empty');
  const gallery = document.getElementById('gallery');

  try {
    const res = await fetch('/api/photos');
    const photos = await res.json();

    loading.style.display = 'none';

    if (!photos || photos.length === 0) {
      empty.style.display = 'block';
      return;
    }

    gallery.innerHTML = photos.map((photo, index) => {
      const cartoons = getRandomCartoons();
      return `
        <div class="photo-card" style="animation-delay: ${index * 0.08}s">
          <span class="cartoon top-left">${cartoons.topLeft}</span>
          <span class="cartoon top-right">${cartoons.topRight}</span>
          <span class="cartoon bottom-left">${cartoons.bottomLeft}</span>
          <span class="cartoon bottom-right">${cartoons.bottomRight}</span>

          <div class="photo-frame">
            <img 
              src="${photo.url}" 
              alt="Foto ${index + 1}"
              loading="lazy"
              onclick="openLightbox('${photo.url}', '${photo.downloadUrl}')"
            >
          </div>

          <a href="${photo.downloadUrl}" class="btn-download" download>
            ⬇️ Download
          </a>
        </div>
      `;
    }).join('');
  } catch (err) {
    loading.innerHTML = '<p>Gagal memuat foto. Silakan refresh halaman.</p>';
    console.error(err);
  }
}

function openLightbox(imgUrl, downloadUrl) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const downloadBtn = document.getElementById('lightbox-download');

  img.src = imgUrl;
  downloadBtn.href = downloadUrl;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Tutup lightbox saat klik di luar
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') {
    closeLightbox();
  }
});

// Tutup dengan tombol Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Load foto saat halaman siap
document.addEventListener('DOMContentLoaded', loadPhotos);
