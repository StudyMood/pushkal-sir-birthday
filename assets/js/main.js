/* ==========================================================================
   MAIN JAVASCRIPT CONTROLLER & GSAP ANIMATIONS
   Pushkal Singh Birthday Tribute
   Digicoders Pvt. Ltd., Lucknow
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Preloader Sequence ---
  const preloader = document.getElementById('preloader');
  const progressFill = document.querySelector('.loader-progress-fill');
  let progress = 0;

  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 18) + 12;
    if (progress > 100) progress = 100;
    if (progressFill) progressFill.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        initHeroAnimations();
      }, 400);
    }
  }, 100);

  // --- 2. Navbar Scroll State & Mobile Menu ---
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // --- 3. Typing Effect in Hero Subtitle ---
  const typingTarget = document.getElementById('hero-typed-text');
  const phrases = [
    "The Mentor Who Turned Interns Into Professionals",
    "Enabled 300+ Student Placements Across All Technologies 🚀",
    "Guiding 40+ Interns with Dedication @ Digicoders Pvt. Ltd.",
    "Master Mentor: Full Stack, MERN, Python, Java & Mobile Apps",
    "A Leader Who Inspires Potential into Lifetime Achievement",
    "Happy Birthday, Respected Pushkal Sir! 🎂"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typingTarget) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at completion
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // --- 4. GSAP & ScrollTrigger Animations ---
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.hero-badge-wrap', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.hero-title', {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.hero-subtitle-wrap', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out'
    });

    gsap.from('.hero-description', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.hero-cta-group', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.hero-portrait-wrapper', {
      opacity: 0,
      scale: 0.9,
      duration: 1.2,
      delay: 0.3,
      ease: 'back.out(1.5)'
    });
  }

  // Scroll Trigger Animations for other sections
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Section Headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // About Section
    gsap.from('.about-image-card', {
      scrollTrigger: {
        trigger: '.about-grid',
        start: 'top 80%'
      },
      opacity: 0,
      x: -40,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.about-content', {
      scrollTrigger: {
        trigger: '.about-grid',
        start: 'top 80%'
      },
      opacity: 0,
      x: 40,
      duration: 1,
      ease: 'power3.out'
    });

    // Impact Counters Animation
    const counterElements = document.querySelectorAll('.counter-val');
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power2.out'
          });
        }
      });
    });

    // Timeline Progress & Nodes
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });

    // Achievement Cards Stagger
    gsap.from('.achievement-card', {
      scrollTrigger: {
        trigger: '.achievements-grid',
        start: 'top 80%'
      },
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  // --- 5. Swiper Slider Initialization ---
  if (typeof Swiper !== 'undefined') {
    window.tributeSwiper = new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 28,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      },
    });
  }

  // --- 6. Memory Gallery Category Filter & Lightbox ---
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title')?.textContent || 'Pushkal Singh - Digicoders Pvt. Ltd.';
      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // --- 7. Synthesized Ambient Background Music & Equalizer ---
  const audioBtn = document.getElementById('audio-toggle-btn');
  let isMusicPlaying = false;
  let musicInterval = null;
  let bgmCtx = null;

  function initBgm() {
    if (!bgmCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) bgmCtx = new AudioContext();
    }
    if (bgmCtx && bgmCtx.state === 'suspended') {
      bgmCtx.resume();
    }
  }

  // Soothing pentatonic / uplifting celebratory chords generator
  const chords = [
    [261.63, 329.63, 392.00, 523.25], // C major
    [220.00, 261.63, 329.63, 440.00], // A minor
    [174.61, 220.00, 261.63, 349.23], // F major
    [196.00, 246.94, 293.66, 392.00]  // G major
  ];
  let chordIndex = 0;

  function playAmbientChord() {
    if (!bgmCtx || !isMusicPlaying) return;
    try {
      const currentNotes = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      currentNotes.forEach((freq, i) => {
        const osc = bgmCtx.createOscillator();
        const gain = bgmCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, bgmCtx.currentTime + i * 0.1);

        gain.gain.setValueAtTime(0.04, bgmCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, bgmCtx.currentTime + 3.2);

        osc.connect(gain);
        gain.connect(bgmCtx.destination);

        osc.start(bgmCtx.currentTime + i * 0.1);
        osc.stop(bgmCtx.currentTime + 3.4);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      initBgm();
      isMusicPlaying = !isMusicPlaying;

      if (isMusicPlaying) {
        audioBtn.classList.add('playing');
        playAmbientChord();
        musicInterval = setInterval(playAmbientChord, 2800);
      } else {
        audioBtn.classList.remove('playing');
        if (musicInterval) clearInterval(musicInterval);
      }
    });
  }

  // --- 8. Share & WhatsApp Action ---
  const shareBtn = document.getElementById('share-whatsapp-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const text = encodeURIComponent("🎉 Wishing a very Happy Birthday to Mr. Pushkal Singh! The incredible mentor and leader behind 40+ interns at Digicoders Pvt. Ltd., Lucknow! Check out the digital tribute website: " + window.location.href);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });
  }

  // --- 9. Theme Management Engine (Light Mode, Dark Gold, Sapphire, Emerald, Sunset) ---
  const THEME_STORAGE_KEY = 'pushkal_sir_theme_choice';
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themePaletteBtn = document.getElementById('theme-palette-btn');
  const floatingThemeBtn = document.getElementById('floating-theme-btn');
  const themePickerTray = document.getElementById('theme-picker-tray');
  const closeThemeTrayBtn = document.getElementById('close-theme-tray');
  const themeOptionCards = document.querySelectorAll('.theme-option-card');

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark-gold';
  }

  function applyTheme(themeName, playSound = false) {
    if (!themeName) themeName = 'dark-gold';

    // Apply attribute to html
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);

    // Update 1-click toggle icon & title
    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector('i');
      if (icon) {
        if (themeName === 'light') {
          icon.className = 'fas fa-moon';
          themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
          themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        } else {
          icon.className = 'fas fa-sun';
          themeToggleBtn.setAttribute('title', 'Switch to Clean Light Mode');
          themeToggleBtn.setAttribute('aria-label', 'Switch to Clean Light Mode');
        }
      }
    }

    // Update active state in theme options list
    themeOptionCards.forEach(card => {
      if (card.getAttribute('data-theme-set') === themeName) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update Three.js particles
    if (typeof window.updateParticleTheme === 'function') {
      window.updateParticleTheme(themeName);
    }

    // Sound effect
    if (playSound && typeof window.playSparkleSound === 'function') {
      window.playSparkleSound();
    }
  }

  // Load saved theme or check system preference
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark-gold';
  applyTheme(savedTheme, false);

  // Quick 1-click Light / Dark toggle button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = getCurrentTheme();
      const nextTheme = current === 'light' ? 'dark-gold' : 'light';
      applyTheme(nextTheme, true);
      if (typeof confetti === 'function' && nextTheme === 'light') {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.15 }
        });
      }
    });
  }

  // Toggle Theme Tray Popup
  function toggleThemeTray() {
    if (themePickerTray) {
      themePickerTray.classList.toggle('active');
      if (themePickerTray.classList.contains('active') && typeof window.playSparkleSound === 'function') {
        window.playSparkleSound();
      }
    }
  }

  if (themePaletteBtn) {
    themePaletteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleThemeTray();
    });
  }

  if (floatingThemeBtn) {
    floatingThemeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleThemeTray();
    });
  }

  if (closeThemeTrayBtn) {
    closeThemeTrayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (themePickerTray) themePickerTray.classList.remove('active');
    });
  }

  // Close tray when clicking outside
  document.addEventListener('click', (e) => {
    if (themePickerTray && themePickerTray.classList.contains('active')) {
      if (!themePickerTray.contains(e.target) &&
          !themePaletteBtn?.contains(e.target) &&
          !floatingThemeBtn?.contains(e.target)) {
        themePickerTray.classList.remove('active');
      }
    }
  });

  // Handle click on each theme card
  themeOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedTheme = card.getAttribute('data-theme-set');
      applyTheme(selectedTheme, true);
      setTimeout(() => {
        if (themePickerTray) themePickerTray.classList.remove('active');
      }, 250);
    });
  });
});

