/* ═══════════════════════════════════════════
   Krishna Dental Clinic — main.js
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────
     NAV — sticky & hamburger
  ────────────────────────────── */
  const nav         = document.getElementById('nav');
  const menuToggle  = document.getElementById('menuToggle');
  const mobileMenu  = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 60);
  });

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = menuToggle.querySelectorAll('span');
    const open  = mobileMenu.classList.contains('open');
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = open ? '0' : '1';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });

  document.querySelectorAll('.mm-link, .mm-book').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = '';
    });
  });

  /* ──────────────────────────────
     HERO — image zoom in
  ────────────────────────────── */
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80';
    img.onload = () => heroImg.classList.add('loaded');
  }

  /* ──────────────────────────────
     HERO — GSAP entrance
  ────────────────────────────── */
  function heroEntrance() {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to('#heroEyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('#heroH1',      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .to('#heroDesc',    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .to('#heroCtas',    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .to('#heroTrust',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
  }

  /* ──────────────────────────────
     GSAP — ScrollTrigger reveals
  ────────────────────────────── */
  function setupScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    heroEntrance();

    // Generic reveal-up elements
    document.querySelectorAll('.reveal-up').forEach(el => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        opacity: 1, y: 0,
        duration: 0.7,
        delay: parseFloat(el.style.getPropertyValue('--delay') || '0'),
        ease: 'power3.out',
      });
    });

    // reveal-left
    document.querySelectorAll('.reveal-left').forEach(el => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        opacity: 1, x: 0,
        duration: 0.9, ease: 'power3.out',
      });
    });

    // reveal-right
    document.querySelectorAll('.reveal-right').forEach(el => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        opacity: 1, x: 0,
        duration: 0.9, ease: 'power3.out',
      });
    });

    // Rating strip text marquee feel (subtle scale on scroll)
    gsap.fromTo('.rating-strip', { scale: 0.97 }, {
      scrollTrigger: { trigger: '.rating-strip', start: 'top 90%', once: true },
      scale: 1, duration: 0.6, ease: 'back.out(2)',
    });
  }

  /* ──────────────────────────────
     COUNTERS — animate on enter
  ────────────────────────────── */
  function animateCounters() {
    const items = document.querySelectorAll('.trust-num[data-target]');
    if (!items.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.target);
        const isFloat = el.dataset.target.includes('.');
        const duration = 1800;
        const start    = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease     = 1 - Math.pow(1 - progress, 3);
          const current  = target * ease;
          el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = isFloat ? target.toFixed(1) : target;
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    items.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────
     REVIEWS CAROUSEL
  ────────────────────────────── */
  function setupReviewsCarousel() {
    const track   = document.getElementById('reviewsTrack');
    const cards   = track ? track.querySelectorAll('.review-card') : [];
    const dotsWrap = document.getElementById('rvDots');
    const btnPrev  = document.getElementById('rvPrev');
    const btnNext  = document.getElementById('rvNext');

    if (!track || !cards.length) return;

    let current = 0;
    const cardWidth = () => cards[0].getBoundingClientRect().width + 28; // gap = 28px

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'rv-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, cards.length - 1));
      track.style.transform = `translateX(-${current * cardWidth()}px)`;
      dotsWrap.querySelectorAll('.rv-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    // Touch / drag
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    // Auto-advance
    setInterval(() => goTo((current + 1) % cards.length), 5000);
  }

  /* ──────────────────────────────
     INIT
  ────────────────────────────── */
  function init() {
    // Wait for GSAP to load
    if (typeof gsap !== 'undefined') {
      setupScrollAnimations();
    } else {
      // Fallback: show all elements immediately if GSAP fails to load
      document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      document.querySelectorAll('#heroEyebrow, #heroH1, #heroDesc, #heroCtas, #heroTrust').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }

    animateCounters();
    setupReviewsCarousel();
  }

  // GSAP loads with defer — wait a tick
  setTimeout(init, 100);

});