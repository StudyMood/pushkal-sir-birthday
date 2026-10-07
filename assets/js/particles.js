/* ==========================================================================
   THREE.JS 3D PARTICLE CONSTELLATION & DYNAMIC LIGHT SYSTEM
   Pushkal Singh Birthday Tribute
   ========================================================================== */

(function () {
  'use strict';

  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 800;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Particles Configuration
  const particleCount = window.innerWidth < 768 ? 90 : 180;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = [];

  // Theme-specific color palettes
  const themePalettes = {
    'light': [
      new THREE.Color(0xd97706), // Warm Amber
      new THREE.Color(0x2563eb), // Royal Blue
      new THREE.Color(0x0284c7), // Cyan Sky
      new THREE.Color(0x10b981), // Fresh Emerald
      new THREE.Color(0xf59e0b)  // Golden Ray
    ],
    'dark-gold': [
      new THREE.Color(0xf59e0b), // Gold
      new THREE.Color(0xfde68a), // Light gold
      new THREE.Color(0x3b82f6), // Sapphire Blue
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0xffffff)  // Pure White
    ],
    'dark-sapphire': [
      new THREE.Color(0x38bdf8), // Sky Cyan
      new THREE.Color(0x6366f1), // Electric Indigo
      new THREE.Color(0x818cf8), // Soft Lavender Blue
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0xffffff)  // Diamond White
    ],
    'emerald-gold': [
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0x34d399), // Mint
      new THREE.Color(0xf59e0b), // Gold
      new THREE.Color(0xfde68a), // Champagne
      new THREE.Color(0xffffff)  // Pure White
    ],
    'sunset-rose': [
      new THREE.Color(0xf43f5e), // Rose
      new THREE.Color(0xfb7185), // Coral Pink
      new THREE.Color(0xfbbf24), // Champagne Gold
      new THREE.Color(0xfde68a), // Warm Cream
      new THREE.Color(0xffffff)  // Pure White
    ]
  };

  function getPaletteForTheme(themeName) {
    return themePalettes[themeName] || themePalettes['dark-gold'];
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark-gold';
  const initialPalette = getPaletteForTheme(currentTheme);

  for (let i = 0; i < particleCount; i++) {
    // Spread in 3D Space
    positions[i * 3] = (Math.random() - 0.5) * 1600;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

    const chosenColor = initialPalette[Math.floor(Math.random() * initialPalette.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;

    velocities.push({
      x: (Math.random() - 0.5) * 0.6,
      y: (Math.random() - 0.5) * 0.6,
      z: (Math.random() - 0.5) * 0.6
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular Glow Texture generator
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 230, 150, 0.85)');
    gradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.45)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  const material = new THREE.PointsMaterial({
    size: 16,
    vertexColors: true,
    map: createParticleTexture(),
    transparent: true,
    opacity: currentTheme === 'light' ? 0.6 : 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Dynamic Theme Updater for Three.js Particles
  window.updateParticleTheme = function (themeName) {
    const palette = getPaletteForTheme(themeName);
    const colArray = geometry.attributes.color.array;

    for (let i = 0; i < particleCount; i++) {
      const chosenColor = palette[Math.floor(Math.random() * palette.length)];
      colArray[i * 3] = chosenColor.r;
      colArray[i * 3 + 1] = chosenColor.g;
      colArray[i * 3 + 2] = chosenColor.b;
    }

    geometry.attributes.color.needsUpdate = true;

    if (material) {
      material.opacity = themeName === 'light' ? 0.6 : 0.85;
      material.size = themeName === 'light' ? 14 : 16;
    }
  };

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX - windowHalfX) * 0.4;
    mouseY = (e.clientY - windowHalfY) * 0.4;
  });

  // Touch Interaction
  document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      mouseX = (e.touches[0].clientX - windowHalfX) * 0.4;
      mouseY = (e.touches[0].clientY - windowHalfY) * 0.4;
    }
  }, { passive: true });

  // Resize Handler
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth Mouse Dampening
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX;
    camera.position.y = -targetY;
    camera.lookAt(scene.position);

    // Particle Velocity Updates
    const posArray = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i].x;
      posArray[i * 3 + 1] += velocities[i].y;
      posArray[i * 3 + 2] += velocities[i].z;

      // Boundary Wrapping
      if (posArray[i * 3] > 800) posArray[i * 3] = -800;
      if (posArray[i * 3] < -800) posArray[i * 3] = 800;

      if (posArray[i * 3 + 1] > 600) posArray[i * 3 + 1] = -600;
      if (posArray[i * 3 + 1] < -600) posArray[i * 3 + 1] = 600;

      if (posArray[i * 3 + 2] > 400) posArray[i * 3 + 2] = -400;
      if (posArray[i * 3 + 2] < -400) posArray[i * 3 + 2] = 400;
    }

    geometry.attributes.position.needsUpdate = true;
    particleSystem.rotation.y += 0.0008;
    particleSystem.rotation.x += 0.0004;

    renderer.render(scene, camera);
  }

  animate();
})();
