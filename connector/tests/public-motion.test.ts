import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { SECURITY_HEADERS, publicContent } from '../src/public-routes.js';

/* Anti-slop v2 (owner, 2026-11-27): no looping animation. The hero waves settle once (about 3 s) and the sequence strip
   plays once when it enters view, replaying only when a stage is picked or hovered. When nothing is animating, no
   requestAnimationFrame loop may keep running, and reduced motion draws the final still frame straight away. */
const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };
const script = (name: string) => publicContent(`/shopify-va/assets/${name}.js`, config)!.body as string;

test('hero waves settle once in about 3 seconds and stop scheduling frames; reduced motion starts settled', () => {
  const hero = script('hero');
  assert.match(hero, /var SETTLE = 3000,/);
  assert.match(hero, /if \(clock >= SETTLE\) \{ running = false; canvas\.classList\.add\('is-settled'\); return; \}\s*requestAnimationFrame\(frame\);/);
  assert.match(hero, /var should = !reduce && clock < SETTLE && visible && !document\.hidden/);
  assert.match(hero, /if \(reduce\) \{ clock = SETTLE;/);
  assert.doesNotMatch(hero, /performance\.now\(\)|setInterval/, 'no wall-clock loop that keeps time running');
});

test('the sequence strip plays one pass (no auto-cycling), rests on all gates checked, and replays only on a picked or hovered stage', () => {
  const seq = script('sequence');
  assert.doesNotMatch(seq, /PERIOD|% PERIOD|FADE|HOLD|setInterval/, 'no looping timeline');
  assert.match(seq, /function runLength\(k\) \{ return \(k \+ 1\) \* \(MOVE \+ DWELL\); \}/);
  assert.match(seq, /var MOVE = 420, DWELL = 280,/, 'one full pass is 7 x 700 ms = 4.9 s');
  assert.match(seq, /if \(clock >= runLength\(target\)\) \{ running = false; strip\.classList\.add\('is-settled'\); return; \}/);
  assert.match(seq, /if \(visible && !played\) play\(N - 1\)/, 'the pass starts when the strip first enters view');
  assert.match(seq, /if \(i >= 0\) play\(i\); else if \(played\) rest\(\);/, 'hover or focus replays to that stage; leaving rests without motion');
  assert.match(seq, /if \(reduce\) \{ played = true; clock = runLength\(N - 1\);/);
  assert.match(seq, /if \(s\.speed > 0\) \{ parcel/, 'the trail shows only while the order moves, so the rest frame is not a frozen streak');
});

test('gradients: at most one per page, and in fact none (no CSS gradient, no canvas gradient, no canvas fade-out)', () => {
  const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
  assert.doesNotMatch(css, /gradient\(/);
  for (const name of ['hero', 'sequence']) assert.doesNotMatch(script(name), /create(?:Linear|Radial|Conic)Gradient|FADE/, name);
  for (const path of ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy']) assert.doesNotMatch(publicContent(path, config)!.body as string, /gradient\(/, path);
});

type Page = {
  goto(u: string): Promise<unknown>;
  evaluate<T>(f: string): Promise<T>;
  waitForTimeout(n: number): Promise<void>;
  hover(selector: string): Promise<void>;
  mouse: { move(x: number, y: number): Promise<void> };
};
type Context = { newPage(): Promise<Page>; close(): Promise<void>; addInitScript(s: { content: string }): Promise<void> };
type Browser = { newContext(o: object): Promise<Context>; close(): Promise<void> };
const chrome = process.env.CHROME_PATH ?? ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
let playwright: { chromium: { launch(o: object): Promise<Browser> } } | undefined;
try {
  // A path in PLAYWRIGHT_CORE loads the CommonJS build, whose exports sit on .default.
  const mod = await import((process.env.PLAYWRIGHT_CORE ?? 'playwright-core') as string);
  playwright = mod.chromium ? mod : mod.default;
} catch { /* optional */ }

/* Counts every requestAnimationFrame call the page makes, before any page script runs. */
const COUNT_RAF = `(() => { const raf = window.requestAnimationFrame.bind(window); window.__raf = 0;
  window.requestAnimationFrame = (cb) => { window.__raf++; return raf(cb); }; })();`;
const RAF = 'window.__raf';
const HERO_PIXELS = 'document.querySelector("[data-hero-canvas]").toDataURL()';
const SEQ_PIXELS = 'document.querySelector("[data-seq-canvas]").toDataURL()';
const PASSED = 'Array.from(document.querySelectorAll("[data-seq-label]")).map(a => a.classList.contains("is-passed") ? 1 : 0).join("")';
const SETTLED = (selector: string) => `document.querySelector('${selector}').classList.contains('is-settled')`;

test('rendered motion: after each settle no animation loop keeps running and the frame stays still; reduced motion never animates', { skip: !(playwright && chrome) && 'needs playwright-core and a Chrome binary (set CHROME_PATH)' }, async () => {
  const server = createServer((req, res) => {
    const content = publicContent((req.url ?? '/').split('?')[0], config);
    if (!content) { res.writeHead(404).end(); return; }
    // The real CSP, so the test proves the canvases run under it.
    res.writeHead(200, { ...SECURITY_HEADERS, 'content-type': content.contentType }).end(content.body);
  });
  await new Promise<void>(resolve => server.listen(0, resolve));
  const url = `http://127.0.0.1:${(server.address() as { port: number }).port}/shopify-va`;
  const browser = await playwright!.chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
  /* Still: no requestAnimationFrame call and no pixel change over a further second. */
  const assertStill = async (page: Page, pixels: string, what: string) => {
    const [count, before] = [await page.evaluate<number>(RAF), await page.evaluate<string>(pixels)];
    await page.waitForTimeout(1000);
    assert.equal(await page.evaluate<number>(RAF), count, `${what}: a requestAnimationFrame loop is still running`);
    assert.equal(await page.evaluate<string>(pixels), before, `${what}: the frame changed after it settled`);
  };
  try {
    for (const [width, height] of [[1440, 900], [390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
      await context.addInitScript({ content: COUNT_RAF });
      const page = await context.newPage();
      await page.goto(url);
      await page.waitForTimeout(400);
      assert.ok(await page.evaluate<number>(RAF) > 0, `${width}: the hero settle plays`);
      assert.equal(await page.evaluate<boolean>(SETTLED('[data-hero-canvas]')), false, `${width}: still settling at 0.4 s`);
      await page.waitForTimeout(3100);
      assert.equal(await page.evaluate<boolean>(SETTLED('[data-hero-canvas]')), true, `${width}: hero settled by 3.5 s`);
      await assertStill(page, HERO_PIXELS, `${width} hero`);

      // The strip has not played offscreen; it plays once when it enters view.
      assert.equal(await page.evaluate<string>(PASSED), '0000000', `${width}: no pass before the strip is seen`);
      await page.evaluate('document.querySelector("[data-seq-strip]").scrollIntoView({ block: "center" })');
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate<boolean>(SETTLED('[data-seq-strip]')), false, `${width}: the pass is playing`);
      await page.waitForTimeout(5000);
      assert.equal(await page.evaluate<boolean>(SETTLED('[data-seq-strip]')), true, `${width}: the pass ended by 5.5 s`);
      assert.equal(await page.evaluate<string>(PASSED), '1111111', `${width}: rests with every gate checked`);
      await assertStill(page, SEQ_PIXELS, `${width} sequence`);

      // Hovering a stage replays the run to that stage, then rests; leaving redraws the end frame without a loop.
      await page.hover('.sequence-list .seq-item:nth-child(3)');
      await page.waitForTimeout(200);
      assert.equal(await page.evaluate<boolean>(SETTLED('[data-seq-strip]')), false, `${width}: hover replays`);
      await page.waitForTimeout(2400);
      assert.equal(await page.evaluate<boolean>(SETTLED('[data-seq-strip]')), true, `${width}: the replay rests at stage 3`);
      assert.equal(await page.evaluate<string>(PASSED), '1110000', `${width}: replay stops at the hovered stage`);
      await assertStill(page, SEQ_PIXELS, `${width} sequence after hover`);
      const count = await page.evaluate<number>(RAF);
      await page.mouse.move(1, 1);
      await page.waitForTimeout(300);
      assert.equal(await page.evaluate<string>(PASSED), '1111111', `${width}: leaving restores the end frame`);
      assert.equal(await page.evaluate<number>(RAF), count, `${width}: leaving draws without animating`);
      await assertStill(page, SEQ_PIXELS, `${width} sequence after leave`);
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await context.addInitScript({ content: COUNT_RAF });
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate<boolean>(SETTLED('[data-hero-canvas]')), true, 'reduced motion: hero starts on its final frame');
    await page.evaluate('document.querySelector("[data-seq-strip]").scrollIntoView({ block: "center" })');
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate<boolean>(SETTLED('[data-seq-strip]')), true, 'reduced motion: strip starts on its final frame');
    assert.equal(await page.evaluate<string>(PASSED), '1111111');
    await page.hover('.sequence-list .seq-item:nth-child(5)');
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate<string>(PASSED), '1111100', 'reduced motion: hover shows the stage end frame at once');
    assert.equal(await page.evaluate<number>(RAF), 0, 'reduced motion: no requestAnimationFrame call at all');
    await context.close();
  } finally {
    await browser.close();
    server.close();
  }
});
