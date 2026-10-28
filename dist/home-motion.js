const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const revealTargets = document.querySelectorAll(
  '.portfolio-hero, .editorial-strip-item, .portfolio-work .production, .visual-card-photo, .treatment-cover, .treatment-peek-image, .portfolio-contact'
);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('motion-entered');
      observer.unobserve(entry.target);
    }
  }, {threshold: .15, rootMargin: '0px 0px -7% 0px'});
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('motion-entered'));
}

const homeFilm = document.querySelector('.home-film-video');
const replayButton = document.querySelector('.home-film-replay');
const fullReelDialog = document.querySelector('#full-reel-dialog');

if (homeFilm && replayButton) {
  const credit = document.querySelector('.home-film-credit');
  const filmFrame = homeFilm.closest('.home-film-frame');
  const creditCounter = document.querySelector('.home-film-credit-counter');
  const creditTitle = document.querySelector('.home-film-credit-title');
  const creditRole = document.querySelector('.home-film-credit-role');

  fetch(homeFilm.dataset.manifest)
    .then((response) => {
      if (!response.ok) throw new Error(`Film manifest returned ${response.status}`);
      return response.json();
    })
    .then((manifest) => {
      const {shots, fps, transitionFrames, closingHoldFrames} = manifest;
      if (!Array.isArray(shots) || shots.length < 2 || !fps || !transitionFrames || !closingHoldFrames) {
        throw new Error('Film manifest is incomplete');
      }

      const cues = [];
      let nextFrame = 0;
      shots.forEach((shot, index) => {
        cues.push({start: nextFrame, end: nextFrame + shot.stableFrames, shot: index});
        nextFrame += shot.stableFrames;
        cues.push({start: nextFrame, end: nextFrame + transitionFrames, shot: -1});
        nextFrame += transitionFrames;
      });
      cues.push({start: nextFrame, end: nextFrame + closingHoldFrames, shot: 0});
      const totalFrames = nextFrame + closingHoldFrames;

      let pausedByUser = false;
      let cueFrame = 0;
      let currentCue = 0;
      filmFrame.dataset.creditPosition = shots[0].creditPosition;

      const updateCredit = () => {
        const frame = Math.min(totalFrames - 1, Math.floor(homeFilm.currentTime * fps));
        const cue = cues.find((item) => frame >= item.start && frame < item.end);
        if (!cue || cue.shot === currentCue) return;
        currentCue = cue.shot;
        if (cue.shot === -1) {
          credit.classList.add('is-wiping');
          credit.setAttribute('aria-hidden', 'true');
          return;
        }
        const shot = shots[cue.shot];
        filmFrame.dataset.creditPosition = shot.creditPosition;
        creditCounter.textContent = `${String(cue.shot + 1).padStart(2, '0')} / ${String(shots.length).padStart(2, '0')}`;
        creditTitle.textContent = shot.title;
        creditRole.textContent = shot.role;
        credit.classList.remove('cue-enter');
        void credit.offsetWidth;
        credit.classList.remove('is-wiping');
        credit.removeAttribute('aria-hidden');
        credit.classList.add('cue-enter');
      };

      const runCue = () => {
        updateCredit();
        if (!homeFilm.paused && !homeFilm.ended) cueFrame = requestAnimationFrame(runCue);
      };
      homeFilm.addEventListener('play', () => {
        cancelAnimationFrame(cueFrame);
        runCue();
      });
      homeFilm.addEventListener('pause', () => cancelAnimationFrame(cueFrame));
      homeFilm.addEventListener('seeked', updateCredit);
      homeFilm.addEventListener('ended', updateCredit);
      replayButton.hidden = false;
      replayButton.textContent = 'Play motion';

      const playFilm = () => {
        if (fullReelDialog?.open) return;
        if (homeFilm.ended) homeFilm.currentTime = 0;
        homeFilm.play().then(() => {
          if (homeFilm.paused) return;
          pausedByUser = false;
          replayButton.textContent = 'Pause motion';
        }).catch(() => {
          replayButton.textContent = 'Play motion';
        });
      };

      replayButton.addEventListener('click', () => {
        if (homeFilm.paused) playFilm();
        else {
          pausedByUser = true;
          homeFilm.pause();
          replayButton.textContent = 'Play motion';
        }
      });

      homeFilm.addEventListener('ended', () => {
        replayButton.textContent = 'Replay motion';
      });

      if ('IntersectionObserver' in window) {
        const filmObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !reducedMotion.matches && !homeFilm.ended && !pausedByUser && !fullReelDialog?.open) {
              playFilm();
            } else if (!entry.isIntersecting) {
              homeFilm.pause();
              if (!homeFilm.ended) replayButton.textContent = 'Play motion';
            }
          }
        }, {threshold: .35});
        filmObserver.observe(homeFilm);
      }

      reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
          homeFilm.pause();
          homeFilm.currentTime = 0;
          updateCredit();
          replayButton.textContent = 'Play motion';
        }
      });
    })
    .catch((error) => {
      console.error('Homepage film unavailable:', error);
      homeFilm.style.display = 'none';
      replayButton.hidden = true;
    });
}

const fullReelLink = document.querySelector('[data-full-reel-open]');
if (fullReelLink && fullReelDialog) {
  const fullReelVideo = fullReelDialog.querySelector('video');
  const closeButton = fullReelDialog.querySelector('[data-full-reel-close]');
  fullReelLink.addEventListener('click', (event) => {
    if (typeof fullReelDialog.showModal !== 'function') return;
    event.preventDefault();
    homeFilm?.pause();
    if (replayButton && !replayButton.hidden) replayButton.textContent = 'Play motion';
    fullReelDialog.showModal();
    fullReelVideo.play().catch(() => {});
  });
  closeButton.addEventListener('click', () => fullReelDialog.close());
  fullReelDialog.addEventListener('close', () => {
    fullReelVideo.pause();
    fullReelVideo.currentTime = 0;
  });
}
