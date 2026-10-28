(() => {
  const printButtons = document.querySelectorAll('[data-print]');
  printButtons.forEach(button => button.addEventListener('click', () => window.print()));

  const sections = [...document.querySelectorAll('.paper-story > section[id]')];
  const navLinks = [...document.querySelectorAll('.paper-rail nav a[data-nav]')];
  const chapterNav = document.querySelector('.paper-rail nav');
  const progress = document.querySelector('[data-progress]');
  const story = document.querySelector('.paper-story');
  if (!sections.length || !progress || !story) return;

  let ticking = false;
  let lastActiveId = '';
  function updatePosition() {
    ticking = false;
    const marker = window.innerHeight * 0.38;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) active = section;
    }
    navLinks.forEach(link => {
      if (link.dataset.nav === active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (active.id !== lastActiveId && chapterNav && window.matchMedia('(max-width: 700px)').matches) {
      const selected = navLinks.find(link => link.dataset.nav === active.id);
      if (selected) {
        chapterNav.scrollTo({
          left: selected.offsetLeft - chapterNav.clientWidth / 2 + selected.clientWidth / 2,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
    }
    lastActiveId = active.id;
    const first = sections[0].offsetTop;
    const last = sections[sections.length - 1];
    const end = last.offsetTop + last.offsetHeight - window.innerHeight * 0.55;
    const value = Math.max(0, Math.min(1, (window.scrollY - first) / Math.max(1, end - first)));
    progress.style.transform = `scaleX(${value})`;
  }
  function queuePosition() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updatePosition);
    }
  }
  window.addEventListener('scroll', queuePosition, { passive: true });
  window.addEventListener('resize', queuePosition, { passive: true });
  queuePosition();

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const items = [...document.querySelectorAll('.cinema-image, .chapter-list article')];
    items.forEach(item => item.classList.add('motion-item'));
    story.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    items.forEach(item => observer.observe(item));
  }
})();
