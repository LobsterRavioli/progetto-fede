// ==========================================================
// SCUSA LISA — interazioni
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  const noBtn = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  const choiceBox = document.querySelector('.choice-box');
  const hintText = document.getElementById('hint-text');
  const introSection = document.querySelector('.intro');
  const revealSection = document.getElementById('reveal-section');
  const flowerBurst = document.getElementById('flower-burst');
  const replayBtn = document.getElementById('replay-btn');
  const petalLayer = document.getElementById('petal-layer');
  const musicBtn = document.getElementById('music-toggle-btn');
  const music = document.getElementById('background-music');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FLOWERS = ['🌸', '🌷', '🌼', '🌻', '🌺', '💮', '🌹'];

  // ---------- Il bottone "No" scappa ----------
  let dodgeCount = 0;

  function dodgeNoButton(clientX, clientY) {
    if (prefersReducedMotion) return;

    const boxRect = choiceBox.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    if (!noBtn.classList.contains('is-fleeing')) {
      noBtn.classList.add('is-fleeing');
      noBtn.style.width = `${btnRect.width}px`;
    }

    const margin = 16;
    const maxLeft = window.innerWidth - btnRect.width - margin;
    const maxTop = window.innerHeight - btnRect.height - margin;

    let newLeft = Math.random() * (maxLeft - margin) + margin;
    let newTop = Math.random() * (maxTop - margin) + margin;

    // evita che ricompaia troppo vicino al punto di contatto
    if (clientX !== undefined) {
      const dx = newLeft - clientX;
      const dy = newTop - clientY;
      if (Math.sqrt(dx * dx + dy * dy) < 140) {
        newLeft = (newLeft + window.innerWidth / 2) % maxLeft;
      }
    }

    // evita l'angolo in alto a destra, occupato dal bottone della musica
    const exclusionSize = 80;
    if (newLeft > window.innerWidth - exclusionSize && newTop < exclusionSize) {
      newTop = exclusionSize + margin;
    }

    noBtn.style.left = `${Math.max(margin, newLeft)}px`;
    noBtn.style.top = `${Math.max(margin, newTop)}px`;

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

  // qualche petalo iniziale, discreto, mentre si legge la pagina
  startPetalFall(6);

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
});
