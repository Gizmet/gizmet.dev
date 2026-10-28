/* Source-grounded editorial instruments. No live data, network call or continuous render loop. */
(() => {
  'use strict';
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const instruments = [...document.querySelectorAll('[data-instrument]')];
  if (!instruments.length) return;
  const activate = element => {
    if (element.classList.contains('is-ready')) return;
    element.classList.add('is-ready');
    element.querySelector('.instrument-controls').hidden = false;
    element.querySelectorAll('button:disabled[data-item],button:disabled[data-dimension],button:disabled[data-intervention],button:disabled[data-component]').forEach(button => button.disabled = false);
    ({ velocity: initVelocity, vns: initVns, psi: initPsi, fidelity: initFidelity })[element.dataset.instrument](element);
  };
  // The featured comparison is small and visible early; initialise it before scrolling.
  instruments.filter(element => element.dataset.instrument === 'fidelity').forEach(activate);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      activate(entry.target);
      observer.unobserve(entry.target);
    }), { rootMargin: '350px 0px' });
    instruments.filter(element => !element.classList.contains('is-ready')).forEach(element => observer.observe(element));
  } else instruments.forEach(activate);

  function initVelocity(root) {
    const corpus = root.querySelector('.velocity-corpus');
    const items = {
      notice: { letter: 'A', title: 'Council notice', source: 'one council source' },
      rumour: { letter: 'B', title: 'Transit rumour', source: 'one origin repeated by others' },
      followup: { letter: 'C', title: 'Local follow-up', source: 'one independent source' }
    };
    let mode = 'equal', selected = 'notice';
    const counts = { equal: { notice: 4, rumour: 4, followup: 4 }, amplified: { notice: 2, rumour: 8, followup: 2 } };
    function render() {
      const previous = new Map([...corpus.children].map(chip => [chip.dataset.chip, chip.getBoundingClientRect()]));
      const fragment = document.createDocumentFragment();
      for (const [key, item] of Object.entries(items)) {
        for (let n = 0; n < counts[mode][key]; n++) {
          const chip = document.createElement('span');
          chip.className = 'corpus-chip' + (selected === key ? ' is-selected' : '');
          chip.dataset.chip = key + '-' + n;
          chip.dataset.kind = key;
          chip.textContent = item.letter;
          fragment.append(chip);
        }
      }
      corpus.replaceChildren(fragment);
      if (!prefersReducedMotion.matches) for (const chip of corpus.children) {
        const from = previous.get(chip.dataset.chip);
        if (from) {
          const to = chip.getBoundingClientRect();
          const dx = from.left - to.left, dy = from.top - to.top;
          if (dx || dy) chip.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0,0)' }], { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' });
        } else chip.animate([{ opacity: 0, transform: 'scale(.65)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 240 });
      }
      root.querySelectorAll('[data-item]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.item === selected)));
      root.querySelectorAll('[data-velocity-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.velocityMode === mode)));
      const item = items[selected], number = counts[mode][selected];
      root.querySelector('[data-velocity-title]').textContent = `${number} of 12 appearances · ${item.title}`;
      root.querySelector('[data-velocity-description]').textContent = `${item.letter} is drawn ${number} times under ${mode === 'equal' ? 'equal selection' : 'the illustrative repeat-amplification rule'}. All ${number} appearances trace to ${item.source}; repetitions add exposure, not independent corroboration.`;
    }
    root.querySelectorAll('[data-item]').forEach(button => button.addEventListener('click', () => { selected = button.dataset.item; render(); }));
    root.querySelectorAll('[data-velocity-mode]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.velocityMode; render(); }));
    root.querySelector('[data-reset]').addEventListener('click', () => { mode = 'equal'; selected = 'notice'; render(); });
    render();
  }

  function initVns(root) {
    const dimensions = {
      coherence: 'Coherence asks whether communities can converge on shared factual claims.',
      resilience: 'Resilience concerns recovery after an information shock or surge.',
      civility: 'Civility concerns toxicity and harassment in the network.',
      quality: 'Epistemic quality concerns the reliability of exposed sources and claims.',
      diversity: 'Diversity concerns the spread of topics and viewpoints without siloing.',
      agency: 'Agency concerns user control, transparent curation and override.',
      balance: 'Affective balance concerns the emotional tone of information exchange.'
    };
    const interventions = {
      context: { label: 'added context', detail: 'A context note would accompany the content while access remains available.' },
      delay: { label: 'a brief delay', detail: 'A short, explained pause would give context and review processes time to act.' },
      rerank: { label: 'reduced algorithmic boost', detail: 'Recommendations would amplify the content less while organic access remains.' }
    };
    let phase = 0, dimension = 'coherence', intervention = 'context';
    function render() {
      root.querySelectorAll('[data-vns-node]').forEach((node, index) => {
        node.classList.toggle('is-current', (phase === 0 && index === 0) || phase === index + 1);
        node.classList.toggle('is-done', phase > index + 1);
      });
      const title = ['Steady illustrative activity', 'Burst introduced · observe', 'Proposed intervention · inspect', 'Reassess and feed back'][phase];
      const desc = [
        'The proposed governor observes amplification speed and seven dimensions of vitality. No live network or calibrated threshold is connected.',
        'An illustrative burst is present. A real governor would compare its spread with a segment-specific threshold and assess vitality; this demo supplies no measurement.',
        `The selected response is ${interventions[intervention].label}. ${interventions[intervention].detail}`,
        `After ${interventions[intervention].label}, the proposal would observe the network again and adjust its next response. This walkthrough computes no change in vitality or misinformation.`
      ][phase];
      root.querySelector('[data-vns-title]').textContent = title;
      root.querySelector('[data-vns-description]').textContent = desc;
      root.querySelector('[data-burst]').disabled = phase !== 0;
      root.querySelector('[data-vns-next]').disabled = phase === 0 || phase === 3;
      root.querySelectorAll('[data-dimension]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.dimension === dimension)));
      root.querySelectorAll('[data-intervention]').forEach(button => { button.disabled = phase === 0; button.setAttribute('aria-pressed', String(button.dataset.intervention === intervention)); });
      root.querySelector('[data-dimension-description]').textContent = dimensions[dimension];
    }
    root.querySelector('[data-burst]').addEventListener('click', () => { phase = 1; render(); });
    root.querySelector('[data-vns-next]').addEventListener('click', () => { if (phase < 3) phase++; render(); });
    root.querySelectorAll('[data-dimension]').forEach(button => button.addEventListener('click', () => { dimension = button.dataset.dimension; render(); }));
    root.querySelectorAll('[data-intervention]').forEach(button => button.addEventListener('click', () => { intervention = button.dataset.intervention; if (phase === 0) phase = 1; if (phase === 1) phase = 2; render(); }));
    root.querySelector('[data-reset]').addEventListener('click', () => { phase = 0; dimension = 'coherence'; intervention = 'context'; render(); });
    render();
  }

  function initPsi(root) {
    const parts = {
      context: ['Context input · DNA cassette', 'The proposed cassette supplies context through an optical read path. It is separate from the rewritable weight medium.', 'Paper §3.1.1 · PDF pp. 4–5'],
      weights: ['Weight substrate · magneto-optical tape', 'Magnetic domain patterns would hold network weights. The proposal treats this medium as rewritable.', 'Paper §§3.1.2, 3.6.1 · PDF pp. 5, 8'],
      stack: ['Optical stack', 'Spatial light modulation and proposed nonlinear activation would transform the input through weight layers.', 'Paper §§3.2–3.3 · PDF pp. 5–7'],
      channels: ['Wavelength channels', 'Different wavelengths are proposed to carry parallel forward passes. Channel isolation is a critical untested constraint.', 'Paper §3.5 · PDF p. 7'],
      output: ['Output detector', 'The detector would read the optical result of inference. No complete system performance has been measured.', 'Paper §§3.4–3.5 · PDF pp. 6–7'],
      target: ['Training target', 'A separate target pattern would supply the comparison signal for supervised training.', 'Paper §3.6.1 · PDF p. 8'],
      error: ['Holographic error', 'The proposal would compare the output and target optically to form an error signal.', 'Paper §3.6.2 · PDF p. 8'],
      write: ['Laser write beam', 'A structured beam would update the rewritable weight medium through thermomagnetic writing.', 'Paper §3.6 · PDF pp. 8–9']
    };
    const paths = {
      inference: ['context', 'weights', 'stack', 'channels', 'output'],
      training: ['weights', 'stack', 'output', 'target', 'error', 'write', 'weights']
    };
    let mode = 'inference', position = 0;
    function render() {
      const key = paths[mode][position];
      root.querySelectorAll('[data-component]').forEach(button => {
        button.classList.toggle('is-current', button.dataset.component === key);
        button.classList.toggle('is-path', paths[mode].includes(button.dataset.component));
        button.setAttribute('aria-pressed', String(button.dataset.component === key));
      });
      root.querySelectorAll('[data-psi-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.psiMode === mode)));
      root.querySelector('[data-psi-next]').disabled = position === paths[mode].length - 1;
      root.querySelector('[data-psi-title]').textContent = parts[key][0];
      root.querySelector('[data-psi-description]').textContent = parts[key][1];
      root.querySelector('[data-psi-reference]').textContent = parts[key][2];
      root.querySelector('[data-psi-path]').textContent = mode === 'inference'
        ? 'Inference / Context + weights → Optical stack → Wavelength channels → Output'
        : 'Training / Weights → Optical stack → Output + target → Holographic error → Laser write → Weights';
    }
    root.querySelectorAll('[data-psi-mode]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.psiMode; position = 0; render(); }));
    root.querySelectorAll('[data-component]').forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.component;
      if (!paths[mode].includes(key)) mode = mode === 'inference' ? 'training' : 'inference';
      position = paths[mode].indexOf(key);
      render();
    }));
    root.querySelector('[data-psi-next]').addEventListener('click', () => { position = Math.min(position + 1, paths[mode].length - 1); render(); });
    root.querySelector('[data-reset]').addEventListener('click', () => { position = 0; render(); });
    render();
  }

  function initFidelity(root) {
    const original = 'The survey covered 40 households and suggests a possible rise in costs.';
    const cases = {
      original: { text: original, title: 'Start with the unchanged reference', description: 'Both views present the same synthetic text and format. Choose an edit to see where object identity and textual comparison diverge.' },
      format: { text: original, title: 'A new presentation, identical characters', description: 'The compared sheet uses another typeface and represents a different presented object. Its normalised character sequence still matches the reference.' },
      paraphrase: { text: 'A survey of 40 households points to a potential increase in costs.', title: 'Different wording, interpretation required', description: 'The character sequence differs. A reader may consider the meaning similar, but this deterministic comparator cannot establish semantic faithfulness.' },
      qualification: { text: 'The survey covered 40 households and shows a rise in costs.', title: 'The qualification is removed', description: 'The line changes from “suggests a possible rise” to “shows a rise”. The changed language is visible; the comparator does not assign an authoritative severity score.' },
      figure: { text: 'The survey covered 400 households and suggests a possible rise in costs.', title: 'The figure changes', description: '40 becomes 400. The text comparison finds the changed passage. It cannot determine which figure is true.' }
    };
    let mode = 'original';
    const source = root.querySelector('[data-reference]');
    const derivative = root.querySelector('[data-derivative]');
    const normalise = value => value.normalize('NFKC').replace(/\s+/g, ' ').trim();
    function renderDifference(value) {
      const left = original.split(' '), right = value.split(' ');
      let start = 0, end = 0;
      while (start < left.length && start < right.length && left[start] === right[start]) start++;
      while (end < left.length - start && end < right.length - start && left[left.length - 1 - end] === right[right.length - 1 - end]) end++;
      const draw = (target, words) => {
        const fragment = document.createDocumentFragment();
        const before = words.slice(0, start).join(' ');
        const change = words.slice(start, words.length - end).join(' ');
        const after = words.slice(words.length - end).join(' ');
        if (before) fragment.append(document.createTextNode(before + (change || after ? ' ' : '')));
        if (change) { const mark = document.createElement('mark'); mark.textContent = change; fragment.append(mark); }
        if (after) fragment.append(document.createTextNode((change ? ' ' : '') + after));
        target.replaceChildren(fragment);
      };
      if (normalise(value) === normalise(original)) { source.textContent = original; derivative.textContent = value; }
      else { draw(source, left); draw(derivative, right); }
    }
    function render() {
      const selected = cases[mode];
      renderDifference(selected.text);
      root.querySelector('[data-derivative-sheet]').dataset.format = mode === 'format' ? 'alternate' : 'original';
      root.querySelector('[data-derivative-sheet]').dataset.state = mode;
      root.querySelector('[data-derivative-label]').textContent = mode === 'original' ? 'Compared document / sheet A' : 'Compared document / sheet B';
      root.querySelector('[data-object-result]').textContent = mode === 'original' ? 'Same presented sheet' : 'Changed presentation or document';
      root.querySelector('[data-text-result]').textContent = normalise(original) === normalise(selected.text) ? 'Identical to reference' : 'Different from reference';
      root.querySelector('[data-fidelity-title]').textContent = selected.title;
      root.querySelector('[data-fidelity-description]').textContent = selected.description;
      root.querySelectorAll('[data-fidelity-change]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.fidelityChange === mode)));
    }
    root.querySelectorAll('[data-fidelity-change]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.fidelityChange; render(); }));
    root.querySelector('[data-reset]').addEventListener('click', () => { mode = 'original'; render(); });
    render();
  }
})();
