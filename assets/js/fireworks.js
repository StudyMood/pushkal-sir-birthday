/* ==========================================================================
   GRAND FINALE FIREWORKS CANVAS ENGINE
   Pushkal Singh Birthday Tribute
   ========================================================================== */

(function () {
  'use strict';

  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', function () {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const fireworks = [];
  const particles = [];

  // Colors
  const colors = [
    '#f59e0b', '#fde68a', '#3b82f6', '#06b6d4',
    '#ec4899', '#10b981', '#ffffff', '#a855f7'
  ];

  class Firework {
    constructor(sx, sy, tx, ty) {
      this.x = sx;
      this.y = sy;
      this.sx = sx;
      this.sy = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 3;
      this.acceleration = 1.05;
      this.brightness = Math.random() * 50 + 50;
      this.targetRadius = 1;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.speed *= this.acceleration;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;

      this.distanceTraveled = Math.hypot(this.x + vx - this.sx, this.y + vy - this.sy);

      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 8 + 1;
      this.friction = 0.95;
      this.gravity = 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.015;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function createParticles(x, y) {
    let particleCount = 40;
    while (particleCount--) {
      particles.push(new Particle(x, y));
    }
  }

  let timerTotal = 40;
  let timerTick = 0;

  function loop() {
    requestAnimationFrame(loop);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    let j = particles.length;
    while (j--) {
      particles[j].draw();
      particles[j].update(j);
    }

    if (timerTick >= timerTotal) {
      // Auto launch firework
      const startX = width / 2 + (Math.random() - 0.5) * (width * 0.6);
      const targetX = Math.random() * width;
      const targetY = Math.random() * (height * 0.55);
      fireworks.push(new Firework(startX, height, targetX, targetY));
      timerTick = 0;
    } else {
      timerTick++;
    }
  }

  // Interactive Click to launch firework
  canvas.parentElement.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickY > 0 && clickY < height && clickX > 0 && clickX < width) {
      fireworks.push(new Firework(width / 2, height, clickX, clickY));
      createParticles(clickX, clickY);
    }
  });

  loop();
})();
