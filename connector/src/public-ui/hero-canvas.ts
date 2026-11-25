/** Subtle hero canvas animation, served from 'self' so the strict CSP holds.
 *  Decorative only (aria-hidden), stops offscreen/hidden, and respects reduced motion. */
export const HERO_SCRIPT = `(function () {
  var canvas = document.querySelector('[data-hero-canvas]');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var width = 0, height = 0, ratio = 1, dots = [], running = false, visible = true, start = 0;
  var BLUE = [63, 169, 255], MINT = [95, 227, 161];

  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function rand(min, max) { return min + Math.random() * (max - min); }

  function seed() {
    dots = [];
    var count = Math.min(72, Math.max(24, Math.round(width / 20)));
    for (var j = 0; j < count; j++) {
      dots.push({ x: rand(0, width), y: rand(0, height), r: rand(.7, 1.8), tw: rand(0, Math.PI * 2), sp: rand(.5, 1.3), c: j % 3 === 0 ? MINT : BLUE });
    }
  }

  function resize() {
    var box = canvas.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, box.width); height = Math.max(1, box.height);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    seed();
    if (!running) draw(performance.now());
  }

  function wave(t, y0, amp, len, speed, color, alpha, lineWidth) {
    ctx.beginPath();
    for (var x = 0; x <= width + 10; x += 10) {
      var y = y0 * height + Math.sin(x / len + t * speed) * amp + Math.sin(x / (len * .55) - t * speed * .65) * amp * .35;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgba(color, alpha); ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function draw(now) {
    var t = reduce ? 0 : (now - start) / 1000;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < dots.length; i++) {
      var dot = dots[i], tw = .25 + .3 * Math.sin(t * dot.sp + dot.tw);
      ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(dot.c, tw * .45); ctx.fill();
    }
    wave(t, .22, 16, 220, .28, BLUE, .22, 1.5);
    wave(t, .78, 20, 260, .24, MINT, .20, 1.5);
    wave(t, .86, 12, 180, -.20, BLUE, .14, 1);
  }

  function frame(now) {
    if (!running) return;
    draw(now);
    requestAnimationFrame(frame);
  }

  function update() {
    var should = !reduce && visible && !document.hidden;
    if (should && !running) { running = true; requestAnimationFrame(frame); }
    else if (!should) running = false;
  }

  start = performance.now();
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize', resize);
  if (window.IntersectionObserver) new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; update(); }).observe(canvas);
  document.addEventListener('visibilitychange', update);
  canvas.classList.add('is-live');
  update();
})();
`;
