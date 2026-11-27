/** "What comes first" strip, served from 'self' so the strict CSP holds (same mechanism as hero-canvas.ts).
 *  Decorative only (aria-hidden); the ordered list below it stays the content.
 *  Idea: one order moves through seven stages in order and waits at each gate until it checks.
 *  Stateless timeline (a pure function of the clock), 30 fps cap, paused offscreen/hidden,
 *  one still frame under prefers-reduced-motion. Hovering or focusing a row or a gate link highlights both; a gate link jumps to its row. */
export const SEQUENCE_SCRIPT = `(function () {
  var strip = document.querySelector('[data-seq-strip]');
  var canvas = strip && strip.querySelector('[data-seq-canvas]');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var labels = strip.querySelectorAll('[data-seq-label]');
  var rows = document.querySelectorAll('.sequence-list .seq-item');
  var N = 7;
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var width = 0, height = 0, ratio = 1, running = false, visible = true;
  var last = 0, lastDraw = 0, clock = 0, hl = -1, shown = [], shownHl = -2;
  var accent = '#6cc9a0', muted = '#9ba398', ground = '#121412';
  var MOVE = 900, DWELL = 700, CHECK_AT = 280, CHECK_LEN = 320, EXIT = 800, HOLD = 1000, FADE = 600;
  var PERIOD = N * (MOVE + DWELL) + EXIT + HOLD + FADE;
  var STILL = 3 * (MOVE + DWELL) + MOVE + 120;

  function ease(p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function gateX(i) { return (i + .5) * width / N; }

  function readColors() {
    try {
      var cs = getComputedStyle(canvas);
      accent = cs.getPropertyValue('--accent').trim() || accent;
      muted = cs.getPropertyValue('--muted').trim() || muted;
      ground = cs.getPropertyValue('--raised').trim() || ground;
    } catch (e) {}
  }

  /* Timeline at time t (ms): lead x and how far each gate has checked (0..1). */
  function state(t) {
    var checks = [], x = 0, i;
    for (i = 0; i < N; i++) checks.push(0);
    var cursor = 0, fade = 0;
    for (i = 0; i < N; i++) {
      var from = i === 0 ? 0 : gateX(i - 1), to = gateX(i);
      if (t < cursor + MOVE) { x = from + (to - from) * ease(clamp((t - cursor) / MOVE)); return { x: x, checks: checks, fade: 0 }; }
      cursor += MOVE;
      x = to;
      checks[i] = clamp((t - cursor - CHECK_AT) / CHECK_LEN);
      if (t < cursor + DWELL) return { x: x, checks: checks, fade: 0 };
      cursor += DWELL;
    }
    for (i = 0; i < N; i++) checks[i] = 1;
    if (t < cursor + EXIT) return { x: gateX(N - 1) + (width + 12 - gateX(N - 1)) * ease(clamp((t - cursor) / EXIT)), checks: checks, fade: 0 };
    cursor += EXIT;
    x = width + 12;
    if (t < cursor + HOLD) return { x: x, checks: checks, fade: 0 };
    cursor += HOLD;
    fade = clamp((t - cursor) / FADE);
    for (i = 0; i < N; i++) checks[i] = 1 - fade;
    return { x: -12, checks: checks, fade: fade };
  }

  function parcel(x, y, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = accent;
    ctx.fillRect(x - 5, y - 5, 10, 10);
    ctx.fillStyle = ground;
    ctx.fillRect(x - 5, y - .5, 10, 1);
    ctx.globalAlpha = 1;
  }

  function syncLabels(checks) {
    for (var i = 0; i < labels.length; i++) {
      var on = checks[i] >= 1;
      if (shown[i] !== on) { shown[i] = on; labels[i].classList.toggle('is-passed', on); }
    }
    if (shownHl !== hl) {
      shownHl = hl;
      for (var j = 0; j < labels.length; j++) labels[j].classList.toggle('is-focus', j === hl);
    }
  }

  function draw(t) {
    var s = state(t % PERIOD), midY = height - 22, top = 14, bottom = height - 2, i;
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.strokeStyle = muted; ctx.globalAlpha = .35; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, midY + .5); ctx.lineTo(width, midY + .5); ctx.stroke();
    for (i = 0; i < N; i++) {
      var gx = Math.round(gateX(i)) + .5, c = s.checks[i], on = i === hl;
      ctx.globalAlpha = on ? 1 : .4 + .6 * c;
      ctx.strokeStyle = c > 0 || on ? accent : muted;
      ctx.lineWidth = on ? 2.5 : 1.5;
      ctx.beginPath(); ctx.moveTo(gx, top); ctx.lineTo(gx, bottom); ctx.stroke();
      if (c > 0) {
        /* tick draws left stroke then right stroke */
        var a = clamp(c / .4), b = clamp((c - .4) / .6);
        ctx.globalAlpha = 1; ctx.strokeStyle = accent; ctx.lineWidth = 1.75; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(gx - 5, 7);
        ctx.lineTo(gx - 5 + 2.5 * a, 7 + 3.5 * a);
        if (b > 0) ctx.lineTo(gx - 2.5 + 7.5 * b, 10.5 - 8 * b);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    parcel(s.x - 28, midY, .3); parcel(s.x - 14, midY, .55); parcel(s.x, midY, 1);
    syncLabels(s.checks);
  }

  function resize() {
    var box = canvas.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 3);
    width = Math.max(1, box.width); height = Math.max(1, box.height);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    readColors();
    draw(reduce ? STILL : clock);
  }

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (now - lastDraw < 33) return;
    clock += last ? Math.min(100, now - last) : 0;
    last = now; lastDraw = now;
    draw(clock);
  }

  function update() {
    var should = !reduce && visible && !document.hidden;
    if (should && !running) { running = true; last = 0; requestAnimationFrame(frame); }
    else if (!should) running = false;
  }

  function highlight(i) {
    if (hl === i) return;
    hl = i;
    Array.prototype.forEach.call(rows, function (row, j) { row.classList.toggle('is-lit', j === i); });
    if (!running) draw(reduce ? STILL : clock);
  }

  /* Hovering or focusing a gate link or a row lights both. The gate links are real anchors to the rows,
     so keyboard users reach the highlight without the rows being focusable. */
  function bind(el, i) {
    el.addEventListener('mouseenter', function () { highlight(i); });
    el.addEventListener('mouseleave', function () { highlight(-1); });
    el.addEventListener('focusin', function () { highlight(i); });
    el.addEventListener('focusout', function () { highlight(-1); });
  }
  Array.prototype.forEach.call(rows, bind);
  Array.prototype.forEach.call(labels, bind);

  strip.classList.add('is-live');
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  (function watchRatio() {
    try { var mq = matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)'); var on = function () { resize(); watchRatio(); }; if (mq.addEventListener) mq.addEventListener('change', on, { once: true }); } catch (e) {}
  })();
  if (window.IntersectionObserver) new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; update(); }).observe(canvas);
  document.addEventListener('visibilitychange', update);
  update();
})();
`;
