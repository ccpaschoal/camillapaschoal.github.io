/* ══════════════════════════════════════════════════════════════
   Camilla Paschoal · Portfólio
   ══════════════════════════════════════════════════════════════ */

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initActiveSection();
  initStagger();
  initTiles();
  initCarousels();
  const openLightbox = initLightbox();
  initMarquee(openLightbox);
  initHeroPhone();
  initCounters();
  initStory();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ── Modo claro / escuro ──────────────────────────────────────── */

function initTheme() {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const metaColor = document.querySelector('meta[name="theme-color"]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const apply = (theme, animate) => {
    if (animate && !reduceMotion) {
      root.classList.add('theme-transition');
      setTimeout(() => root.classList.remove('theme-transition'), 450);
    }
    const dark = theme === 'dark';
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
    metaColor.setAttribute('content', dark ? '#16324A' : '#6BA3D8');
  };

  apply(root.getAttribute('data-theme') || 'light', false);

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next, true);
    try { localStorage.setItem('tema', next); } catch (e) { /* navegação privada pode bloquear */ }
  });

  // Se a pessoa nunca escolheu pelo botão, acompanha a mudança do sistema
  systemDark.addEventListener('change', (event) => {
    let saved = null;
    try { saved = localStorage.getItem('tema'); } catch (e) { /* ignora */ }
    if (!saved) apply(event.matches ? 'dark' : 'light', true);
  });
}

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
  const sections = [...document.querySelectorAll('main section[id]')];
  const links = new Map(
    [...document.querySelectorAll('.nav-link')].map((link) => [link.getAttribute('href').slice(1), link])
  );

  // A seção ativa é a última cujo topo já passou de 40% da tela. No topo da página nenhuma fica marcada.
  let ticking = false;
  const update = () => {
    const line = window.innerHeight * 0.4;
    let current = null;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= line) current = section.id;
    });
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) current = sections[sections.length - 1].id;
    links.forEach((link, id) => link.classList.toggle('is-active', id === current));
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  // o navegador pode restaurar a posição da rolagem depois de carregar a página
  window.addEventListener('load', update);
  window.addEventListener('pageshow', update);
  update();
}

/* ── Animações de entrada ─────────────────────────────────────── */

function initStagger() {
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
  });
}

function initTiles() {
  const tiles = [...document.querySelectorAll('.tile')];

  // atraso em cascata entre quadrados vizinhos do mesmo grupo
  const groups = new Map();
  tiles.forEach((tile) => {
    const list = groups.get(tile.parentElement) || [];
    list.push(tile);
    groups.set(tile.parentElement, list);
  });
  groups.forEach((list) => list.forEach((tile, i) => tile.style.setProperty('--i', Math.min(i, 5))));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    tiles.forEach((tile) => tile.classList.add('is-in'));
    return;
  }

  let responded = false;
  const observer = new IntersectionObserver(
    (entries) => {
      responded = true;
      // entra quando aparece, some quando sai da tela e volta ao rolar de volta
      entries.forEach((entry) => entry.target.classList.toggle('is-in', entry.isIntersecting));
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
  );

  tiles.forEach((tile) => observer.observe(tile));

  // Segurança: se o navegador não responder, mostra tudo em vez de deixar o conteúdo invisível
  setTimeout(() => {
    if (!responded) tiles.forEach((tile) => tile.classList.add('is-in'));
  }, 3000);
}

/* ── Carrosséis ───────────────────────────────────────────────── */

