(() => {
  'use strict';

  /* year */
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* reduced motion */
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* topbar elevation */
  const topbar = document.querySelector('[data-elevate]');
  const updateTopbar = () => {
    if (!topbar) return;
    topbar.classList.toggle('is-raised', window.scrollY > 8);
  };
  updateTopbar();
  window.addEventListener('scroll', updateTopbar, { passive: true });

  /* mobile nav */
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav       = document.querySelector('[data-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  /* active nav link */
  const navLinks = [...document.querySelectorAll('[data-nav] a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const setActive = () => {
    const pos = window.scrollY + 80;
    let cur = '';
    for (const s of sections) if (s.offsetTop <= pos) cur = s.id;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  };
  setActive();
  window.addEventListener('scroll', setActive, { passive: true });

  /* reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* parallax */
  const parEls = [...document.querySelectorAll('[data-parallax]')];
  let raf = 0;
  const tick = () => {
    raf = 0;
    const y = window.scrollY || 0;
    parEls.forEach(el => {
      const s = parseFloat(el.getAttribute('data-parallax')) || 0;
      const v = Math.max(-130, Math.min(130, y * s * 0.38));
      el.style.transform = `translate3d(0,${v}px,0)`;
    });
  };
  window.addEventListener('scroll', () => {
    if (reduced || !parEls.length) return;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  if (!reduced) tick();

  /* project filters */
  const filterBtns   = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.pgrid [data-tags]');
  const applyFilter  = (key) => {
    projectCards.forEach(c => {
      const tags = (c.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
      c.style.display = (key === 'all' || tags.includes(key)) ? '' : 'none';
    });
  };
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });
})();
