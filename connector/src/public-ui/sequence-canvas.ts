/** "What comes first" strip, served from 'self' so the strict CSP holds (same mechanism as hero-canvas.ts).
 *  Decorative only (aria-hidden); the ordered list below it stays the content.
 *  Idea: one order moves through seven stages in order and waits at each gate until it checks.
 *  It plays once (anti-slop v2: no looping animation, no auto-cycling): one pass when the strip first enters view, about
 *  5 seconds, then it rests on a still final frame (all seven gates checked, the order at the last gate) and no
 *  requestAnimationFrame loop keeps running. Picking or hovering a stage (a row or a gate link) replays the run up to
 *  that stage and rests there; leaving it redraws the final frame without motion.
 *  Stateless timeline (a pure function of the clock), 30 fps cap, paused offscreen/hidden,
 *  reduced motion draws each end frame straight away. A gate link jumps to its row.
 *  Colours: accent for the moving order and checked gates, signal (#eab04f) only for the lit step's gate. */
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
  var width = 0, height = 0, ratio = 1, running = false, visible = true, played = false;
  var last = 0, lastDraw = 0, clock = 0, target = N - 1, hl = -1, shown = [], shownHl = -2;
  var accent = '#62c597', muted = '#b2bbb6', ground = '#15191a', signal = '#eab04f';
  var MOVE = 420, DWELL = 280, CHECK_AT = 90, CHECK_LEN = 180;
  /* A run to stage k (0-based) ends once the order has checked gate k: the full pass (k = N - 1) takes N * 700 ms. */
  function runLength(k) { return (k + 1) * (MOVE + DWELL); }

  function ease(p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function gateX(i) { return (i + .5) * width / N; }

  function readColors() {
    try {
      var cs = getComputedStyle(canvas);
      accent = cs.getPropertyValue('--accent').trim() || accent;
      muted = cs.getPropertyValue('--muted').trim() || muted;
      ground = cs.getPropertyValue('--ground').trim() || ground;
      signal = cs.getPropertyValue('--signal').trim() || signal;
    } catch (e) {}
  }

  /* Timeline at time t (ms) of a run to stage k: lead x, how far each gate has checked (0..1), and how fast the
     order is moving (0 at rest), which sets its trail. At t >= runLength(k) this is the still end frame. */
  function state(t, k) {
    var checks = [], i;
    for (i = 0; i < N; i++) checks.push(0);
    var cursor = 0;
    for (i = 0; i <= k; i++) {
      var from = i === 0 ? 0 : gateX(i - 1), to = gateX(i);
      if (t < cursor + MOVE) { var p = clamp((t - cursor) / MOVE); return { x: from + (to - from) * ease(p), checks: checks, speed: Math.sin(Math.PI * p) }; }
      cursor += MOVE;
      checks[i] = clamp((t - cursor - CHECK_AT) / CHECK_LEN);
      if (t < cursor + DWELL) return { x: to, checks: checks, speed: 0 };
      cursor += DWELL;
    }
    return { x: gateX(k), checks: checks, speed: 0 };
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
    var s = state(t, target), midY = height - 22, top = 14, bottom = height - 2, i;
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.strokeStyle = muted; ctx.globalAlpha = .35; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, midY + .5); ctx.lineTo(width, midY + .5); ctx.stroke();
    for (i = 0; i < N; i++) {
      var gx = Math.round(gateX(i)) + .5, c = s.checks[i], on = i === hl;
      ctx.globalAlpha = on ? 1 : .4 + .6 * c;
      ctx.strokeStyle = on ? signal : c > 0 ? accent : muted;
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
    /* The trail exists only while the order moves, so a resting frame shows one order, not a frozen streak. */
    if (s.speed > 0) { parcel(s.x - 28 * s.speed, midY, .3 * s.speed); parcel(s.x - 14 * s.speed, midY, .55 * s.speed); }
    parcel(s.x, midY, 1);
    syncLabels(s.checks);
  }

  function resize() {
    var box = canvas.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 3);
    width = Math.max(1, box.width); height = Math.max(1, box.height);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    readColors();
    draw(clock);
  }

  function frame(now) {
    if (!running) return;
    if (now - lastDraw < 33) { requestAnimationFrame(frame); return; }
    clock += last ? Math.min(100, now - last) : 0;
    last = now; lastDraw = now;
    draw(clock);
    /* Run finished: rest on this frame and stop for good until a stage is picked or hovered. */
    if (clock >= runLength(target)) { running = false; strip.classList.add('is-settled'); return; }
    requestAnimationFrame(frame);
  }

  function update() {
    var should = !reduce && played && clock < runLength(target) && visible && !document.hidden;
    if (should && !running) { running = true; last = 0; lastDraw = 0; requestAnimationFrame(frame); }
    else if (!should) running = false;
  }

  /* Start a run to stage k from the beginning. Reduced motion jumps to its end frame. */
  function play(k) {
    target = k; played = true;
    clock = reduce ? runLength(k) : 0;
    strip.classList.remove('is-settled');
    draw(clock);
    if (reduce) strip.classList.add('is-settled');
    update();
  }

  /* Back to the full pass's still end frame, drawn once without motion. */
  function rest() {
    target = N - 1; clock = runLength(target); running = false;
    draw(clock);
    strip.classList.add('is-settled');
  }

  function highlight(i) {
    if (hl === i) return;
    hl = i;
    Array.prototype.forEach.call(rows, function (row, j) { row.classList.toggle('is-lit', j === i); });
    if (i >= 0) play(i); else if (played) rest(); else draw(clock);
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
  /* Reduced motion: the final still frame straight away, and no pass to play. */
  if (reduce) { played = true; clock = runLength(N - 1); strip.classList.add('is-settled'); }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  (function watchRatio() {
    try { var mq = matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)'); var on = function () { resize(); watchRatio(); }; if (mq.addEventListener) mq.addEventListener('change', on, { once: true }); } catch (e) {}
  })();
  /* The one pass starts the first time the strip enters view (straight away without IntersectionObserver). */
  if (window.IntersectionObserver) new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible && !played) play(N - 1); else update();
  }).observe(canvas);
  else play(N - 1);
  document.addEventListener('visibilitychange', update);
})();
`;