function initCarousels() {
  document.querySelectorAll('.coverflow').forEach(initCoverflow);

  document.querySelectorAll('.carousel:not(.coverflow)').forEach((carousel) => {
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

/* ── Slides como garrafas: o do meio grande, os vizinhos menores ── */

function initCoverflow(carousel) {
  const rail = carousel.querySelector('.rail');
  const slides = [...rail.querySelectorAll('.slide')];
  const prev = carousel.querySelector('[data-dir="prev"]');
  const next = carousel.querySelector('[data-dir="next"]');
  if (!slides.length) return;

  // nome do carrossel grande e apagado no fundo
  const word = document.createElement('span');
  word.className = 'cf-word';
  word.setAttribute('aria-hidden', 'true');
  word.textContent = carousel.querySelector('h3').textContent;
  carousel.prepend(word);

  // contador e barrinha de progresso embaixo
  const footer = document.createElement('div');
  footer.className = 'cf-footer';
  footer.innerHTML = '<span class="cf-count"></span><span class="cf-bar"><span></span></span><span class="cf-hint">arraste ou use as setas</span>';
  rail.after(footer);
  const count = footer.querySelector('.cf-count');
  const bar = footer.querySelector('.cf-bar');

  // distância (em larguras de slide) e tamanho de cada posição a partir do meio
  const OFFSET = [0, 0.56, 0.98, 1.3];
  const SCALE = [1, 0.74, 0.56, 0.44];
  const OPACITY = [1, 0.92, 0.6, 0];
  const BRIGHT = [1, 0.72, 0.58, 0.5];

  let current = 0;

  const render = () => {
    const size = slides[0].offsetWidth;
    slides.forEach((slide, i) => {
      const d = i - current;
      const ad = Math.min(Math.abs(d), 3);
      const x = Math.sign(d) * OFFSET[ad] * size;
      slide.style.transform = `translateX(${x.toFixed(1)}px) scale(${SCALE[ad]})`;
      slide.style.opacity = OPACITY[ad];
      slide.style.filter = ad ? `brightness(${BRIGHT[ad]})` : 'none';
      slide.style.zIndex = 10 - ad;
      slide.style.visibility = Math.abs(d) > 3 ? 'hidden' : 'visible';
      slide.classList.toggle('is-center', d === 0);
      slide.tabIndex = d === 0 ? 0 : -1;
      slide.setAttribute('aria-hidden', String(d !== 0));
    });
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    bar.style.setProperty('--cf-progress', `${((current + 1) / slides.length) * 100}%`);
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  };

  const go = (index) => {
    current = Math.max(0, Math.min(slides.length - 1, index));
    render();
  };

  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));

  // Clicar num vizinho traz ele para o meio (sem abrir a imagem); o do meio abre em tela cheia
  slides.forEach((slide, i) => {
    slide.addEventListener('click', (event) => {
      if (dragged) {
        event.stopImmediatePropagation();
        return;
      }
      if (i !== current) {
        event.stopImmediatePropagation();
        go(i);
      }
    });
  });

  rail.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(current - 1); slides[current].focus(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(current + 1); slides[current].focus(); }
  });

  // Arrastar com o mouse ou o dedo
  let startX = null;
  let dragged = false;
  rail.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    startX = event.clientX;
    dragged = false;
  });
  rail.addEventListener('pointermove', (event) => {
    if (startX === null) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 8) {
      dragged = true;
      rail.classList.add('is-dragging');
    }
    // cada meio slide arrastado passa um slide
    if (Math.abs(delta) > slides[0].offsetWidth * 0.45) {
      go(current + (delta < 0 ? 1 : -1));
      startX = event.clientX;
    }
  });
  const end = () => {
    startX = null;
    rail.classList.remove('is-dragging');
    // o clique que vem logo depois do arraste não deve abrir a imagem
    setTimeout(() => { dragged = false; }, 0);
  };
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);
  rail.addEventListener('pointerleave', () => { if (startX !== null) end(); });

  window.addEventListener('resize', render);
  render();
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

      // Versão mini (360px). Não usa loading="lazy": a faixa se move por animação, sem rolar a
      // página, e o Chrome/Safari do celular nem sempre percebem que a imagem entrou na tela.
      const img = document.createElement('img');
      img.dataset.src = slide.querySelector('img').getAttribute('src').replace('-thumb.webp', '-mini.webp');
      img.alt = '';
      img.decoding = 'async';
      img.fetchPriority = 'low';

      item.append(img);
      item.addEventListener('click', () => openLightbox(slide, item));
      group.append(item);
    });
    return group;
  };

  // Dois grupos iguais: quando o primeiro sai da tela, o segundo ocupa o lugar e o loop não tem emenda
  track.append(buildGroup(), buildGroup());

  // Baixa as minis depois que o essencial da página carregou
  const loadImages = () => {
    track.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  };
  if (document.readyState === 'complete') loadImages();
  else window.addEventListener('load', loadImages, { once: true });

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
