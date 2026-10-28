(() => {
  'use strict';
  const lightbox = document.querySelector('.fg-essay-lightbox');
  const largeImage = lightbox.querySelector('img');
  const largeCaption = lightbox.querySelector('[data-essay-caption]');
  let imageFocus = null;
  document.querySelectorAll('[data-essay-open]').forEach(link => link.addEventListener('click', event => {
    if (!lightbox.showModal) return;
    event.preventDefault();
    imageFocus = link;
    largeImage.src = link.href;
    largeImage.alt = link.querySelector('img').alt;
    largeCaption.textContent = link.closest('figure').querySelector('figcaption span:last-child').textContent;
    lightbox.showModal();
    lightbox.querySelector('[data-essay-close]').focus();
  }));
  lightbox.querySelector('[data-essay-close]').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => imageFocus?.focus({ preventScroll: true }));
})();
