(() => {
  'use strict';
  const section = document.querySelector('#forgotten-ground');
  if (!section) return;

  const viewport = section.querySelector('.fg-viewport');
  const track = section.querySelector('.fg-track');
  const cards = [...section.querySelectorAll('.fg-card')];
  const links = cards.map(card => card.querySelector('.fg-photo'));
  const images = cards.map(card => card.querySelector('img'));
  const counter = section.querySelector('.fg-counter');
  const prev = section.querySelector('[data-fg-prev]');
  const next = section.querySelector('[data-fg-next]');
  const dialog = document.querySelector('.fg-lightbox');
  const largeImage = dialog.querySelector('img');
  const largeCaption = dialog.querySelector('[data-fg-caption]');
  const largeCount = dialog.querySelector('[data-fg-lightbox-count]');
  const scrim = dialog.querySelector('.fg-lightbox-scrim');
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const pad = number => String(number).padStart(2, '0');

  // One shared position drives the HTML captions, WebGL planes, controls and lightbox return.
  let position = 0;
  let velocity = 0;
  let visualVelocity = 0;
  let maxPosition = 0;
  let step = 1;
  let active = 0;
  let selected = 0;
  let openedIndex = 0;
  let mode = 'idle';
  let target = 0;
  let pointer = null;
  let suppressClickUntil = 0;
  let visible = false;
  let frame = 0;
  let lastFrame = 0;
  let renderer = null;
  let loading = false;
  let resizeObserver = null;
  let transition = null;
  let scrimAnimation = null;
  let returnFocus = null;
  let restoringFocus = false;

  class PhotoRenderer {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'fg-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.gl = this.canvas.getContext('webgl', {
        alpha: true, antialias: true, premultipliedAlpha: false,
        preserveDrawingBuffer: false, powerPreference: 'low-power'
      });
      if (!this.gl) throw new Error('WebGL unavailable');
      const gl = this.gl;
      const shader = (type, source) => {
        const item = gl.createShader(type);
        gl.shaderSource(item, source);
        gl.compileShader(item);
        if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(item));
        return item;
      };
      const vertex = shader(gl.VERTEX_SHADER, `
        attribute vec2 aUV;
        uniform vec4 uRect;
        uniform vec2 uViewport;
        uniform float uMotion;
        varying vec2 vUV;
        void main() {
          vUV = aUV;
          float arch = sin(aUV.y * 3.14159265);
          float bow = uMotion * .022 * arch * (.72 + .28 * sin(aUV.x * 3.14159265));
          float lift = uMotion * .005 * sin(aUV.x * 3.14159265) * cos(aUV.y * 3.14159265);
          vec2 pixel = uRect.xy + vec2((aUV.x + bow) * uRect.z, (aUV.y + lift) * uRect.w);
          gl_Position = vec4(pixel.x / uViewport.x * 2.0 - 1.0,
                             1.0 - pixel.y / uViewport.y * 2.0, 0.0, 1.0);
        }
      `);
      const fragment = shader(gl.FRAGMENT_SHADER, `
        precision highp float;
        uniform sampler2D uTexture;
        uniform float uMotion;
        varying vec2 vUV;
        void main() {
          float amount = abs(uMotion);
          float zoom = 1.0 + amount * .018;
          vec2 sampleUV = (vUV - .5) / zoom + .5;
          sampleUV.x += uMotion * .006 * (1.0 - abs(vUV.y - .5) * .7);
          gl_FragColor = texture2D(uTexture, clamp(sampleUV, 0.0, 1.0));
        }
      `);
      this.program = gl.createProgram();
      gl.attachShader(this.program, vertex);
      gl.attachShader(this.program, fragment);
      gl.linkProgram(this.program);
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this.program));
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.useProgram(this.program);
      this.uniforms = {
        rect: gl.getUniformLocation(this.program, 'uRect'),
        viewport: gl.getUniformLocation(this.program, 'uViewport'),
        motion: gl.getUniformLocation(this.program, 'uMotion'),
        texture: gl.getUniformLocation(this.program, 'uTexture')
      };
      const points = [];
      const indices = [];
      const divisions = 20;
      for (let y = 0; y <= divisions; y++) {
        for (let x = 0; x <= divisions; x++) points.push(x / divisions, y / divisions);
      }
      for (let y = 0; y < divisions; y++) for (let x = 0; x < divisions; x++) {
        const a = y * (divisions + 1) + x;
        indices.push(a, a + 1, a + divisions + 1, a + 1, a + divisions + 2, a + divisions + 1);
      }
      this.indexCount = indices.length;
      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      const location = gl.getAttribLocation(this.program, 'aUV');
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      this.textures = [];
      this.canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        disableRenderer();
      });
    }

    async load() {
      const gl = this.gl;
      images.forEach(image => { image.loading = 'eager'; });
      await Promise.all(images.map(image => image.decode()));
      for (const image of images) {
        // 1024px is enough for the largest plane at the capped rendering scale.
        const source = document.createElement('canvas');
        source.width = 1024;
        source.height = 1024;
        source.getContext('2d', { alpha: false }).drawImage(image, 0, 0, 1024, 1024);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        this.textures.push(texture);
        source.width = source.height = 0;
      }
    }

    resize() {
      const scale = Math.min(devicePixelRatio || 1, 1.5);
      this.canvas.width = Math.round(viewport.clientWidth * scale);
      this.canvas.height = Math.round(viewport.clientHeight * scale);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(offset, speed) {
      const gl = this.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.program);
      gl.uniform2f(this.uniforms.viewport, viewport.clientWidth, viewport.clientHeight);
      gl.uniform1f(this.uniforms.motion, clamp(speed / 1650, -1, 1));
      gl.uniform1i(this.uniforms.texture, 0);
      for (let index = 0; index < cards.length; index++) {
        const x = cards[index].offsetLeft - offset;
        const size = links[index].clientWidth;
        if (x + size < -30 || x > viewport.clientWidth + 30) continue;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[index]);
        gl.uniform4f(this.uniforms.rect, x, 0, size, size);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
      }
    }

    destroy() {
      const gl = this.gl;
      this.textures.forEach(texture => gl.deleteTexture(texture));
      gl.deleteBuffer(this.vertexBuffer);
      gl.deleteBuffer(this.indexBuffer);
      gl.deleteProgram(this.program);
      this.canvas.remove();
    }
  }

  function updateCounter(index) {
    if (active === index && counter.textContent === `${pad(index + 1)} / ${pad(cards.length)}`) return;
    active = index;
    counter.textContent = `${pad(index + 1)} / ${pad(cards.length)}`;
    prev.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  }

  function nearestIndex(value = position) {
    return clamp(Math.round(value / step), 0, cards.length - 1);
  }

  function measure(preserve = true) {
    const oldStep = step;
    const logical = preserve ? position / oldStep : 0;
    const targetIndex = Math.round(target / oldStep);
    viewport.style.setProperty('--fg-tail', `${Math.max(0, viewport.clientWidth - links[0].clientWidth)}px`);
    step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
    maxPosition = Math.max(0, track.scrollWidth - viewport.clientWidth);
    position = clamp(logical * step, 0, maxPosition);
    if (mode === 'settle' || mode === 'navigate') target = clamp(targetIndex * step, 0, maxPosition);
    if (renderer) renderer.resize();
    paint();
  }

  function paint() {
    if (!renderer) return;
    track.style.transform = `translate3d(${-position}px,0,0)`;
    updateCounter(nearestIndex());
    section.dataset.fgPosition = position.toFixed(1);
    section.dataset.fgVelocity = Math.round(velocity).toString();
    section.dataset.fgState = mode;
    if (visible && !dialog.open) renderer.draw(position, visualVelocity);
    else if (visible && dialog.open) renderer.draw(position, 0);
  }

  function schedule() {
    if (visible && renderer && !frame && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    const dt = Math.min(.04, (now - (lastFrame || now)) / 1000 || .016);
    lastFrame = now;
    if (mode === 'inertia') {
      position = clamp(position + velocity * dt, 0, maxPosition);
      velocity *= Math.exp(-4.15 * dt);
      if ((position === 0 && velocity < 0) || (position === maxPosition && velocity > 0)) velocity = 0;
      if (Math.abs(velocity) < 175) {
        target = clamp(nearestIndex() * step, 0, maxPosition);
        mode = 'settle';
      }
    } else if (mode === 'settle' || mode === 'navigate') {
      const stiffness = mode === 'navigate' ? 42 : 31;
      const damping = mode === 'navigate' ? 12.8 : 10.8;
      velocity += ((target - position) * stiffness - velocity * damping) * dt;
      position = clamp(position + velocity * dt, 0, maxPosition);
      if (Math.abs(target - position) < .35 && Math.abs(velocity) < 7) {
        position = target;
        velocity = 0;
        mode = 'idle';
      }
    }
    const visualTarget = mode === 'drag' || mode === 'inertia' || mode === 'settle' || mode === 'navigate' ? velocity : 0;
    visualVelocity += (visualTarget - visualVelocity) * (1 - Math.exp(-13 * dt));
    if (Math.abs(visualVelocity) < 1 && mode === 'idle') visualVelocity = 0;
    paint();
    if (mode !== 'idle' || visualVelocity) schedule();
  }

  function navigate(index) {
    index = clamp(index, 0, cards.length - 1);
    if (!renderer) {
      viewport.scrollTo({ left: cards[index].offsetLeft, behavior: motionPreference.matches ? 'instant' : 'smooth' });
      updateCounter(index);
      return;
    }
    target = clamp(cards[index].offsetLeft, 0, maxPosition);
    mode = 'navigate';
    schedule();
  }

  function disableRenderer() {
    if (!renderer) return;
    cancelAnimationFrame(frame);
    frame = 0;
    renderer.destroy();
    resizeObserver?.disconnect();
    resizeObserver = null;
    renderer = null;
    section.classList.remove('fg-webgl');
    viewport.classList.remove('is-enhanced');
    track.style.transform = '';
    viewport.scrollLeft = position;
    viewport.style.removeProperty('--fg-tail');
    section.dataset.fgRenderer = 'html';
    mode = 'idle';
    velocity = visualVelocity = 0;
  }

  async function enableRenderer() {
    if (renderer || loading || motionPreference.matches || !visible) return;
    loading = true;
    let candidate;
    try {
      candidate = new PhotoRenderer();
      await candidate.load();
      if (!visible || motionPreference.matches) { candidate.destroy(); return; }
      const previousScroll = viewport.scrollLeft;
      viewport.classList.add('is-enhanced');
      viewport.scrollLeft = 0;
      viewport.prepend(candidate.canvas);
      renderer = candidate;
      measure(false);
      position = clamp(previousScroll, 0, maxPosition);
      candidate.resize();
      section.classList.add('fg-webgl');
      section.dataset.fgRenderer = 'webgl';
      paint();
      resizeObserver = new ResizeObserver(() => { measure(); schedule(); });
      resizeObserver.observe(viewport);
    } catch (error) {
      if (candidate) candidate.destroy();
      section.dataset.fgRenderer = 'html';
      console.warn('Forgotten Ground: using HTML image fallback.', error);
    } finally {
      loading = false;
    }
  }

  function setLarge(index) {
    selected = clamp(index, 0, cards.length - 1);
    const image = images[selected];
    largeImage.src = links[selected].href;
    largeImage.alt = image.alt;
    largeCaption.textContent = cards[selected].querySelector('figcaption span:last-child').textContent;
    largeCount.textContent = `${pad(selected + 1)} / ${pad(cards.length)}`;
    dialog.querySelector('[data-fg-lightbox-prev]').disabled = selected === 0;
    dialog.querySelector('[data-fg-lightbox-next]').disabled = selected === cards.length - 1;
  }

  function largeRect() {
    const size = Math.min(innerWidth * .88, innerHeight * .78, 1140);
    return { left: (innerWidth - size) / 2, top: (innerHeight - size) / 2, width: size, height: size };
  }

  function rectStyle(rect) {
    Object.assign(largeImage.style, {
      left: `${rect.left}px`, top: `${rect.top}px`,
      width: `${rect.width}px`, height: `${rect.height}px`
    });
  }

  function openLarge(index) {
    if (!dialog.showModal || dialog.open) return;
    returnFocus = links[index];
    openedIndex = index;
    setLarge(index);
    const from = links[index].getBoundingClientRect();
    const to = largeRect();
    if (renderer) {
      mode = 'idle'; velocity = visualVelocity = 0;
      paint();
    }
    dialog.showModal();
    dialog.classList.add('is-transitioning');
    rectStyle(from);
    if (motionPreference.matches) {
      rectStyle(to);
      scrim.style.opacity = '1';
      scrimAnimation?.cancel();
      scrimAnimation = null;
      dialog.classList.remove('is-transitioning');
      dialog.querySelector('[data-fg-close]').focus();
      return;
    }
    transition?.cancel();
    transition = largeImage.animate([
      { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` },
      { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` }
    ], { duration: 620, easing: 'cubic-bezier(.22,1,.26,1)', fill: 'forwards' });
    scrimAnimation?.cancel();
    scrimAnimation = scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out', fill: 'forwards' });
    transition.finished.then(() => {
      rectStyle(to);
      transition.cancel();
      transition = null;
      scrim.style.opacity = '1';
      scrimAnimation?.cancel();
      scrimAnimation = null;
      dialog.classList.remove('is-transitioning');
      dialog.querySelector('[data-fg-close]').focus();
    }).catch(() => {});
  }

  function changeLarge(index) {
    const nextIndex = clamp(index, 0, cards.length - 1);
    if (nextIndex === selected) return;
    const old = largeImage.cloneNode();
    old.removeAttribute('alt');
    old.setAttribute('aria-hidden', 'true');
    old.className = 'fg-lightbox-ghost';
    old.style.cssText = largeImage.style.cssText;
    dialog.insertBefore(old, largeImage);
    setLarge(nextIndex);
    returnFocus = links[nextIndex];
    navigate(nextIndex);
    const fadeIn = largeImage.animate([{ opacity: 0 }, { opacity: 1 }], { duration: motionPreference.matches ? 1 : 260, fill: 'forwards' });
    const fadeOut = old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: motionPreference.matches ? 1 : 260, fill: 'forwards' });
    fadeIn.finished.then(() => {
      largeImage.style.opacity = '1';
      fadeIn.cancel();
      fadeOut.cancel();
      old.remove();
    }).catch(() => { fadeOut.cancel(); old.remove(); });
  }

  function closeLarge() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing', 'is-transitioning');
    const from = largeImage.getBoundingClientRect();
    largeImage.getAnimations().filter(animation => animation !== transition).forEach(animation => animation.cancel());
    dialog.querySelectorAll('.fg-lightbox-ghost').forEach(ghost => ghost.remove());
    largeImage.style.opacity = '1';
    // If the reader changed photographs, place that card under its returning image.
    // Opening and closing the same photograph leaves the freely dragged position intact.
    if (selected !== openedIndex) {
      if (renderer) {
        position = clamp(cards[selected].offsetLeft, 0, maxPosition);
        velocity = visualVelocity = 0;
        mode = 'idle';
        paint();
      } else viewport.scrollLeft = cards[selected].offsetLeft;
    }
    const to = links[selected].getBoundingClientRect();
    if (motionPreference.matches) {
      dialog.close();
      scrim.style.opacity = '0';
      dialog.querySelectorAll('.fg-lightbox-ghost').forEach(ghost => ghost.remove());
      dialog.classList.remove('is-closing', 'is-transitioning');
      restoringFocus = true;
      returnFocus?.focus({ preventScroll: true });
      restoringFocus = false;
      return;
    }
    transition?.cancel();
    transition = largeImage.animate([
      { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` },
      { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` }
    ], { duration: 500, easing: 'cubic-bezier(.65,0,.22,1)', fill: 'forwards' });
    scrimAnimation?.cancel();
    scrimAnimation = scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
    transition.finished.then(() => {
      transition.cancel();
      transition = null;
      dialog.close();
      scrim.style.opacity = '0';
      scrimAnimation?.cancel();
      scrimAnimation = null;
      dialog.querySelectorAll('.fg-lightbox-ghost').forEach(ghost => ghost.remove());
      dialog.classList.remove('is-closing', 'is-transitioning');
      restoringFocus = true;
      returnFocus?.focus({ preventScroll: true });
      restoringFocus = false;
    }).catch(() => {});
  }

  viewport.addEventListener('pointerdown', event => {
    if (!renderer || dialog.open || !event.isPrimary || event.button !== 0) return;
    pointer = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      lastX: event.clientX, lastTime: event.timeStamp,
      start: position, moved: false, type: event.pointerType
    };
    mode = 'idle';
    velocity = 0;
  });
  viewport.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id || !renderer) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.moved) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (pointer.type === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.1) { pointer = null; return; }
      if (Math.abs(dx) < Math.abs(dy) * 1.1) return;
      pointer.moved = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
      mode = 'drag';
    }
    const elapsed = Math.max(8, event.timeStamp - pointer.lastTime);
    const instantVelocity = -(event.clientX - pointer.lastX) * 1000 / elapsed;
    velocity = velocity * .42 + instantVelocity * .58;
    pointer.lastX = event.clientX;
    pointer.lastTime = event.timeStamp;
    position = clamp(pointer.start - dx, 0, maxPosition);
    event.preventDefault();
    schedule();
  });
  function endPointer(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dragged = pointer.moved;
    if (dragged && event.timeStamp - pointer.lastTime > 100) velocity = 0;
    pointer = null;
    viewport.classList.remove('is-dragging');
    if (!dragged) return;
    suppressClickUntil = performance.now() + 400;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    velocity = clamp(velocity, -2400, 2400);
    target = clamp(nearestIndex() * step, 0, maxPosition);
    mode = Math.abs(velocity) > 70 ? 'inertia' : 'settle';
    schedule();
  }
  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', event => {
    if (pointer && event.pointerId === pointer.id) {
      pointer = null;
      viewport.classList.remove('is-dragging');
      mode = 'settle';
      velocity = 0;
      target = clamp(nearestIndex() * step, 0, maxPosition);
      schedule();
    }
  });
  viewport.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  viewport.addEventListener('scroll', () => {
    if (renderer) {
      // Focus must never create a second position outside the shared motion system.
      if (viewport.scrollLeft) viewport.scrollLeft = 0;
      return;
    }
    position = viewport.scrollLeft;
    updateCounter(nearestIndex(position));
  }, { passive: true });
  viewport.addEventListener('focusin', event => {
    if (!renderer || restoringFocus || dialog.open || !event.target.matches('.fg-photo:focus-visible')) return;
    const index = links.indexOf(event.target);
    if (index >= 0) navigate(index);
    if (viewport.scrollLeft) viewport.scrollLeft = 0;
  });
  viewport.addEventListener('keydown', event => {
    let index;
    if (event.key === 'ArrowRight') index = active + 1;
    else if (event.key === 'ArrowLeft') index = active - 1;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = cards.length - 1;
    else return;
    event.preventDefault();
    navigate(index);
  });
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); return; }
    if (!dialog.showModal) return;
    event.preventDefault();
    openLarge(index);
  }));
  prev.addEventListener('click', () => navigate(active - 1));
  next.addEventListener('click', () => navigate(active + 1));
  dialog.querySelector('[data-fg-close]').addEventListener('click', closeLarge);
  dialog.querySelector('[data-fg-lightbox-prev]').addEventListener('click', () => changeLarge(selected - 1));
  dialog.querySelector('[data-fg-lightbox-next]').addEventListener('click', () => changeLarge(selected + 1));
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeLarge(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); changeLarge(selected + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); changeLarge(selected - 1); }
  });
  window.addEventListener('resize', () => {
    if (dialog.open && !transition) rectStyle(largeRect());
    if (!renderer) { step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1; updateCounter(nearestIndex(viewport.scrollLeft)); }
  }, { passive: true });
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) disableRenderer();
    else enableRenderer();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastFrame = 0; }
    else schedule();
  });
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    renderer?.destroy();
  }, { once: true });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) { enableRenderer(); schedule(); }
    else { cancelAnimationFrame(frame); frame = 0; lastFrame = 0; }
  }, { rootMargin: '300px 0px' });
  observer.observe(section);
  step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
  section.dataset.fgRenderer = 'html';
  updateCounter(0);
})();
