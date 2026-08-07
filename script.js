// ==========================================================
// SCUSA LISA — interazioni
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  const coverSection = document.getElementById('cover-section');
  const openBtn = document.getElementById('open-btn');
  const noBtn = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  const hintText = document.getElementById('hint-text');
  const introSection = document.getElementById('intro-section');
  const revealSection = document.getElementById('reveal-section');
  const flowerBurst = document.getElementById('flower-burst');
  const replayBtn = document.getElementById('replay-btn');
  const petalLayer = document.getElementById('petal-layer');
  const musicBtn = document.getElementById('music-toggle-btn');
  const music = document.getElementById('background-music');
  const cheerSound = document.getElementById('cheer-sound');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FLOWERS = ['🌸', '🌷', '🌼', '🌻', '🌺', '💮', '🌹'];

  // ---------- Il bottone "No" scappa (e combina un po' di casino) ----------
  let dodgeCount = 0;
  let yesGrowth = 1;
  let lastPhrase = null;

  const NO_PHRASES = [
    'No', 'Nooo!', 'Manco per sogno', 'Ci pensi?', 'Sicura?',
    'Ultima chance', 'Eh no', 'Riprova', 'Nope', '🙈',
    'Non se ne parla', 'Dai su', 'Neanche a pagarmi', 'Ahia'
  ];

  function pickNoPhrase() {
    let phrase;
    do {
      phrase = NO_PHRASES[Math.floor(Math.random() * NO_PHRASES.length)];
    } while (phrase === lastPhrase);
    lastPhrase = phrase;
    return phrase;
  }

  function growYesButton() {
    yesGrowth = Math.min(1.35, yesGrowth + 0.025);
    yesBtn.style.transform = `scale(${yesGrowth.toFixed(3)})`;
  }

  function spawnPuff(x, y) {
    if (x === undefined || y === undefined) return;
    const symbols = ['💨', '✨', '😂', '🙈', '💫'];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const puff = document.createElement('span');
      puff.className = 'puff';
      puff.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const angle = (360 / count) * i + (Math.random() * 40 - 20);
      const dist = 26 + Math.random() * 30;
      const rad = (angle * Math.PI) / 180;
      puff.style.left = `${x}px`;
      puff.style.top = `${y}px`;
      puff.style.setProperty('--pdx', `${Math.cos(rad) * dist}px`);
      puff.style.setProperty('--pdy', `${Math.sin(rad) * dist}px`);
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 550);
    }
  }

  function getViewportBounds() {
    // Su Safari iOS window.innerHeight non tiene conto della barra di
    // navigazione in basso: visualViewport riflette l'area davvero visibile.
    const vv = window.visualViewport;
    if (vv) {
      return { width: vv.width, height: vv.height, offsetLeft: vv.offsetLeft, offsetTop: vv.offsetTop };
    }
    return { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
  }

  function dodgeNoButton(clientX, clientY) {
    if (prefersReducedMotion) return;

    const originRect = noBtn.getBoundingClientRect();
    const originX = clientX !== undefined ? clientX : originRect.left + originRect.width / 2;
    const originY = clientY !== undefined ? clientY : originRect.top + originRect.height / 2;

    noBtn.classList.add('is-fleeing');
    // il testo cambia prima di misurare il bottone, cosi' la posizione
    // tiene conto della larghezza reale della nuova frase
    noBtn.textContent = pickNoPhrase();
    const btnRect = noBtn.getBoundingClientRect();

    const margin = 16;
    const bottomSafeMargin = 64; // tiene il bottone lontano dalla barra di Safari
    const viewport = getViewportBounds();
    const minLeft = viewport.offsetLeft + margin;
    const minTop = viewport.offsetTop + margin;
    const maxLeft = viewport.offsetLeft + viewport.width - btnRect.width - margin;
    const maxTop = viewport.offsetTop + viewport.height - btnRect.height - bottomSafeMargin;

    let newLeft = minLeft + Math.random() * Math.max(0, maxLeft - minLeft);
    let newTop = minTop + Math.random() * Math.max(0, maxTop - minTop);

    // evita che ricompaia troppo vicino al punto di contatto
    if (clientX !== undefined) {
      const dx = newLeft - clientX;
      const dy = newTop - clientY;
      if (Math.sqrt(dx * dx + dy * dy) < 140) {
        newLeft = minLeft + ((newLeft - minLeft + (maxLeft - minLeft) / 2) % Math.max(1, maxLeft - minLeft));
      }
    }

    // evita l'angolo in alto a destra, occupato dal bottone della musica
    const exclusionSize = 80;
    if (newLeft > viewport.offsetLeft + viewport.width - exclusionSize && newTop < viewport.offsetTop + exclusionSize) {
      newTop = viewport.offsetTop + exclusionSize + margin;
    }

    noBtn.style.left = `${Math.max(minLeft, newLeft)}px`;
    noBtn.style.top = `${Math.max(minTop, newTop)}px`;

    // un po' di casino: rotazione/dimensione casuale con un piccolo "rimbalzo"
    // all'atterraggio, uno sbuffo di emoji, e il bottone "Sì" che cresce
    // un pochino ogni volta
    const rotation = (Math.random() * 50 - 25).toFixed(1);
    const scale = (0.9 + Math.random() * 0.35).toFixed(2);
    noBtn.style.transform = `rotate(${rotation}deg) scale(0.7)`;
    requestAnimationFrame(() => {
      noBtn.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    });

    spawnPuff(originX, originY);
    growYesButton();

    dodgeCount += 1;
    updateHint();
  }

  function updateHint() {
    const messages = [
      'psst, prova a cliccare "No" 👀',
      'eh no, non è così facile 😄',
      'dai, ormai lo sai come va a finire...',
      'il bottone giusto è quello rosa 🌸',
      'ok dai basta, clicca "Sì" 🥹'
    ];
    const index = Math.min(dodgeCount, messages.length - 1);
    hintText.textContent = messages[index];
  }

  noBtn.addEventListener('mouseenter', (e) => dodgeNoButton(e.clientX, e.clientY));
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dodgeNoButton(e.clientX, e.clientY);
  });
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    dodgeNoButton(touch.clientX, touch.clientY);
  }, { passive: false });

  // ---------- Bottone "Sì" ----------
  yesBtn.addEventListener('click', () => {
    cheerSound.currentTime = 0;
    cheerSound.play().catch(() => { /* se il browser blocca, pazienza */ });

    introSection.style.display = 'none';
    revealSection.classList.add('is-visible');
    revealSection.setAttribute('aria-hidden', 'false');
    launchFlowerBurst();
    startPetalFall(24);
    revealSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  replayBtn.addEventListener('click', () => {
    launchFlowerBurst();
    startPetalFall(16);
  });

  // ---------- Esplosione di fiori al centro ----------
  function launchFlowerBurst() {
    if (prefersReducedMotion) return;
    flowerBurst.innerHTML = '';
    const total = 18;
    for (let i = 0; i < total; i++) {
      const span = document.createElement('span');
      span.className = 'burst-flower';
      span.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
      const angle = (360 / total) * i + (Math.random() * 20 - 10);
      const distance = 120 + Math.random() * 90;
      span.style.setProperty('--rot', `${angle}deg`);
      span.style.setProperty('--dist', `${-distance}px`);
      span.style.animationDelay = `${Math.random() * 0.15}s`;
      flowerBurst.appendChild(span);
    }
    setTimeout(() => { flowerBurst.innerHTML = ''; }, 1400);
  }

  // ---------- Petali che cadono dall'alto ----------
  function startPetalFall(count) {
    if (prefersReducedMotion) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnPetal(), i * 90);
    }
  }

  function spawnPetal() {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
    const startLeft = Math.random() * 100;
    const fallDuration = 5 + Math.random() * 4;
    const swayDuration = 2 + Math.random() * 2;
    const size = 1 + Math.random() * 1.2;

    petal.style.left = `${startLeft}vw`;
    petal.style.fontSize = `${size}rem`;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;

    petalLayer.appendChild(petal);
    setTimeout(() => petal.remove(), fallDuration * 1000 + 200);
  }

  // qualche petalo iniziale, discreto, mentre si legge la copertina
  startPetalFall(4);

  // ---------- Musica di sottofondo ----------
  let musicReady = true;

  music.addEventListener('error', () => {
    musicReady = false;
    musicBtn.disabled = true;
    musicBtn.title = 'Aggiungi musica.mp3 nella cartella per attivare l\'audio';
  });

  musicBtn.addEventListener('click', () => {
    if (!musicReady) return;
    if (music.paused) {
      music.play().then(() => { musicBtn.textContent = '🔊'; })
                   .catch(() => { musicReady = false; musicBtn.disabled = true; });
    } else {
      music.pause();
      musicBtn.textContent = '🔇';
    }
  });

  // ---------- Bottone "Apri" (copertina) ----------
  openBtn.addEventListener('click', () => {
    // il click è un gesto utente diretto: qui l'autoplay con audio è consentito
    if (musicReady) {
      music.play().then(() => { musicBtn.textContent = '🔊'; })
                   .catch(() => { /* l'utente potrà comunque avviarla dal bottone musica */ });
    }

    coverSection.classList.add('is-hidden');
    coverSection.setAttribute('aria-hidden', 'true');
    introSection.classList.add('is-visible');
    introSection.setAttribute('aria-hidden', 'false');
    startPetalFall(10);
  });
});
