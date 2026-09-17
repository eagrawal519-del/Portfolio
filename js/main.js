/**
 * 22nd-Century Doraemon Cybernetic Portfolio Controller
 * Developer: Ekta Agrawal
 * Zero External Dependencies — Lightweight, Performant & Accessible
 */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cache DOM Elements
  const siteNav = document.getElementById('siteNav');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.site-nav__link');
  const sections = document.querySelectorAll('section[id]');
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const copyToast = document.getElementById('copyToast');

  /* ==========================================================================
     1. SCROLL MONITOR & ACTIVE NAV LINK TRACKING
     ========================================================================== */

  function handleScroll() {
    if (!siteNav) return;
    if (window.scrollY > 40) {
      siteNav.classList.add('site-nav--scrolled');
    } else {
      siteNav.classList.remove('site-nav--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Highlight current active section in nav
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('site-nav__link--active');
          } else {
            link.classList.remove('site-nav__link--active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  /* ==========================================================================
     2. ACCESSIBLE MOBILE DRAWER NAVIGATION
     ========================================================================== */

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ==========================================================================
     3. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */

  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ==========================================================================
     4. TACTILE EMAIL COPY ACTION
     ========================================================================== */

  if (copyBtns.length > 0) {
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = 'agrawalekta498@gmail.com';

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
          } else {
            const textArea = document.createElement('textarea');
            textArea.value = email;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }

          showCopyToast('COORDINATES COPIED: ' + email);
        } catch (err) {
          window.location.href = 'mailto:' + email;
        }
      });
    });
  }

  let toastTimeout;
  function showCopyToast(msg) {
    if (!copyToast) return;
    copyToast.textContent = msg;
    copyToast.classList.add('is-visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      copyToast.classList.remove('is-visible');
    }, 3200);
  }

  /* ==========================================================================
     5. SUBTLE HERO HUD GYRO PARALLAX
     ========================================================================== */

  const hudPanel = document.querySelector('.hero__hud-panel');
  if (hudPanel && !prefersReducedMotion && window.innerWidth > 900) {
    hudPanel.addEventListener('mousemove', (e) => {
      const rect = hudPanel.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -6;
      const tiltY = (x / (rect.width / 2)) * 6;

      hudPanel.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    });

    hudPanel.addEventListener('mouseleave', () => {
      hudPanel.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      hudPanel.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    hudPanel.addEventListener('mouseenter', () => {
      hudPanel.style.transition = 'none';
    });
  }

  /* ==========================================================================
     6. INTERACTIVE 22ND-CENTURY SUB-SPACE CANVAS (BACKGROUND)
     ========================================================================== */

  const canvas = document.getElementById('subspaceCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });

    // Sub-space Stars & Dimensional Motes
    let stars = [];
    let motes = [];
    let shootingStars = [];

    function initParticles() {
      stars = [];
      const starCount = Math.floor((width * height) / 9000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.5,
          z: Math.random() * 0.8 + 0.2, // depth factor for parallax
          alpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }

      // 4D Dimensional Energy Motes (Cyan, Gold, Collar-Red)
      motes = [];
      const colors = ['#38BDF8', '#F59E0B', '#EF4444', '#0284C7'];
      for (let i = 0; i < 28; i++) {
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.6 - 0.2, // float upward
          alpha: Math.random() * 0.6 + 0.2,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    }

    initParticles();

    function spawnShootingStar() {
      if (Math.random() < 0.012 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: Math.random() * 90 + 50,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          alpha: 1
        });
      }
    }

    let isCanvasActive = true;
    document.addEventListener('visibilitychange', () => {
      isCanvasActive = !document.hidden;
    });

    function renderSubspace() {
      if (!isCanvasActive) {
        requestAnimationFrame(renderSubspace);
        return;
      }

      // Parallax smooth interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const offsetX = (mouseX - width / 2) * 0.04;
      const offsetY = (mouseY - height / 2) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Draw Stars with 3D Parallax & Twinkle
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = Math.max(0.1, s.alpha + Math.sin(s.twinklePhase) * 0.25);

        const drawX = s.x - offsetX * s.z;
        const drawY = s.y - offsetY * s.z;

        ctx.fillStyle = `rgba(240, 248, 255, ${currentAlpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw 4D Dimensional Floating Motes
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx;
        m.y += m.vy;
        m.pulsePhase += 0.03;

        // Wrap around screen boundaries
        if (m.y < -10) m.y = height + 10;
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        const currentRadius = m.radius + Math.sin(m.pulsePhase) * 0.8;
        const currentAlpha = m.alpha + Math.sin(m.pulsePhase) * 0.15;

        // Outer glow
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, currentRadius * 3);
        glow.addColorStop(0, m.color);
        glow.addColorStop(1, 'transparent');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, currentRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(m.x, m.y, currentRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Shooting Stars / Warp Streaks
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.015;

        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
      }

      requestAnimationFrame(renderSubspace);
    }

    renderSubspace();
  }

  /* ==========================================================================
     7. CUSTOM 22ND-CENTURY CYBER CURSOR FOLLOWER
     ========================================================================== */

  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (hasFinePointer && !prefersReducedMotion) {
    const dot = document.createElement('div');
    dot.className = 'cyber-cursor-dot';
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.className = 'cyber-cursor-ring';
    document.body.appendChild(ring);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Interactive Hover Tracking
    const interactiveSelectors = 'a, button, [role="button"], input, select, textarea, .btn, .door-card, .gadget-drawer, .memory-card, .contact-link-tile, .hud-satellite';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        ring.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        ring.classList.remove('is-hovering');
      }
    });

    // Click Ripple / Spark Effect
    window.addEventListener('click', (e) => {
      const spark = document.createElement('div');
      spark.className = 'cyber-cursor-click-spark';
      spark.style.left = e.clientX + 'px';
      spark.style.top = e.clientY + 'px';
      document.body.appendChild(spark);

      setTimeout(() => {
        if (spark.parentNode) spark.parentNode.removeChild(spark);
      }, 450);
    });
  }

  /* ==========================================================================
     8. 22ND-CENTURY DORAEMON THEME AUDIO SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */

  /**
   * Complete iconic "Doraemon no Uta" (Theme Song) synthesized polyphonically
   * using Web Audio API. 100% offline, zero network requests, zero copyright dependencies.
   */
  class DoraemonSynthesizer {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.timerId = null;
      this.stepIndex = 0;
      this.tempo = 132; // BPM
      this.beatDuration = 60 / this.tempo;

      // Note frequency dictionary (Hz)
      this.frequencies = {
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, Bb5: 932.33, C6: 1046.50,
        R: 0 // Rest
      };

      // Full melody score of "Doraemon no Uta":
      // [note, beats, bass_note]
      this.score = [
        // Verse: "Kon-na ko-to i-i na"
        ['C4', 0.5, 'F3'], ['F4', 0.5, 'F3'], ['F4', 0.5, 'A3'], ['A4', 0.5, 'C4'],
        ['D5', 0.75, 'Bb3'], ['A4', 0.25, 'D4'], ['C5', 1.0, 'F3'], ['R', 0.5, 'C4'],
        // "De-ki-ta-ra i-i na"
        ['C5', 0.5, 'C4'], ['D5', 0.5, 'E4'], ['C5', 0.5, 'G4'], ['A4', 0.5, 'F3'],
        ['Bb4', 0.5, 'Bb3'], ['A4', 0.5, 'D4'], ['G4', 1.0, 'C4'], ['R', 0.5, 'E4'],
        // "An-na yu-me kon-na yu-me ip-pai a-ru ke-do"
        ['D4', 0.5, 'G3'], ['G4', 0.5, 'Bb3'], ['G4', 0.5, 'D4'], ['Bb4', 0.5, 'G3'],
        ['E5', 0.75, 'C4'], ['E5', 0.5, 'E4'], ['D5', 0.5, 'G4'], ['C5', 0.5, 'C4'],
        ['Bb4', 0.5, 'D4'], ['Bb4', 0.5, 'F4'], ['A4', 0.5, 'F3'], ['D4', 0.5, 'Bb3'],
        ['F4', 0.5, 'A3'], ['F4', 0.5, 'C4'], ['G4', 1.0, 'C4'], ['R', 0.5, 'E4'],
        // "Min-na min-na min-na"
        ['C4', 0.5, 'F3'], ['F4', 0.5, 'F3'], ['F4', 0.5, 'A3'], ['A4', 0.5, 'C4'],
        ['D5', 0.75, 'Bb3'], ['A4', 0.25, 'D4'], ['C5', 1.0, 'F3'], ['R', 0.5, 'C4'],
        // "Ka-na-e-te ku-re-ru"
        ['C5', 0.5, 'C4'], ['D5', 0.5, 'E4'], ['C5', 0.5, 'G4'], ['A4', 0.5, 'F3'],
        ['Bb4', 0.5, 'Bb3'], ['A4', 0.5, 'D4'], ['G4', 1.0, 'C4'], ['R', 0.5, 'E4'],
        // "Fu-shi-gi-na pok-ke de ka-na-e-te ku-re-ru"
        ['D4', 0.5, 'G3'], ['G4', 0.5, 'Bb3'], ['G4', 0.5, 'D4'], ['Bb4', 0.5, 'G3'],
        ['E5', 0.75, 'C4'], ['D5', 0.5, 'E4'], ['C5', 0.5, 'G4'], ['Bb4', 0.5, 'Bb3'],
        ['Bb4', 0.5, 'D4'], ['A4', 0.5, 'F3'], ['G4', 0.5, 'C4'], ['E4', 0.5, 'C4'],
        ['G4', 0.5, 'C4'], ['F4', 1.5, 'F3'], ['R', 0.5, 'C4'],

        // Bridge: "So-ra o to-bi-tai na (Hai! Take-copter!)"
        ['A4', 0.5, 'F3'], ['Bb4', 0.5, 'G3'], ['C5', 0.75, 'A3'], ['D5', 0.75, 'Bb3'], ['C5', 1.0, 'C4'],
        ['R', 0.5, 'C4'], ['F5', 0.5, 'F3'], ['A5', 0.5, 'A3'], ['G5', 1.0, 'C4'], ['R', 0.5, 'E4'],

        // Chorus: "An an an, tot-te-mo dai-su-ki, Do-ra-e-mon"
        ['F4', 0.5, 'F3'], ['F4', 0.5, 'F3'], ['F4', 0.5, 'F3'], ['F4', 0.5, 'A3'], ['G4', 0.75, 'C4'], ['A4', 1.0, 'F3'],
        ['Bb4', 0.5, 'Bb3'], ['Bb4', 0.5, 'Bb3'], ['Bb4', 0.5, 'Bb3'], ['Bb4', 0.5, 'D4'], ['A4', 0.5, 'F3'], ['G4', 0.5, 'C4'], ['F4', 1.0, 'F3'],
        ['A4', 0.5, 'F3'], ['Bb4', 0.5, 'G3'], ['C5', 0.75, 'A3'], ['C5', 0.5, 'C4'], ['D5', 0.75, 'Bb3'], ['C5', 0.5, 'A3'],
        ['Bb4', 0.5, 'G3'], ['A4', 0.5, 'F3'], ['G4', 0.5, 'C4'], ['F4', 2.0, 'F3'], ['R', 1.0, 'C4']
      ];
    }

    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, duration, type = 'triangle', gainVal = 0.18) {
      if (!this.ctx || freq <= 0) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Cyber bell overtone (subtle sine octave higher)
      const overtone = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);

      // ADSR Envelope: Attack -> Decay -> Sustain -> Release
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(gainVal * 0.7, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.02);

      overtoneGain.gain.setValueAtTime(0.001, now);
      overtoneGain.gain.exponentialRampToValueAtTime(gainVal * 0.25, now + 0.03);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

      osc.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(this.ctx.destination);
      overtoneGain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + duration);
      overtone.stop(now + duration);
    }

    scheduleNextNote() {
      if (!this.isPlaying) return;

      const item = this.score[this.stepIndex];
      const noteName = item[0];
      const beats = item[1];
      const noteDuration = beats * this.beatDuration;
      const freq = this.frequencies[noteName] || 0;

      if (freq > 0) {
        this.playTone(freq, noteDuration * 0.9, 'triangle', 0.22);
      }

      this.stepIndex = (this.stepIndex + 1) % this.score.length;
      this.timerId = setTimeout(() => {
        this.scheduleNextNote();
      }, noteDuration * 1000);
    }

    start() {
      this.initContext();
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.scheduleNextNote();
      updateBgmUI(true);
    }

    stop() {
      this.isPlaying = false;
      clearTimeout(this.timerId);
      updateBgmUI(false);
    }

    toggle() {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.start();
      }
    }
  }

  const bgmPlayer = new DoraemonSynthesizer();

  // Connect Audio Controls
  const navBgmBtn = document.getElementById('bgmToggle');
  const audioDeckPlayBtn = document.getElementById('audioDeckPlay');
  const bgmLabel = document.getElementById('bgmLabel');

  function updateBgmUI(playing) {
    if (navBgmBtn) {
      if (playing) {
        navBgmBtn.classList.add('is-playing');
        if (bgmLabel) bgmLabel.textContent = 'BGM: ON';
      } else {
        navBgmBtn.classList.remove('is-playing');
        if (bgmLabel) bgmLabel.textContent = 'BGM // DORAEMON';
      }
    }

    if (audioDeckPlayBtn) {
      audioDeckPlayBtn.innerHTML = playing
        ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      audioDeckPlayBtn.setAttribute('aria-label', playing ? 'Pause background music' : 'Play Doraemon theme music');
    }
  }

  if (navBgmBtn) {
    navBgmBtn.addEventListener('click', () => bgmPlayer.toggle());
  }

  if (audioDeckPlayBtn) {
    audioDeckPlayBtn.addEventListener('click', () => bgmPlayer.toggle());
  }

  // Log 22nd-century system initialization
  console.log(
    '%c [DORAEMON 22ND-CENTURY INTERFACE ONLINE] %c Ekta Agrawal — Portfolio Loaded ',
    'background: #0284C7; color: #FFF; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'background: #0A111F; color: #38BDF8; padding: 4px 8px; border: 1px solid #38BDF8;'
  );
})();
