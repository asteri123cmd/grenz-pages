/* ===================================================
   GRENZ — main.js  Interactive functionality
   =================================================== */
(function(){
'use strict';

/* ── State ── */
let currentLang = localStorage.getItem('grenz_lang') || 'pl';
let heroTimer, heroIndex = 0;
const HERO_INTERVAL = 5000;

/* ── DOMReady ── */
document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);
  initHeader();
  initMobileNav();
  initHeroSlider();
  initBeforeAfter();
  initFAQ();
  initCounters();
  initScrollReveal();
  initChartBars();
  initFloatContact();
  initCookieBanner();
  highlightActiveLangBtn();
});

/* ═══════════════════════════════════════════════════
   LANGUAGE
═══════════════════════════════════════════════════ */
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('grenz_lang', lang);
  const t = i18n[lang];
  if (!t) return;

  // html lang attr
  document.documentElement.lang = lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'pl';

  // Nav links
  setText('[data-t="nav.services"]',  t.nav.services);
  setText('[data-t="nav.about"]',     t.nav.about);
  setText('[data-t="nav.faq"]',       t.nav.faq);
  setText('[data-t="nav.contact"]',   t.nav.contact);
  setText('[data-t="nav.cta"]',       t.nav.cta);
  setText('[data-t="nav.mobile.services"]', t.nav.services);
  setText('[data-t="nav.mobile.about"]',    t.nav.about);
  setText('[data-t="nav.mobile.faq"]',      t.nav.faq);
  setText('[data-t="nav.mobile.contact"]',  t.nav.contact);

  // Hero
  updateHeroSlide(heroIndex);

  // CTAs
  setAll('[data-t="cta_main"]', t.cta_main);
  setAll('[data-t="cta_call"]', t.cta_call);

  // Stats
  const statItems = document.querySelectorAll('.stat-item');
  t.stats.forEach((s, i) => {
    if (statItems[i]) {
      const numEl = statItems[i].querySelector('.stat-num');
      const lblEl = statItems[i].querySelector('.stat-label');
      if (numEl) numEl.setAttribute('data-target', s.num);
      if (lblEl) lblEl.textContent = s.label;
    }
  });

  // Services title/sub
  setText('[data-t="services_title"]', t.services_title);
  setText('[data-t="services_sub"]',   t.services_sub);

  // Service cards
  const cards = document.querySelectorAll('.service-card');
  t.services.forEach((s, i) => {
    if (!cards[i]) return;
    setText(cards[i], '[data-t="s.title"]', s.title);
    setText(cards[i], '[data-t="s.sub"]',   s.sub);
    setText(cards[i], '[data-t="s.desc"]',  s.desc);
    setText(cards[i], '[data-t="s.link"]',  s.link);
    setText(cards[i], '[data-t="s.price"]', s.price);
  });

  // Why Us
  setText('[data-t="why_title"]', t.why_title);
  setText('[data-t="why_sub"]',   t.why_sub);
  const whyItems = document.querySelectorAll('.why-item');
  t.why.forEach((w, i) => {
    if (!whyItems[i]) return;
    setText(whyItems[i], '[data-t="w.title"]', w.title);
    setText(whyItems[i], '[data-t="w.desc"]',  w.desc);
  });

  // Before/After
  setText('[data-t="ba_title"]',  t.ba_title);
  setText('[data-t="ba_sub"]',    t.ba_sub);
  setText('[data-t="ba_before"]', t.ba_before);
  setText('[data-t="ba_after"]',  t.ba_after);

  // Market
  setText('[data-t="market_title"]', t.market_title);
  setText('[data-t="market_sub"]',   t.market_sub);
  setText('[data-t="market_chart_title"]', t.market_chart_title);
  const mStats = document.querySelectorAll('.market-stat-item');
  t.market_stats.forEach((m, i) => {
    if (!mStats[i]) return;
    setText(mStats[i], '[data-t="m.num"]',   m.num);
    setText(mStats[i], '[data-t="m.title"]', m.title);
    setText(mStats[i], '[data-t="m.desc"]',  m.desc);
  });

  // Process
  setText('[data-t="process_title"]', t.process_title);
  setText('[data-t="process_sub"]',   t.process_sub);
  const pSteps = document.querySelectorAll('.process-step');
  t.process.forEach((p, i) => {
    if (!pSteps[i]) return;
    setText(pSteps[i], '[data-t="p.title"]', p.title);
    setText(pSteps[i], '[data-t="p.desc"]',  p.desc);
  });

  // Reviews
  setText('[data-t="reviews_title"]', t.reviews_title);
  setText('[data-t="reviews_sub"]',   t.reviews_sub);
  setText('[data-t="reviews_link"]',  t.reviews_link);
  const rCards = document.querySelectorAll('.review-card');
  t.reviews.forEach((r, i) => {
    if (!rCards[i]) return;
    setText(rCards[i], '[data-t="r.text"]',   r.text);
    setText(rCards[i], '[data-t="r.name"]',   r.name);
  });

  // FAQ
  setText('[data-t="faq_title"]', t.faq_title);
  setText('[data-t="faq_sub"]',   t.faq_sub);
  const faqItems = document.querySelectorAll('.faq-item');
  t.faq.forEach((f, i) => {
    if (!faqItems[i]) return;
    setText(faqItems[i], '[data-t="f.q"]', f.q);
    setText(faqItems[i], '[data-t="f.a"]', f.a);
  });

  // Contact
  setText('[data-t="contact_title"]', t.contact_title);
  setText('[data-t="contact_sub"]',   t.contact_sub);
  setText('[data-t="contact_address"]', t.contact_address);
  setText('[data-t="contact_addr_val"]', t.contact_addr_val);
  setText('[data-t="contact_phone"]',   t.contact_phone);
  setText('[data-t="contact_hours"]',   t.contact_hours);
  setText('[data-t="contact_hours_val"]', t.contact_hours_val.replace(/\n/g,'<br>'));
  setHTML('[data-t="contact_hours_val"]', t.contact_hours_val.replace(/\n/g,'<br>'));
  setText('[data-t="contact_map"]',     t.contact_map);
  setText('[data-t="contact_social"]',  t.contact_social);

  // Footer
  setText('[data-t="footer_desc"]',     t.footer_desc);
  setText('[data-t="footer_links"]',    t.footer_links);
  setText('[data-t="footer_services_title"]', t.footer_services_title);
  setText('[data-t="footer_contact_title"]',  t.footer_contact_title);
  setText('[data-t="footer_rights"]',   t.footer_rights);
  setText('[data-t="footer_terms"]',    t.footer_terms);
  setText('[data-t="footer_privacy"]',  t.footer_privacy);
  setText('[data-t="footer_cookie"]',   t.footer_cookie);

  const footerNavLinks = document.querySelectorAll('[data-t^="footer_nav_"]');
  footerNavLinks.forEach((el, i) => { if (t.footer_links_list[i]) el.textContent = t.footer_links_list[i]; });
  const footerSvcLinks = document.querySelectorAll('[data-t^="footer_svc_"]');
  footerSvcLinks.forEach((el, i) => { if (t.footer_services_list[i]) el.textContent = t.footer_services_list[i]; });

  // Cookie
  const cookieText = document.querySelector('[data-t="cookie_text"]');
  if (cookieText) cookieText.textContent = t.cookie_text + ' ';
  setText('[data-t="cookie_policy"]', t.cookie_policy);
  setText('[data-t="cookie_accept"]', t.cookie_accept);
  setText('[data-t="cookie_decline"]', t.cookie_decline);

  // Badges (section labels with SVG icons)
  if (t.badges) {
    setText('[data-t="badge_services"]',     t.badges.services);
    setText('[data-t="badge_about"]',        t.badges.about);
    setText('[data-t="badge_realizations"]', t.badges.realizations);
    setText('[data-t="badge_market"]',       t.badges.market);
    setText('[data-t="badge_process"]',      t.badges.process);
    setText('[data-t="badge_reviews"]',      t.badges.reviews);
    setText('[data-t="badge_faq"]',          t.badges.faq);
    setText('[data-t="badge_contact"]',      t.badges.contact);
  }

  highlightActiveLangBtn();
}

