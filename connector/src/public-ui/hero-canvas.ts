/** Hero stage animation, served from 'self' as /shopify-va/assets/hero.js so the public page CSP
 *  (script-src 'self', no inline script) holds. Decorative only: the canvas is aria-hidden, the page
 *  reads the same without JavaScript, reduced-motion visitors get one still frame, and drawing stops
 *  while the stage is off screen or the tab is hidden. Motif: the ShopifySkills icon's glow waves,
 *  plus price tags that drift up and tick to a check. */
export const HERO_SCRIPT = `(function () {
  var canvas = document.querySelector('[data-hero-canvas]');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var width = 0, height = 0, ratio = 1, tags = [], dots = [], running = false, visible = true, last = 0, start = 0;
  var GREEN = [124, 201, 160], LIME = [200, 236, 120], MINT = [158, 230, 196];

  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function rand(min, max) { return min + Math.random() * (max - min); }

  function makeTag(initial) {
    var size = rand(26, 54) * Math.min(1, Math.max(.7, width / 1100));
    return { x: rand(0, width), y: initial ? rand(0, height) : height + size * 2, size: size,
      speed: rand(8, 20), drift: rand(-6, 6), angle: rand(-.5, .5), spin: rand(-.08, .08),
      alpha: rand(.10, .26), checkAt: rand(.25, .75), checked: 0 };
  }

  function seed() {
    var count = Math.round(Math.min(14, Math.max(6, width / 95)));
    tags = []; dots = [];
    for (var i = 0; i < count; i++) tags.push(makeTag(true));
    for (var j = 0; j < Math.round(width / 14); j++) dots.push({ x: rand(0, width), y: rand(0, height), r: rand(.6, 1.8), tw: rand(0, Math.PI * 2), sp: rand(.6, 1.6) });
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
    for (var x = 0; x <= width + 8; x += 8) {
      var y = y0 * height + Math.sin(x / len + t * speed) * amp + Math.sin(x / (len * .53) - t * speed * .7) * amp * .35;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rgba(color, alpha); ctx.lineWidth = lineWidth;
    ctx.shadowColor = rgba(color, .9); ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function tagPath(s) {
    var w = s * 1.25, h = s * .82, r = s * .16, p = s * .42;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + r, -h / 2);
    ctx.lineTo(w / 2 - r, -h / 2); ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    ctx.lineTo(w / 2, h / 2 - r); ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    ctx.lineTo(-w / 2 + r * .4, h / 2);
    ctx.lineTo(-w / 2 - p, 0);
    ctx.lineTo(-w / 2 + r * .4, -h / 2);
    ctx.closePath();
  }

  function drawTag(tag) {
    // Keep the headline column calm on wide layouts: tags there fade to a whisper.
    var calm = width > 900 && tag.x < width * .55 ? .4 : 1;
    ctx.save();
    ctx.globalAlpha = calm;
    ctx.translate(tag.x, tag.y); ctx.rotate(tag.angle);
    var s = tag.size;
    tagPath(s);
    ctx.fillStyle = rgba(MINT, tag.alpha * .35); ctx.fill();
    ctx.strokeStyle = rgba(MINT, tag.alpha * 1.6); ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.arc(-s * .52, 0, s * .085, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(MINT, tag.alpha * 1.6); ctx.stroke();
    if (tag.checked > 0) {
      var k = Math.min(1, tag.checked), c = k < 1 ? MINT : LIME;
      ctx.beginPath();
      var a = [-s * .16, s * .02], b = [-s * .02, s * .17], d = [s * .3, -s * .17];
      ctx.moveTo(a[0], a[1]);
      if (k < .4) ctx.lineTo(a[0] + (b[0] - a[0]) * k / .4, a[1] + (b[1] - a[1]) * k / .4);
      else { ctx.lineTo(b[0], b[1]); var q = (k - .4) / .6; ctx.lineTo(b[0] + (d[0] - b[0]) * q, b[1] + (d[1] - b[1]) * q); }
      ctx.strokeStyle = rgba(c, Math.min(.95, tag.alpha * 3.2)); ctx.lineWidth = Math.max(2, s * .09);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.shadowColor = rgba(LIME, .8); ctx.shadowBlur = k >= 1 ? 10 : 0;
      ctx.stroke(); ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  function draw(now) {
    var t = (now - start) / 1000, dt = last ? Math.min(.05, (now - last) / 1000) : 0;
    last = now;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < dots.length; i++) {
      var dot = dots[i], tw = .35 + .35 * Math.sin(t * dot.sp + dot.tw);
      ctx.beginPath(); ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(MINT, tw * .5); ctx.fill();
    }
    wave(t, .24, 18, 210, .35, GREEN, .55, 2);
    wave(t, .32, 12, 160, -.28, GREEN, .28, 1.2);
    wave(t, .80, 22, 240, .30, GREEN, .5, 2);
    wave(t, .88, 14, 180, -.22, LIME, .22, 1.2);
    for (var n = 0; n < tags.length; n++) {
      var tag = tags[n];
      if (!reduce) {
        tag.y -= tag.speed * dt; tag.x += tag.drift * dt; tag.angle += tag.spin * dt;
        var progress = 1 - tag.y / height;
        if (progress > tag.checkAt && tag.checked < 1.2) tag.checked += dt * 1.6;
        if (tag.y < -tag.size * 2) tags[n] = makeTag(false);
      } else if (n % 2 === 0) tag.checked = 1.2;
      drawTag(tags[n]);
    }
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
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize', resize);
  if (window.IntersectionObserver) new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; update(); }).observe(canvas);
  document.addEventListener('visibilitychange', update);
  canvas.classList.add('is-live');
  update();
})();
`;
