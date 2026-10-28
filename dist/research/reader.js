/* PDFs stay unloaded until requested; closing releases the viewer. */
const toggle = document.querySelector('.reader-toggle');
const frame = document.getElementById('pdf-frame');
if (toggle && frame) {
  toggle.hidden = false;
  function closeReader() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Load PDF reader ↓';
    frame.replaceChildren();
    frame.hidden = true;
    toggle.focus({preventScroll:true});
    toggle.scrollIntoView({behavior:'instant',block:'center'});
  }
  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') { closeReader(); return; }
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = 'Close PDF reader ↑';
    frame.hidden = false;
    const bar = document.createElement('div');
    bar.className = 'pdf-reader-bar';
    bar.innerHTML = '<span>Complete original PDF</span><button type="button">Close reader ×</button>';
    bar.querySelector('button').addEventListener('click', closeReader);
    const viewer = document.createElement('iframe');
    viewer.title = document.querySelector('h1').textContent + ', complete PDF';
    viewer.src = toggle.dataset.pdf;
    frame.replaceChildren(bar, viewer);
    frame.scrollIntoView({behavior:'instant',block:'start'});
  });
}

// Selected document pages remain ordinary PDF links without JavaScript.
const previews = [...document.querySelectorAll('[data-page-preview]')];
if (previews.length) {
  const viewer = document.createElement('dialog');
  viewer.className = 'document-lightbox';
  viewer.setAttribute('aria-labelledby', 'document-viewer-title');
  viewer.innerHTML = `<div class="document-toolbar"><strong id="document-viewer-title">Selected document page</strong><button type="button" data-document-close>Close ×</button></div><div class="document-stage" tabindex="0" aria-label="Document page. When zoomed, scroll to read the page."><img alt=""></div><div class="document-viewer-bottom"><p data-document-caption aria-live="polite"></p><div class="document-tools"><button type="button" data-document-prev aria-label="Previous selected page">←</button><button type="button" data-document-next aria-label="Next selected page">→</button><button type="button" data-document-zoom aria-pressed="false">Zoom in</button><a data-document-pdf>Open PDF ↗</a></div></div>`;
  document.body.append(viewer);
  const stage = viewer.querySelector('.document-stage');
  const picture = viewer.querySelector('img');
  const zoom = viewer.querySelector('[data-document-zoom]');
  const previous = viewer.querySelector('[data-document-prev]');
  const next = viewer.querySelector('[data-document-next]');
  let index = 0, origin = null, savedOverflow = '', returnScrollY = 0, pageLoad = 0;
  function setZoom(value, resetPosition = true) {
    stage.classList.toggle('is-zoomed', value);
    zoom.setAttribute('aria-pressed', String(value));
    zoom.textContent = value ? 'Fit page' : 'Zoom in';
    if (resetPosition) { stage.scrollTop = 0; stage.scrollLeft = 0; }
  }
  function showPage(value) {
    const zoomed = stage.classList.contains('is-zoomed');
    const horizontal = stage.scrollWidth > stage.clientWidth ? stage.scrollLeft / (stage.scrollWidth - stage.clientWidth) : 0;
    const vertical = stage.scrollHeight > stage.clientHeight ? stage.scrollTop / (stage.scrollHeight - stage.clientHeight) : 0;
    index = Math.max(0, Math.min(previews.length - 1, value));
    const request = ++pageLoad;
    const link = previews[index];
    picture.src = link.dataset.previewSrc;
    picture.alt = link.dataset.caption;
    viewer.querySelector('[data-document-caption]').textContent = link.dataset.caption;
    viewer.querySelector('[data-document-pdf]').href = link.href;
    previous.disabled = index === 0;
    next.disabled = index === previews.length - 1;
    setZoom(zoomed, !zoomed);
    if (zoomed) picture.decode().then(() => {
      if (request !== pageLoad || !viewer.open) return;
      stage.scrollLeft = horizontal * Math.max(0, stage.scrollWidth - stage.clientWidth);
      stage.scrollTop = vertical * Math.max(0, stage.scrollHeight - stage.clientHeight);
    }).catch(() => {});
  }
  previews.forEach((link, i) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      origin = link;
      returnScrollY = window.scrollY;
      showPage(i);
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      viewer.showModal();
      viewer.querySelector('[data-document-close]').focus();
    });
  });
  viewer.querySelector('[data-document-close]').addEventListener('click', () => viewer.close());
  previous.addEventListener('click', () => showPage(index - 1));
  next.addEventListener('click', () => showPage(index + 1));
  zoom.addEventListener('click', () => setZoom(zoom.getAttribute('aria-pressed') !== 'true'));
  viewer.addEventListener('keydown', event => {
    if (stage.classList.contains('is-zoomed') && document.activeElement === stage) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPage(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('close', () => {
    document.body.style.overflow = savedOverflow;
    picture.removeAttribute('src');
    window.scrollTo({top:returnScrollY,behavior:'instant'});
    origin?.focus({preventScroll:true});
  });
}

const citation = document.querySelector('.copy-citation');
if (citation) {
  citation.hidden = false;
  citation.addEventListener('click', async () => {
    const feedback = document.querySelector('.citation-feedback');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(citation.dataset.citation);
      feedback.textContent = 'Citation copied.';
      window.setTimeout(() => { if (feedback.textContent === 'Citation copied.') feedback.textContent = ''; }, 4000);
    } catch {
      feedback.textContent = 'Copy the citation below:';
      let text = document.querySelector('.citation-manual');
      if (!text) {
        text = document.createElement('textarea');
        text.className = 'citation-manual';
        text.setAttribute('aria-label', 'Publication citation');
        text.readOnly = true;
        feedback.after(text);
      }
      text.value = citation.dataset.citation;
      text.focus();
      text.select();
    }
  });
}
