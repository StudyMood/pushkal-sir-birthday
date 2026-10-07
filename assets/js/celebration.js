/* ==========================================================================
   INTERACTIVE CELEBRATION, CAKE & LIVE WISH BOARD ENGINE
   Pushkal Singh Birthday Tribute
   ========================================================================== */

(function () {
  'use strict';

  // --- Web Audio API Synth Sound Generator ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSparkleSound() {
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + i * 0.08);
        osc.stop(audioCtx.currentTime + i * 0.08 + 0.35);
      });
    } catch (e) {
      console.warn('Audio synth not supported', e);
    }
  }

  function playPopSound() {
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn(e);
    }
  }

  function playGrandChimeSound() {
    try {
      initAudio();
      if (!audioCtx) return;

      const melody = [
        { f: 523.25, d: 0.2 }, { f: 523.25, d: 0.2 }, { f: 587.33, d: 0.4 },
        { f: 523.25, d: 0.4 }, { f: 698.46, d: 0.4 }, { f: 659.25, d: 0.8 }
      ];

      let delay = 0;
      melody.forEach(item => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, audioCtx.currentTime + delay);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + item.d);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + item.d);

        delay += item.d + 0.04;
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Global window sound hooks for themes & actions
  window.playSparkleSound = playSparkleSound;
  window.playGrandChimeSound = playGrandChimeSound;
  window.initCelebrationAudio = initAudio;

  // --- Confetti helper ---
  function fireConfettiBlast() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#f43f5e', '#ffffff']
      });
    }
  }

  function fireGrandConfetti() {
    if (typeof confetti === 'function') {
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#3b82f6', '#ffffff']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#06b6d4', '#f43f5e']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }

  // --- Interactive Birthday Cake Logic ---
  const cakeStatus = document.getElementById('cake-status');

  function checkCandleStatus() {
    const allCandles = document.querySelectorAll('.cake-stage .candle');
    const total = allCandles.length;
    const litCount = document.querySelectorAll('.cake-stage .candle.lit').length;

    if (litCount === total && total > 0) {
      if (cakeStatus) {
        cakeStatus.innerHTML = '<span style="color: #f59e0b; font-weight: 700;">✨ All Candles Glowing! Happy Birthday Pushkal Sir! 🎉🎂</span>';
      }
      playGrandChimeSound();
      fireGrandConfetti();
      spawnFloatingBalloons(8);
    } else {
      if (cakeStatus) {
        cakeStatus.innerHTML = `Candles Lit: <span style="color: #f59e0b; font-weight: 700;">${litCount} / ${total}</span> (Tap candles or click button below!)`;
      }
    }
  }

  function setCandleLitState(candle, isLit) {
    const flame = candle.querySelector('.candle-flame');
    if (isLit) {
      candle.classList.add('lit');
      if (flame) {
        flame.style.cssText = 'display: block !important; opacity: 1 !important; visibility: visible !important;';
      }
    } else {
      candle.classList.remove('lit');
      if (flame) {
        flame.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important;';
      }
    }
  }

  // Event Delegation for Guaranteed Click Handling
  document.addEventListener('click', function (e) {
    const lightAllBtnTarget = e.target.closest('#light-all-candles-btn');
    if (lightAllBtnTarget) {
      e.preventDefault();
      initAudio();
      const allCandles = document.querySelectorAll('.cake-stage .candle');
      allCandles.forEach(candle => setCandleLitState(candle, true));
      playSparkleSound();
      fireGrandConfetti();
      checkCandleStatus();
      return;
    }

    const candleTarget = e.target.closest('.cake-stage .candle');
    if (candleTarget) {
      initAudio();
      const currentlyLit = candleTarget.classList.contains('lit');
      setCandleLitState(candleTarget, !currentlyLit);
      playSparkleSound();
      fireConfettiBlast();
      checkCandleStatus();
      return;
    }
  });

  // --- Floating Balloons Generator ---
  const balloonContainer = document.getElementById('balloon-float-container');
  const balloonColors = ['#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#ef4444'];

  function spawnFloatingBalloons(count = 5) {
    if (!balloonContainer) return;

    for (let i = 0; i < count; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'floating-balloon';
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      balloon.style.backgroundColor = color;
      balloon.style.boxShadow = `0 0 20px ${color}88`;
      balloon.style.left = `${Math.random() * 85 + 5}%`;
      balloon.style.animationDuration = `${Math.random() * 4 + 6}s`;
      balloon.style.animationDelay = `${Math.random() * 1.5}s`;

      balloon.addEventListener('click', function () {
        playPopSound();
        if (typeof confetti === 'function') {
          const rect = this.getBoundingClientRect();
          confetti({
            particleCount: 25,
            spread: 50,
            origin: {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight
            },
            colors: [color, '#ffffff']
          });
        }
        this.remove();
      });

      balloonContainer.appendChild(balloon);

      // Auto remove after animation completes
      setTimeout(() => {
        if (balloon.parentElement) {
          balloon.remove();
        }
      }, 12000);
    }
  }

  const launchBalloonsBtn = document.getElementById('launch-balloons-btn');
  if (launchBalloonsBtn) {
    launchBalloonsBtn.addEventListener('click', function () {
      initAudio();
      spawnFloatingBalloons(10);
      playSparkleSound();
    });
  }

  // --- Gift Box Reveal Modal ---
  const openGiftBtn = document.getElementById('open-gift-btn');
  const giftModal = document.getElementById('gift-modal');
  const closeGiftModalBtn = document.getElementById('close-gift-modal');

  if (openGiftBtn && giftModal) {
    openGiftBtn.addEventListener('click', function () {
      initAudio();
      giftModal.classList.add('active');
      playGrandChimeSound();
      fireGrandConfetti();
    });
  }

  if (closeGiftModalBtn && giftModal) {
    closeGiftModalBtn.addEventListener('click', function () {
      giftModal.classList.remove('active');
    });
  }

  if (giftModal) {
    giftModal.addEventListener('click', function (e) {
      if (e.target === giftModal) {
        giftModal.classList.remove('active');
      }
    });
  }

  // --- Thank You / Instant Wish Modal ---
  const thankYouModal = document.getElementById('thankyou-modal');
  const openThankYouBtns = document.querySelectorAll('.open-thankyou-btn');
  const closeThankYouModalBtn = document.getElementById('close-thankyou-modal');
  const closeThankYouBtn = document.getElementById('close-thankyou-btn');

  openThankYouBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      initAudio();
      if (thankYouModal) thankYouModal.classList.add('active');
      playGrandChimeSound();
      fireGrandConfetti();
      spawnFloatingBalloons(6);
    });
  });

  if (closeThankYouModalBtn && thankYouModal) {
    closeThankYouModalBtn.addEventListener('click', function () {
      thankYouModal.classList.remove('active');
    });
  }

  if (closeThankYouBtn && thankYouModal) {
    closeThankYouBtn.addEventListener('click', function () {
      thankYouModal.classList.remove('active');
    });
  }

  if (thankYouModal) {
    thankYouModal.addEventListener('click', function (e) {
      if (e.target === thankYouModal) {
        thankYouModal.classList.remove('active');
      }
    });
  }

  // --- Wish Submission Modal & LocalStorage Board ---
  const wishModal = document.getElementById('wish-modal');
  const openWishModalBtn = document.getElementById('open-wish-modal-btn');
  const closeWishModalBtn = document.getElementById('close-wish-modal');
  const wishForm = document.getElementById('wish-form');
  const swiperWrapper = document.getElementById('testimonials-swiper-wrapper');

  if (openWishModalBtn && wishModal) {
    openWishModalBtn.addEventListener('click', function () {
      initAudio();
      wishModal.classList.add('active');
    });
  }

  if (closeWishModalBtn && wishModal) {
    closeWishModalBtn.addEventListener('click', function () {
      wishModal.classList.remove('active');
    });

    wishModal.addEventListener('click', function (e) {
      if (e.target === wishModal) {
        wishModal.classList.remove('active');
      }
    });
  }

  // Initial Sample Wishes Data
  const defaultWishes = [
    {
      name: "Aditya Verma",
      role: "Former Intern -> Full Stack Developer",
      message: "Pushkal Sir didn't just teach us how to build software; he taught us how to believe in ourselves. His patience and mentorship transformed my career completely!",
      initials: "AV",
      likes: 28
    },
    {
      name: "Ananya Sharma",
      role: "Software Engineer @ Digicoders",
      message: "Whenever we faced complex bugs or felt overwhelmed as freshers, Pushkal Sir was always there with a smile and a solution. Truly the best leader!",
      initials: "AS",
      likes: 34
    },
    {
      name: "Rohan Tripathi",
      role: "Frontend Developer",
      message: "Happy Birthday Pushkal Sir! The way you guide 40+ interns simultaneously with personal attention is superhuman. Grateful for everything!",
      initials: "RT",
      likes: 41
    },
    {
      name: "Komal Gupta",
      role: "Backend Engineer",
      message: "Under your guidance at Digicoders, I discovered my true potential. Thank you for always pushing us to reach higher standards!",
      initials: "KG",
      likes: 29
    },
    {
      name: "Saurabh Mishra",
      role: "Intern -> Team Lead",
      message: "A true mentor creates more leaders, not followers. Pushkal Sir is the living proof of that philosophy. Wishing you a fabulous birthday!",
      initials: "SM",
      likes: 52
    }
  ];

  function getStoredWishes() {
    const saved = localStorage.getItem('pushkal_sir_wishes');
    return saved ? JSON.parse(saved) : [];
  }

  function saveStoredWish(wish) {
    const list = getStoredWishes();
    list.unshift(wish);
    localStorage.setItem('pushkal_sir_wishes', JSON.stringify(list));
  }

  function renderAllWishes() {
    if (!swiperWrapper) return;
    swiperWrapper.innerHTML = '';

    const customWishes = getStoredWishes();
    const all = [...customWishes, ...defaultWishes];

    all.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="glass-card tribute-card">
          <div class="tribute-quote-icon">
            <i class="fas fa-quote-left"></i>
          </div>
          <p class="tribute-message">"${escapeHTML(item.message)}"</p>
          <div class="tribute-author-box">
            <div class="tribute-author-info">
              <div class="author-avatar">${item.initials || 'PS'}</div>
              <div>
                <h4 class="author-name">${escapeHTML(item.name)}</h4>
                <p class="author-role">${escapeHTML(item.role)}</p>
              </div>
            </div>
            <button class="like-btn" onclick="this.classList.toggle('active')">
              <i class="fas fa-heart"></i> <span>${item.likes || 1}</span>
            </button>
          </div>
        </div>
      `;
      swiperWrapper.appendChild(slide);
    });

    // Reinitialize / update Swiper if initialized
    if (window.tributeSwiper && typeof window.tributeSwiper.update === 'function') {
      window.tributeSwiper.update();
    }
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (wishForm) {
    wishForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('wish-name').value.trim();
      const role = document.getElementById('wish-role').value.trim() || 'Intern / Well Wisher';
      const message = document.getElementById('wish-message').value.trim();

      if (!name || !message) return;

      const names = name.split(' ');
      const initials = names.length > 1
        ? (names[0][0] + names[1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();

      const newWish = {
        name: name,
        role: role,
        message: message,
        initials: initials,
        likes: 1
      };

      saveStoredWish(newWish);
      renderAllWishes();

      wishForm.reset();
      if (wishModal) wishModal.classList.remove('active');

      initAudio();
      playSparkleSound();
      fireGrandConfetti();

      alert(`🎉 Thank you, ${name}! Your birthday wish for Pushkal Sir has been posted successfully!`);
    });
  }

  // Initial render
  renderAllWishes();
})();
