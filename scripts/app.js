/* ══════════════════════════════════════════════════════════════
   Camilla Paschoal · Portfólio
   ══════════════════════════════════════════════════════════════ */

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveSection();
  initStagger();
  initReveal();
  initCarousels();
  const openLightbox = initLightbox();
  initMarquee(openLightbox);
  initHeroPhone();
  initCounters();
  initStory();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ── Navbar, menu mobile e barra de progresso ─────────────────── */

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

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navbar.classList.toggle('is-scrolled', window.scrollY > 10);
    navbar.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
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

/* ── Animações de entrada ─────────────────────────────────────── */

function initStagger() {
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  let responded = false;
  const observer = new IntersectionObserver(
    (entries) => {
      responded = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((item) => observer.observe(item));

  // Segurança: se o navegador não responder, mostra tudo em vez de deixar o conteúdo invisível
  setTimeout(() => {
    if (!responded) items.forEach((item) => item.classList.add('is-visible'));
  }, 3000);
}

/* ── Carrosséis ───────────────────────────────────────────────── */

function initCarousels() {
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const rail = carousel.querySelector('.rail');
    const prev = carousel.querySelector('[data-dir="prev"]');
    const next = carousel.querySelector('[data-dir="next"]');

    rail.querySelectorAll('.slide').forEach((slide, i) => slide.style.setProperty('--i', Math.min(i, 5)));

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

/* ── Faixa com os posts dos carrosséis passando ───────────────── */

function initMarquee(openLightbox) {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Intercala os carrosséis (capa de cada um, depois o 1º slide de cada…) para variar o que aparece
  const carousels = [...document.querySelectorAll('.carousel')].map((c) => [...c.querySelectorAll('.slide')]);
  const longest = Math.max(...carousels.map((slides) => slides.length));
  const order = [];
  for (let i = 0; i < longest; i++) {
    carousels.forEach((slides) => slides[i] && order.push(slides[i]));
  }

  const buildGroup = () => {
    const group = document.createElement('div');
    group.className = 'marquee-group';
    order.forEach((slide) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'marquee-item';
      item.tabIndex = -1;

      const img = document.createElement('img');
      img.src = slide.querySelector('img').getAttribute('src');
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';

      item.append(img);
      item.addEventListener('click', () => openLightbox(slide, item));
      group.append(item);
    });
    return group;
  };

  // Dois grupos iguais: quando o primeiro sai da tela, o segundo ocupa o lugar e o loop não tem emenda
  track.append(buildGroup(), buildGroup());

  const setSpeed = () => {
    const pixelsPerSecond = 45;
    track.style.setProperty('--marquee-duration', `${track.scrollWidth / 2 / pixelsPerSecond}s`);
  };
  setSpeed();
  window.addEventListener('resize', setSpeed);
}

/* ── Celular do topo: troca as capas como num feed ────────────── */

function initHeroPhone() {
  const phone = document.querySelector('.hero-phone');
  if (!phone) return;

  const images = [...phone.querySelectorAll('.phone-media img')];
  const like = phone.querySelector('.phone-like');
  const dotsWrap = phone.querySelector('.phone-dots');

  dotsWrap.innerHTML = images.map(() => '<span></span>').join('');
  const dots = [...dotsWrap.children];

  const load = (img) => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  };

  let current = 0;
  let likeTimer;
  dots[0].classList.add('is-active');

  const show = (index) => {
    images[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = index;
    load(images[current]);
    images[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    load(images[(current + 1) % images.length]);

    // o coração "curte" cada post logo depois que ele aparece
    like.classList.remove('is-liked');
    clearTimeout(likeTimer);
    likeTimer = setTimeout(() => like.classList.add('is-liked'), 900);
  };

  if (reduceMotion) return;

  // espera a página carregar para não competir com o que é mais importante
  window.addEventListener('load', () => {
    load(images[1]);
    setInterval(() => {
      if (!document.hidden) show((current + 1) % images.length);
    }, 2800);
  });
}

/* ── Números que contam até o valor final ─────────────────────── */

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const totals = {
    projects: document.querySelectorAll('.carousel').length,
    slides: document.querySelectorAll('.carousel .slide').length,
  };

  counters.forEach((el) => {
    if (el.dataset.count in totals) el.dataset.count = totals[el.dataset.count];
    el.textContent = reduceMotion ? el.dataset.count : '0';
  });

  if (reduceMotion) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  let responded = false;
  const observer = new IntersectionObserver(
    (entries) => {
      responded = true;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animate(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));

  setTimeout(() => {
    if (!responded) counters.forEach((el) => { el.textContent = el.dataset.count; });
  }, 3000);
}

/* ── Diferenciais: o celular troca de imagem conforme o texto ─── */

function initStory() {
  const steps = document.querySelectorAll('.story-step');
  const images = document.querySelectorAll('.story-phone .phone-media img');
  const like = document.querySelector('.story-phone .phone-like');
  if (!steps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const step = entry.target.dataset.step;
        steps.forEach((s) => s.classList.toggle('is-active', s === entry.target));
        images.forEach((img) => img.classList.toggle('is-active', img.dataset.step === step));
        like.classList.remove('is-liked');
        void like.offsetWidth; // reinicia a animação do coração
        like.classList.add('is-liked');
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );

  steps.forEach((step) => observer.observe(step));
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

  const fullSrc = (slide) => {
    const img = slide.querySelector('img');
    return img.dataset.full || img.getAttribute('src');
  };

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    const img = slides[index].querySelector('img');
    // mostra a miniatura (já carregada) na hora e troca pela versão grande quando ela chegar
    image.src = img.currentSrc || img.src;
    const full = new Image();
    const target = index;
    full.onload = () => { if (target === index) image.src = full.src; };
    full.src = fullSrc(slides[index]);
    image.alt = img.alt;
    caption.textContent = `${title} · ${index + 1} de ${slides.length}`;

    // adianta o download da próxima e da anterior
    [index + 1, index - 1].forEach((n) => {
      new Image().src = fullSrc(slides[(n + slides.length) % slides.length]);
    });
  };

  const open = (slide, returnFocusTo = slide) => {
    const carousel = slide.closest('.carousel');
    slides = [...carousel.querySelectorAll('.slide')];
    title = carousel.querySelector('h3').textContent;
    lastFocus = returnFocusTo;
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
    lastFocus?.focus({ preventScroll: true });
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

  return open;
}
