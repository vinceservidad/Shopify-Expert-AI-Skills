import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PUBLIC_PAGE_CSP, publicContent } from '../src/public-routes.js';

const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };
const page = () => publicContent('/shopify-va', config)!.body as string;
const script = () => publicContent('/shopify-va/assets/sequence.js', config)!.body as string;

test('the sequence section holds the strip, whose canvas is decorative and whose gates are links, above the ordered list', () => {
  const section = page().match(/<section id="sequence"[\s\S]*?<\/section>/)![0];
  const strip = section.match(/<div class="seq-strip" data-seq-strip>[\s\S]*?<\/nav><\/div>/)![0];
  assert.match(strip, /<canvas class="seq-canvas" data-seq-canvas aria-hidden="true"><\/canvas>/);
  assert.deepEqual([...strip.matchAll(/data-seq-label aria-label="[^"]+">(\d\d)<\/a>/g)].map(m => m[1]), ['01', '02', '03', '04', '05', '06', '07']);
  assert.ok(section.indexOf('seq-strip') < section.indexOf('class="sequence-list"'), 'strip sits above the list');
  assert.equal([...section.matchAll(/class="seq-item" id="seq-\d"/g)].length, 7, 'the list stays the content');
});

test('the strip script is served from the guide origin and loaded by URL under the same CSP mechanism', () => {
  for (const path of ['/shopify-va/assets/sequence.js', '/assets/sequence.js']) {
    const content = publicContent(path, config);
    assert.ok(content && typeof content.body === 'string', path);
    assert.equal(content.contentType, 'text/javascript; charset=utf-8');
  }
  assert.match(page(), /<script src="\/shopify-va\/assets\/sequence\.js" defer><\/script>/);
  for (const tag of page().match(/<script\b[^>]*>/g) ?? []) {
    if (/type="application\/ld\+json"/.test(tag)) continue;
    assert.match(tag, /\ssrc="/, `executable inline script ${tag}`);
  }
});

test('the strip script honors reduced motion, pauses offscreen and hidden, caps pixel ratio and frame rate', () => {
  const body = script();
  assert.match(body, /prefers-reduced-motion: reduce/);
  assert.match(body, /var should = !reduce && visible && !document\.hidden/);
  assert.match(body, /IntersectionObserver/);
  assert.match(body, /visibilitychange/);
  assert.match(body, /Math\.min\(window\.devicePixelRatio \|\| 1, 3\)/);
  assert.match(body, /now - lastDraw < 33/);
  assert.match(body, /focusin/);
  assert.match(body, /mouseenter/);
  assert.doesNotMatch(body, /webgl|OffscreenCanvas|createLinearGradient|shadowBlur/i);
});

test('the strip adds no CSP allowance and is hidden until the script marks it live', () => {
  assert.doesNotMatch(PUBLIC_PAGE_CSP, /unsafe-inline|unsafe-eval|blob:|nonce-|sha256-/);
  assert.match(PUBLIC_PAGE_CSP, /script-src 'self' https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js\/;/);
  const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
  assert.match(css, /\.seq-strip\{display:none;/);
  assert.match(css, /\.seq-strip\.is-live\{display:block\}/);
  assert.doesNotMatch(css.match(/\.seq-(strip|canvas|gates)[^{]*\{[^}]*\}/g)!.join(''), /gradient|box-shadow|border-radius|border:/);
});
