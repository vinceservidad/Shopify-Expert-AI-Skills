/** Hero stage animation, served from 'self' so the strict CSP holds.
 *  Decorative only (aria-hidden), stops offscreen/hidden, and honors reduced motion.
 *  Motif: faint, calm emerald and sea-green waves (no neon) and twinkling dots, kept to the top of the stage so nothing crosses the setup hint text. */
export const HERO_SCRIPT = `(function () {
  var canvas = document.querySelector('[data-hero-canvas]');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var width = 0, height = 0, ratio = 1, bandTop = 0, bandH = 240, dots = [], running = false, visible = true, last = 0, start = 0;
  var EMERALD = [96, 204, 154], SEA = [112, 196, 182], MINT = [150, 216, 188];

  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function rand(min, max) { return min + Math.random() * (max - min); }

  function seed() {
    dots = [];
    for (var j = 0; j < Math.min(64, Math.max(22, Math.round(width / 22))); j++) {
      dots.push({ x: rand(0, width), y: rand(0, Math.min(height * .5, bandTop + bandH)), r: rand(.6, 1.6), tw: rand(0, Math.PI * 2), sp: rand(.5, 1.4) });
    }
  }

  function resize() {
    var box = canvas.getBoundingClientRect();
    /* Crisp up to 3x, but cap the backing store so a tall phone hero stays under about 4 million pixels. */
    ratio = Math.min(window.devicePixelRatio || 1, 3);
    while (ratio > 1 && box.width * box.height * ratio * ratio > 4e6) ratio -= .5;
    width = Math.max(1, box.width); height = Math.max(1, box.height);
    /* Waves live in the gap between the header and the headline, so they never cross the tabs or the text. */
    var bar = document.querySelector('.top-bar'), h1 = document.querySelector('.hero-h1');
    bandTop = bar ? Math.max(0, bar.getBoundingClientRect().bottom - box.top) : 56;
    bandH = h1 ? Math.max(12, h1.getBoundingClientRect().top - box.top - bandTop - 8) : 120;
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    seed();
    if (!running) draw(performance.now());
  }

  function wave(t, y0, amp, len, speed, color, alpha, lineWidth) {
    ctx.beginPath();
    for (var x = 0; x <= width + 10; x += 10) {
      var a = Math.min(amp, bandH * .22), y = bandTop + y0 * bandH + Math.sin(x / len + t * speed) * a + Math.sin(x / (len * .54) - t * speed * .68) * a * .35;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgba(color, alpha); ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function draw(now) {
    var t = (now - start) / 1000, dt = last ? Math.min(.05, (now - last) / 1000) : 0;
    last = now;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < dots.length; i++) {
      var dot = dots[i], tw = .3 + .3 * Math.sin(t * dot.sp + dot.tw);
      ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(MINT, tw * .42); ctx.fill();
    }
    wave(t, .3, 14, 210, .30, EMERALD, .22, 1.4);
    wave(t, .68, 10, 180, -.20, SEA, .14, 1.1);
  }

  function frame(now) {
    if (!running) return;
    draw(now);
    requestAnimationFrame(frame);
  }

  function update() {
    var should = !reduce && visible && !document.hidden;
    if (should && !running) { running = true; last = 0; requestAnimationFrame(frame); }
    else if (!should) running = false;
  }

  start = performance.now();
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  /* Rotation, page zoom and moving to another screen can change the pixel ratio without changing the box. */
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  (function watchRatio() {
    try { var mq = matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)'); var on = function () { resize(); watchRatio(); }; if (mq.addEventListener) mq.addEventListener('change', on, { once: true }); } catch (e) {}
  })();
  if (window.IntersectionObserver) new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; update(); }).observe(canvas);
  document.addEventListener('visibilitychange', update);
  canvas.classList.add('is-live');
  update();
})();
`;
