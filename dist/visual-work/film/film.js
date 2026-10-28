(() => {
  const links = [...document.querySelectorAll('[data-film-image]')];
  const dialog = document.querySelector('.film-lightbox');
  if (!links.length || !dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('[data-film-caption]');
  const position = dialog.querySelector('[data-film-position]');
  const close = dialog.querySelector('[data-film-close]');
  const previous = dialog.querySelector('[data-film-prev]');
  const next = dialog.querySelector('[data-film-next]');
  let cropFrame = null;
  function fitCrop() {
    if (!cropFrame) return;
    const link = links[active], source = link.querySelector('img');
    const top = Number(link.dataset.cropTop || 0), bottom = Number(link.dataset.cropBottom || 0);
    const sw = Number(source.getAttribute('width')), sh = Number(source.getAttribute('height'));
    const wrap = cropFrame.parentElement;
    const ratio = sw / (sh * (1 - top - bottom));
    const width = Math.min(wrap.clientWidth, wrap.clientHeight * ratio);
    cropFrame.style.cssText = `position:relative;overflow:hidden;width:${width}px;height:${width / ratio}px`;
    image.style.cssText = `position:absolute;left:0;top:${-top * sh * width / sw}px;width:${width}px;height:${sh * width / sw}px;max-width:none;max-height:none`;
  }
  window.addEventListener('resize', fitCrop);
  let active = 0;
  let origin = null;
  function show(index) {
    active = (index + links.length) % links.length;
    const link = links[active];
    const source = link.querySelector('img');
    if (cropFrame) { cropFrame.replaceWith(image); cropFrame = null; }
    image.removeAttribute('style');
    if (link.hasAttribute('data-crop-top')) {
      cropFrame = document.createElement('div');
      image.replaceWith(cropFrame); cropFrame.append(image);
      requestAnimationFrame(fitCrop);
    }
    image.src = link.href;
    image.alt = source ? source.alt : '';
    caption.textContent = link.dataset.filmCaption || image.alt;
    position.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(links.length).padStart(2, '0');
    previous.disabled = links.length < 2;
    next.disabled = links.length < 2;
  }
  links.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault();
    origin = link;
    show(index);
    dialog.showModal();
    fitCrop();
    close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(active - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(active + 1); }
  });
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    if (origin && document.contains(origin)) origin.focus({preventScroll:true});
  });
})();