function setText(scopeOrSelector, selectorOrText, text) {
  if (typeof scopeOrSelector === 'string') {
    const els = document.querySelectorAll(scopeOrSelector);
    els.forEach(el => { el.textContent = selectorOrText || ''; });
  } else {
    const scope = scopeOrSelector;
    if (!scope) return;
    if (text === undefined) { scope.textContent = selectorOrText; return; }
    const el = scope.querySelector(selectorOrText);
    if (el) el.textContent = text;
  }
}
function setHTML(selector, html) {
  const els = document.querySelectorAll(selector);
  els.forEach(el => { el.innerHTML = html; });
}
function setAll(selector, text) {
  document.querySelectorAll(selector).forEach(el => el.textContent = text);
}

function highlightActiveLangBtn() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

// Language button events
document.addEventListener('click', e => {
  if (e.target.matches('.lang-btn')) {
    applyLang(e.target.dataset.lang);
  }
});

/* ═══════════════════════════════════════════════════
   HERO SLIDER
═══════════════════════════════════════════════════ */
function updateHeroSlide(idx) {
  const t = i18n[currentLang];
  if (!t) return;
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));

  const slide = t.hero[idx];
  if (!slide) return;
  setText('[data-t="hero.badge"]',  slide.badge);
  const titleEl = document.querySelector('[data-t="hero.title"]');
  if (titleEl) {
    const parts = slide.title.split('\n');
    titleEl.innerHTML = parts.join('<br>') + (slide.hl ? ' <span class="hl">' + slide.hl + '</span>' : '');
  }
  setText('[data-t="hero.sub"]', slide.sub);
}

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { heroIndex = i; updateHeroSlide(i); resetTimer(); });
  });

  const prev = document.querySelector('.hero-arrow-left');
  const next = document.querySelector('.hero-arrow-right');
  if (prev) prev.addEventListener('click', () => { heroIndex = (heroIndex - 1 + slides.length) % slides.length; updateHeroSlide(heroIndex); resetTimer(); });
  if (next) next.addEventListener('click', () => { heroIndex = (heroIndex + 1) % slides.length; updateHeroSlide(heroIndex); resetTimer(); });

  // touch swipe
  let touchX = 0;
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { heroIndex = dx > 0 ? (heroIndex - 1 + slides.length) % slides.length : (heroIndex + 1) % slides.length; updateHeroSlide(heroIndex); resetTimer(); }
    }, { passive: true });
  }
  startTimer();
}

