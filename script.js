(() => {
  'use strict';
  document.documentElement.classList.add('js');

  /* año */
  document.querySelectorAll('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* borde de la barra al scrollear */
  const topbar = document.querySelector('[data-elevate]');
  const onScrollBar = () => topbar && topbar.classList.toggle('is-raised', window.scrollY > 8);

  /* menú mobile */
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const setOpen = (open) => {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  /* link activo */
  const links = [...document.querySelectorAll('[data-nav] a[href^="#"]')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const onScrollNav = () => {
    const pos = window.scrollY + 120;
    let cur = '';
    for (const s of sections) if (s.offsetTop <= pos) cur = s.id;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  };

  window.addEventListener('scroll', () => { onScrollBar(); onScrollNav(); }, { passive: true });
  onScrollBar(); onScrollNav();

  /* aparición al scrollear */
  const reveals = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* filtros de proyectos */
  const filters = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('[data-tags]');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-filter');
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    items.forEach(it => {
      const tags = (it.getAttribute('data-tags') || '').split(/\s+/);
      it.hidden = !(key === 'all' || tags.includes(key));
    });
  }));
})();
