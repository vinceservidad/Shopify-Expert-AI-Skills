import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { publicContent } from '../src/public-routes.js';

const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };
const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
const media = (query: string) => {
  const start = css.indexOf(`@media(${query}){`);
  assert.ok(start >= 0, `missing @media(${query})`);
  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}' && --depth === 0) return css.slice(start, i + 1);
  }
  throw new Error('unterminated media block');
};

test('pages opt in to the full screen so safe-area insets work, and phones cannot inflate text in landscape', () => {
  for (const path of ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy']) {
    assert.match(publicContent(path, config)!.body as string, /<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">/, path);
  }
  assert.match(css, /html\{-webkit-text-size-adjust:100%;text-size-adjust:100%\}/);
});

test('content stays clear of notches: the shell gutter honours the left and right safe-area insets at every width', () => {
  assert.match(css, /\.shell\{--gutter:max\(24px,env\(safe-area-inset-left,0px\),env\(safe-area-inset-right,0px\)\);width:min\(1120px,calc\(100% - 2\*var\(--gutter\)\)\)/);
  assert.match(media('max-width:720px'), /--gutter:max\(16px,env\(safe-area-inset-left,0px\),env\(safe-area-inset-right,0px\)\)/);
  assert.match(media('max-width:360px'), /--gutter:max\(12px,env\(safe-area-inset-left/);
  assert.match(css, /safe-area-inset-bottom/);
});

test('the header keeps one row until 680px (16px links need 624px), then wraps; narrow phones stack the site links', () => {
  assert.doesNotMatch(media('max-width:720px'), /family-tabs\{order:3/);
  assert.match(media('max-width:680px'), /\.family-header\{flex-wrap:wrap;/);
  assert.match(media('max-width:680px'), /\.family-tabs\{order:3;width:100%/);
  assert.match(media('max-width:420px'), /\.family-nav\{order:2;width:100%/);
});

test('mobile audit fixes: copy buttons reserve the Copied width, the search field keeps its placeholder on 320px phones, jump links and gate links are 44px tall, breadcrumbs align', () => {
  assert.match(css, /\.cmd-row \.copy-btn,\.cmd-item \.copy-btn\{min-width:88px\}/);
  assert.match(media('max-width:360px'), /\.skill-filter\{flex-wrap:wrap;[^}]*\}\s*\.skill-filter input\{flex:1 1 100%\}/);
  assert.match(media('max-width:720px'), /\.doc-jump a,\.seq-gates a\{min-height:44px;line-height:44px\}/);
  assert.match(css, /\.crumbs li\{display:inline-flex;align-items:center;min-height:32px\}/);
});

test('setup-page command boxes wrap long commands inside the box and stack the copy button on phones', () => {
  assert.match(css, /\.cmd-code\{[^}]*overflow-wrap:anywhere;min-width:0\}/);
  assert.match(css, /\.command,\.request\{[^}]*white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%\}/);
  assert.match(css, /code\{overflow-wrap:anywhere/);
  assert.match(media('max-width:560px'), /\.cmd-row\{flex-direction:column;align-items:stretch/);
});

test('the problems table becomes stacked rows on small phones and the stage list uses the full width', () => {
  const small = media('max-width:400px');
  assert.match(small, /\.bottleneck-table tr\{display:block/);
  assert.match(small, /\.bottleneck-table td\.bn-action\{text-align:left/);
  assert.match(small, /\.seq-skills,\.seq-gate\{grid-column:1 \/ -1\}/);
});

test('short landscape screens trim vertical padding and large screens scale the layout up', () => {
  assert.match(media('max-height:520px) and (orientation:landscape'), /\.hero\.stage\{padding:96px 0 var\(--gap-end\)\}/);
  assert.match(media('min-width:1600px'), /\.shell\{width:min\(1320px,/);
  assert.doesNotMatch(media('min-width:1600px'), /\.hero-h1/, 'the headline stays at 52-64px on large screens');
  assert.match(media('min-width:2200px'), /\.shell\{width:min\(1560px,/);
});

test('canvases redraw on resize, rotation and pixel-ratio changes and render crisply up to 3x', () => {
  for (const name of ['hero', 'sequence']) {
    const js = publicContent(`/shopify-va/assets/${name}.js`, config)!.body as string;
    assert.match(js, /new ResizeObserver\(resize\)/, name);
    assert.match(js, /addEventListener\('orientationchange', resize\)/, name);
    assert.match(js, /\(resolution: /, name);
    assert.match(js, /devicePixelRatio \|\| 1, 3\)/, name);
  }
});

type Browser = { newContext(o: object): Promise<{ newPage(): Promise<Page>; close(): Promise<void> }>; close(): Promise<void> };
type Page = { goto(u: string): Promise<unknown>; evaluate<T>(f: () => T): Promise<T>; waitForTimeout(n: number): Promise<void> };
const chrome = process.env.CHROME_PATH ?? ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
let playwright: { chromium: { launch(o: object): Promise<Browser> } } | undefined;
try {
  // A path in PLAYWRIGHT_CORE loads the CommonJS build, whose exports sit on .default.
  const mod = await import((process.env.PLAYWRIGHT_CORE ?? 'playwright-core') as string);
  playwright = mod.chromium ? mod : mod.default;
} catch { /* optional */ }

test('rendered layout: no page scrolls sideways or has an element wider than the viewport on any device size', { skip: !(playwright && chrome) && 'needs playwright-core and a Chrome binary (set CHROME_PATH)' }, async () => {
  const server = createServer((req, res) => {
    const content = publicContent((req.url ?? '/').split('?')[0], config);
    if (!content) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': content.contentType }).end(content.body);
  });
  await new Promise<void>(resolve => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;
  const browser = await playwright!.chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
  const sizes: Array<[number, number, number]> = [[320, 568, 2], [360, 800, 3], [390, 844, 3], [667, 375, 2], [844, 390, 3], [768, 1024, 2], [1024, 768, 2], [1440, 900, 1], [2560, 1440, 1], [640, 400, 2]];
  const problems: string[] = [];
  try {
    for (const [width, height, deviceScaleFactor] of sizes) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor });
      for (const path of ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy']) {
        const page = await context.newPage();
        await page.goto(`http://127.0.0.1:${port}${path}`);
        await page.waitForTimeout(150);
        const found = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth, out: string[] = [];
          if (document.documentElement.scrollWidth > vw) out.push(`page scrolls sideways (${document.documentElement.scrollWidth} > ${vw})`);
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height || el.closest('.sr-only,.wb-radio,.ex-radio,thead,canvas')) continue;
            let scroller = false;
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (/auto|scroll|hidden|clip/.test(getComputedStyle(p).overflowX)) scroller = true;
            if (!scroller && (r.right > vw + 0.5 || r.left < -0.5)) out.push(`${el.tagName.toLowerCase()}.${el.className} spans ${Math.round(r.left)}..${Math.round(r.right)}`);
          }
          return out;
        });
        for (const f of found.slice(0, 3)) problems.push(`${path} @${width}x${height}: ${f}`);
        await page.evaluate(() => 0);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  assert.deepEqual(problems, []);
});

test('desktop audit fixes: one lit stage row, readable search clear, aligned Copied label, readable doc column, roomy install commands', () => {
  assert.match(css, /\.sequence-list:has\(\.is-lit\) \.seq-item:target:not\(\.is-lit\)\{background:transparent\}/);
  assert.ok(!/search-cancel-button\{[^}]*invert/.test(css), 'the clear button keeps its light dark-scheme colour');
  assert.match(css, /\.copy-btn-text\{[^}]*text-align:inherit/);
  assert.match(css, /\.page-body\.shell\{width:min\(880px,calc\(100% - 2\*var\(--gutter\)\)\)\}/);
  assert.match(css, /\.cmd-item\{display:grid;grid-template-columns:minmax\(150px,190px\) 1fr auto/);
});

test('rendered hero: a left-aligned split at 1280px and one stacked, left-aligned column at 390px', { skip: !(playwright && chrome) && 'needs playwright-core and a Chrome binary (set CHROME_PATH)' }, async () => {
  const server = createServer((req, res) => {
    const content = publicContent((req.url ?? '/').split('?')[0], config);
    if (!content) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': content.contentType }).end(content.body);
  });
  await new Promise<void>(resolve => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;
  const browser = await playwright!.chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
  try {
    const measure = async (width: number, height: number) => {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}/shopify-va`);
      await page.waitForTimeout(150);
      // No named inner functions: the test transform would wrap them in a helper the page does not have.
      const box = await page.evaluate(() => {
        const [main, aside, shell] = ['.hero-main', '.hero-aside', '.hero-grid'].map(s => document.querySelector(s)!.getBoundingClientRect().toJSON() as { left: number; right: number; top: number; bottom: number; width: number });
        const h1 = getComputedStyle(document.querySelector('.hero-h1')!);
        return { main, aside, shell, align: h1.textAlign, h1Size: parseFloat(h1.fontSize), h1Font: h1.fontFamily };
      });
      await context.close();
      return box;
    };
    const wide = await measure(1280, 800);
    assert.equal(wide.align, 'left');
    assert.ok(Math.abs(wide.main.left - wide.shell.left) < 1, 'the copy column starts at the content edge');
    assert.ok(wide.aside.left > wide.main.right, 'the example sits to the right of the copy');
    assert.ok(Math.abs(wide.aside.top - wide.main.top) < 1, 'both columns start at the same height');
    const share = wide.main.width / (wide.main.width + wide.aside.width);
    assert.ok(share > 0.55 && share < 0.62, `left column is about 7/12 of the content (got ${share.toFixed(3)})`);
    assert.ok(wide.h1Size >= 52 && wide.h1Size <= 64, `h1 is 52-64px at 1280 (got ${wide.h1Size})`);
    assert.match(wide.h1Font, /^"?Schibsted Grotesk"?,/);
    const phone = await measure(390, 844);
    assert.equal(phone.align, 'left');
    assert.ok(phone.aside.top >= phone.main.bottom, 'the example stacks under the copy');
    assert.ok(Math.abs(phone.aside.left - phone.main.left) < 1 && Math.abs(phone.main.left - phone.shell.left) < 1, 'one left-aligned column');
    assert.ok(Math.abs(phone.main.width - phone.shell.width) < 1, 'the copy uses the full column width');
  } finally {
    await browser.close();
    server.close();
  }
});

test('rendered headline: every page h1 stays at 4 lines or fewer at every width from 320px up (anti-slop v2)', { skip: !(playwright && chrome) && 'needs playwright-core and a Chrome binary (set CHROME_PATH)' }, async () => {
  const server = createServer((req, res) => {
    const content = publicContent((req.url ?? '/').split('?')[0], config);
    if (!content) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': content.contentType }).end(content.body);
  });
  await new Promise<void>(resolve => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;
  const browser = await playwright!.chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
  const lines: string[] = [], tooMany: string[] = [];
  try {
    for (const width of [320, 340, 360, 375, 390, 414, 480, 600, 768, 900, 1023, 1024, 1180, 1280, 1440, 1920, 2560]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      for (const path of ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy']) {
        const page = await context.newPage();
        await page.goto(`http://127.0.0.1:${port}${path}`);
        await page.evaluate(() => document.fonts.ready.then(() => 0));
        // Count the distinct line boxes of the headline text (no named inner functions: see the hero test).
        const count = await page.evaluate(() => {
          const range = document.createRange();
          range.selectNodeContents(document.querySelector('h1')!);
          return new Set(Array.from(range.getClientRects()).filter(r => r.width > 1).map(r => Math.round(r.top))).size;
        });
        lines.push(`${path}@${width}:${count}`);
        if (count > 4 || count < 1) tooMany.push(`${path} @${width}px wraps to ${count} lines`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  assert.deepEqual(tooMany, [], lines.join(' '));
});
