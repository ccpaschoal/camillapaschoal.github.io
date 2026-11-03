/* ══════════════════════════════════════════════════════════════
   Camilla Paschoal · Portfólio
   ══════════════════════════════════════════════════════════════ */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveSection();
  initReveal();
  initCarousels();
  initLightbox();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ── Navbar e menu mobile ─────────────────────────────────────── */

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('click', (event) => {
    if (menu.classList.contains('is-open') && !navbar.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Destaca no menu a seção visível ──────────────────────────── */

function initActiveSection() {
  const links = new Map(
    [...document.querySelectorAll('.nav-link')].map((link) => [link.getAttribute('href').slice(1), link])
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove('is-active'));
        links.get(entry.target.id)?.classList.add('is-active');
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}

/* ── Animação de entrada ──────────────────────────────────────── */

function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

/* ── Carrosséis ───────────────────────────────────────────────── */

function initCarousels() {
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const rail = carousel.querySelector('.rail');
    const prev = carousel.querySelector('[data-dir="prev"]');
    const next = carousel.querySelector('[data-dir="next"]');

    const step = () => {
      const slide = rail.querySelector('.slide');
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 16;
      return slide ? slide.offsetWidth + gap : rail.clientWidth;
    };

    const updateButtons = () => {
      const max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    };

    prev.addEventListener('click', () => rail.scrollBy({ left: -step() }));
    next.addEventListener('click', () => rail.scrollBy({ left: step() }));
    rail.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });
}

/* ── Lightbox: abre as imagens dos carrosséis em tela cheia ───── */

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const image = lightbox.querySelector('.lightbox-img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let slides = [];
  let index = 0;
  let title = '';
  let lastFocus = null;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    const img = slides[index].querySelector('img');
    image.src = img.currentSrc || img.src;
    image.alt = img.alt;
    caption.textContent = `${title} · ${index + 1} de ${slides.length}`;
  };

  const open = (slide) => {
    const carousel = slide.closest('.carousel');
    slides = [...carousel.querySelectorAll('.slide')];
    title = carousel.querySelector('h3').textContent;
    lastFocus = slide;
    show(slides.indexOf(slide));
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    lastFocus?.focus();
  };

  document.querySelectorAll('.slide').forEach((slide) => {
    slide.addEventListener('click', () => open(slide));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
    if (event.key === 'Tab') {
      // mantém o foco dentro da janela enquanto ela está aberta
      const focusable = [closeBtn, prevBtn, nextBtn];
      const i = focusable.indexOf(document.activeElement);
      event.preventDefault();
      focusable[(i + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
    }
  });

  // Deslizar o dedo para trocar de imagem no celular
  let touchX = null;
  lightbox.addEventListener('touchstart', (event) => { touchX = event.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (event) => {
    if (touchX === null) return;
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 50) show(index + (delta < 0 ? 1 : -1));
    touchX = null;
  });
}
