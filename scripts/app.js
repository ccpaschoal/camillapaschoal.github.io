/* ════════════════════════════════════════════════════════════════ */
/* APP.JS - Inicialização Principal                                 */
/* ════════════════════════════════════════════════════════════════ */

// Importar módulos (simulado com funções globais)
// Em produção, usar import/export

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Portfólio Camilla Paschoal iniciando...');
  
  // Inicializar componentes
  initNavigation();
  initScrollAnimations();
  initCarousels();
  initPortfolioFilters();
  initFloatingCTA();
  initFormValidation();
  
  console.log('✅ Todos os componentes inicializados');
});

/* ════════════════════════════════════════════════════════════════ */
/* UTILIDADES                                                       */
/* ════════════════════════════════════════════════════════════════ */

// Função para debug
const log = (msg, type = 'log') => {
  if (process.env.NODE_ENV === 'development') {
    console[type](msg);
  }
};

// Delay utility
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get element safely
const getEl = (selector) => document.querySelector(selector);
const getEls = (selector) => document.querySelectorAll(selector);

/* ════════════════════════════════════════════════════════════════ */
/* NAVEGAÇÃO                                                        */
/* ════════════════════════════════════════════════════════════════ */

function initNavigation() {
  const hamburger = getEl('.nav-toggle');
  const menu = getEl('.nav-menu');
  const navLinks = getEls('.nav-link');
  const navbar = getEl('.navbar');
  
  // Hamburger menu
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', menu.classList.contains('active'));
    });
  }
  
  // Fechar menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('active');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
      }
      updateActiveNav(link);
    });
  });
  
  // Scroll suave com anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = getEl(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Navbar sticky effect
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    // Atualizar nav ativa baseado no scroll
    updateActiveNavOnScroll();
  });
}

function updateActiveNav(link) {
  getEls('.nav-link').forEach(l => l.classList.remove('active'));
  link.classList.add('active');
}

function updateActiveNavOnScroll() {
  const sections = getEls('section[id]');
  const navLinks = getEls('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ════════════════════════════════════════════════════════════════ */
/* SCROLL ANIMATIONS (Intersection Observer)                        */
/* ════════════════════════════════════════════════════════════════ */

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  getEls('.scroll-fade').forEach(el => {
    observer.observe(el);
  });
  
  // Observar cards, items e outros elementos
  getEls('.card, .portfolio-item, .feature-item, .service-card').forEach(el => {
    observer.observe(el);
  });
}

/* ════════════════════════════════════════════════════════════════ */
/* CARROSSÉIS                                                       */
/* ════════════════════════════════════════════════════════════════ */

function initCarousels() {
  const carouselBtns = getEls('.carousel-btn');
  
  carouselBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const railId = btn.dataset.rail;
      const direction = btn.dataset.dir;
      const rail = getEl(`#${railId}`);
      
      if (rail) {
        const slideWidth = rail.firstElementChild.offsetWidth + 14;
        const scrollAmount = direction === 'next' ? slideWidth : -slideWidth;
        
        rail.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Teclado (Arrow keys para navegação)
  getEls('.rail').forEach(rail => {
    rail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        rail.scrollBy({ left: 340, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        rail.scrollBy({ left: -340, behavior: 'smooth' });
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════════ */
/* FILTROS DE PORTFÓLIO                                             */
/* ════════════════════════════════════════════════════════════════ */

function initPortfolioFilters() {
  const filterBtns = getEls('.filter-btn');
  const portfolioItems = getEls('.portfolio-item');
  
  if (filterBtns.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Atualizar botão ativo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filtrar items
      portfolioItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.classList.add('visible');
          }, 10);
        } else {
          item.classList.remove('visible');
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ════════════════════════════════════════════════════════════════ */
/* FLOATING CTA BUTTON                                              */
/* ════════════════════════════════════════════════════════════════ */

function initFloatingCTA() {
  const floatingCta = getEl('.floating-cta');
  
  if (!floatingCta) return;
  
  // Mostrar/esconder com scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 500) {
      floatingCta.style.opacity = '1';
      floatingCta.style.pointerEvents = 'auto';
    } else {
      floatingCta.style.opacity = '0.3';
      floatingCta.style.pointerEvents = 'none';
    }
    
    lastScroll = currentScroll;
  });
}

/* ════════════════════════════════════════════════════════════════ */
/* FORM VALIDATION                                                  */
/* ════════════════════════════════════════════════════════════════ */

function initFormValidation() {
  const forms = getEls('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════════ */
/* LAZY LOADING IMAGES                                              */
/* ════════════════════════════════════════════════════════════════ */

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    getEls('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/* ════════════════════════════════════════════════════════════════ */
/* PARALLAX EFFECT                                                  */
/* ════════════════════════════════════════════════════════════════ */

function initParallax() {
  const heroSection = getEl('.hero');
  
  if (!heroSection) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const speed = 0.5;
    heroSection.style.transform = `translateY(${scrolled * speed}px)`;
  }, { passive: true });
}

/* ════════════════════════════════════════════════════════════════ */
/* PERFORMANCE MONITORING                                           */
/* ════════════════════════════════════════════════════════════════ */

function initPerformanceMonitoring() {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.duration > 100) {
            console.warn(`⚠️ Slow Task: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // LongTask API não disponível
    }
  }
}

/* ════════════════════════════════════════════════════════════════ */
/* INICIAR PARALLAX E PERFORMANCE                                   */
/* ════════════════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
  initParallax();
  initLazyLoading();
  initPerformanceMonitoring();
});