function startTimer() { heroTimer = setInterval(() => { heroIndex = (heroIndex + 1) % 5; updateHeroSlide(heroIndex); }, HERO_INTERVAL); }
function resetTimer() { clearInterval(heroTimer); startTimer(); }

/* ═══════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) mobileNav.classList.remove('open');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   MOBILE NAV
═══════════════════════════════════════════════════ */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!toggle || !mobileNav) return;
  toggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.addEventListener('click', e => { if (e.target === mobileNav) mobileNav.classList.remove('open'); });
}

/* ═══════════════════════════════════════════════════
   BEFORE / AFTER SLIDER
═══════════════════════════════════════════════════ */
function initBeforeAfter() {
  const wrap = document.querySelector('.ba-wrap');
  if (!wrap) return;
  const beforeWrap = wrap.querySelector('.ba-before-wrap');
  const handle = wrap.querySelector('.ba-handle');
  if (!beforeWrap || !handle) return;

  let dragging = false;
  let pct = 50;

  const setPos = (x) => {
    const rect = wrap.getBoundingClientRect();
    pct = Math.max(3, Math.min(97, ((x - rect.left) / rect.width) * 100));
    beforeWrap.style.width = pct + '%';
    handle.style.left = pct + '%';
  };

  handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  document.addEventListener('mouseup', () => { dragging = false; });
  handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
  document.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchend', () => { dragging = false; });
  wrap.addEventListener('click', e => setPos(e.clientX));
}

/* ═══════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════ */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ═══════════════════════════════════════════════════
   COUNTERS
═══════════════════════════════════════════════════ */
function initCounters() {
  const statsSection = document.querySelector('.stats-bar');
  if (!statsSection) return;
  let animated = false;

  const animate = () => {
    if (animated) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      animated = true;
      document.querySelectorAll('.stat-num').forEach(el => {
        const raw = el.getAttribute('data-target') || el.textContent;
        const isPercent = raw.includes('%');
        const isPlus = raw.includes('+');
        const num = parseInt(raw.replace(/[^\d]/g, ''));
        if (isNaN(num)) return;
        const duration = 1800;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * num);
          el.textContent = current + (isPlus ? '+' : '') + (isPercent ? '%' : '');
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }
  };
  window.addEventListener('scroll', animate, { passive: true });
  animate();
}

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════
   CHART BARS
═══════════════════════════════════════════════════ */
function initChartBars() {
  const chartSection = document.querySelector('.chart-wrap');
  if (!chartSection) return;
  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      document.querySelectorAll('.chart-bar').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('visible'), i * 120);
      });
    }
  }, { threshold: 0.3 });
  observer.observe(chartSection);
}

/* ═══════════════════════════════════════════════════
   FLOATING CONTACT BUTTON
═══════════════════════════════════════════════════ */
function initFloatContact() {
  const trigger = document.querySelector('.float-trigger');
  const menu = document.querySelector('.float-menu');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    trigger.classList.toggle('open', open);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.float-btn')) {
      menu.classList.remove('open');
      trigger.classList.remove('open');
    }
  });
}

/* ═══════════════════════════════════════════════════
   COOKIE BANNER
═══════════════════════════════════════════════════ */
function initCookieBanner() {
  if (localStorage.getItem('grenz_cookie')) return;
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  banner.style.display = 'block';
  setTimeout(() => banner.classList.add('show'), 400);

  const accept = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  const dismiss = () => {
    banner.classList.remove('show');
    setTimeout(() => { banner.style.display = 'none'; }, 500);
    localStorage.setItem('grenz_cookie', '1');
  };
  if (accept) accept.addEventListener('click', dismiss);
  if (decline) decline.addEventListener('click', dismiss);
}

/* ═══════════════════════════════════════════════════
   ACTIVE NAV on scroll
═══════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const sections = ['services','why','faq','contact'];
  const scrollY = window.scrollY + 100;
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.style.color = (scrollY >= top && scrollY < bottom) ? 'var(--neon)' : '';
  });
}, { passive: true });

})();
