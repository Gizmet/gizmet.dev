/* Mark the section closest to the reading line without changing native scrolling. */
(() => {
  const nav = document.querySelector('.publication-toc') || document.querySelector('.research-jump');
  if (!nav) return;
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const entries = links.map(link => ({ link, section: document.querySelector(link.getAttribute('href')) })).filter(entry => entry.section);
  let frame = 0;
  const update = () => {
    frame = 0;
    const line = innerHeight * .32;
    let current = entries[0];
    for (const entry of entries) if (entry.section.getBoundingClientRect().top <= line) current = entry;
    for (const entry of entries) {
      if (entry === current) entry.link.setAttribute('aria-current','location');
      else entry.link.removeAttribute('aria-current');
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  addEventListener('hashchange', schedule);
  update();
})();
