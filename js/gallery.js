/* ═══════════════════════════════════════════
   Krishna Dental Clinic — gallery.js
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  if (!lightbox) return;

  // Collect all gallery images
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const images = items.map(item => ({
    src:     item.querySelector('img').src,
    caption: item.querySelector('.gi-overlay span')?.textContent || '',
  }));

  let current = 0;

  function openAt(index) {
    current = index;
    lbImg.src       = images[index].src;
    lbCaption.textContent = images[index].caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function prev() { openAt((current - 1 + images.length) % images.length); }
  function next() { openAt((current + 1) % images.length); }

  // Open on click
  items.forEach((item, i) => {
    item.addEventListener('click', () => openAt(i));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  // Close on backdrop click
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch swipe on lightbox
  let touchStart = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStart = e.touches[0].clientX;
  });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

});