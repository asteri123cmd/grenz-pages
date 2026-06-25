/* ===================================================
   GRENZ — Starfield (pure Canvas 2D, no dependencies)
   Lightweight star-tunnel / warp effect
   Adapted from Starfield-1 component, neon-green palette
   =================================================== */
(function () {
  'use strict';

  function init() {
    const canvas = document.getElementById('heroStarfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ── Config ── */
    const STAR_COUNT  = 180;
    const SPEED       = 0.55;       // warp speed (lower = slower)
    const TAIL_LENGTH = 0.18;       // star trail length factor
    const MIN_SIZE    = 0.4;
    const MAX_SIZE    = 2.2;

    /* ── Neon-green palette ── */
    const COLORS = [
      'rgba(127,255,0,',    // #7fff00 neon green
      'rgba(180,255,50,',   // lime
      'rgba(220,255,120,',  // pale lime
      'rgba(255,255,255,',  // white core
    ];

    let W, H, CX, CY;
    let paused = false;
    let raf = null;

    /* ── Star object ── */
    function Star() {
      this.reset(true);
    }
    Star.prototype.reset = function (init) {
      this.x  = (Math.random() - 0.5) * W;
      this.y  = (Math.random() - 0.5) * H;
      this.z  = init ? Math.random() * W : W;
      this.pz = this.z;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    };
    Star.prototype.update = function () {
      this.pz = this.z;
      this.z -= SPEED * 2.5;
      if (this.z <= 0) this.reset(false);
    };
    Star.prototype.draw = function () {
      const sx  = (this.x / this.z)  * W + CX;
      const sy  = (this.y / this.z)  * H + CY;
      const px  = (this.x / this.pz) * W + CX;
      const py  = (this.y / this.pz) * H + CY;
      const size = Math.max(MIN_SIZE, (1 - this.z / W) * MAX_SIZE);
      const alpha = Math.min(1, (1 - this.z / W) * 1.4);

      // Trail line
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = this.col + (alpha * TAIL_LENGTH).toFixed(2) + ')';
      ctx.lineWidth = size * 0.8;
      ctx.stroke();

      // Bright core dot
      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = this.col + alpha.toFixed(2) + ')';
      ctx.fill();
    };

    /* ── Init stars ── */
    let stars = [];
    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
      }
    }

    /* ── Resize ── */
    function resize() {
      const hero = canvas.parentElement;
      if (!hero) return;
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      if (!W || !H) return;
      CX = W / 2;
      CY = H / 2;
      canvas.width  = W;
      canvas.height = H;
      // Explicitly set CSS size for height:auto parents (mobile)
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      canvas.style.position = 'absolute';
      canvas.style.top  = '0';
      canvas.style.left = '0';
      initStars();
    }
    setTimeout(resize, 50);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('load', resize, { passive: true });

    /* ── Pause on hidden tab ── */
    document.addEventListener('visibilitychange', () => {
      paused = document.hidden;
      if (!paused && !raf) loop();
    });

    /* ── Animation loop ── */
    function loop() {
      if (paused) { raf = null; return; }

      // Fade trail (dark semi-transparent bg)
      ctx.fillStyle = 'rgba(4,9,10,0.25)';
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    /* ── Cleanup ── */
    window.addEventListener('beforeunload', () => {
      if (raf) cancelAnimationFrame(raf);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
