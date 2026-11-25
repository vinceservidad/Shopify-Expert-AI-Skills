import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publicContent } from '../src/public-routes.js';

const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };

test('the hero animation is served from the guide origin as JavaScript', () => {
  for (const path of ['/shopify-va/assets/hero.js', '/assets/hero.js']) {
    const content = publicContent(path, config);
    assert.ok(content && typeof content.body === 'string', path);
    assert.equal(content.contentType, 'text/javascript; charset=utf-8');
    assert.match(content.body, /data-hero-canvas/);
    assert.match(content.body, /prefers-reduced-motion/);
  }
});

test('the product page loads the hero script by URL and marks the canvas decorative', () => {
  const html = publicContent('/shopify-va', config)!.body as string;
  assert.match(html, /<script src="\/shopify-va\/assets\/hero\.js" defer><\/script>/);
  assert.match(html, /<canvas class="hero-canvas" data-hero-canvas aria-hidden="true"><\/canvas>/);
});

test('public pages stay inside the CSP: no executable inline scripts, handlers, or style attributes', () => {
  for (const path of ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy']) {
    const html = publicContent(path, config)!.body as string;
    for (const tag of html.match(/<script\b[^>]*>/g) ?? []) {
      if (/type="application\/ld\+json"/.test(tag)) continue;
      assert.match(tag, /\ssrc="/, `${path}: executable inline script ${tag}`);
    }
    assert.doesNotMatch(html, /\sstyle="/, `${path}: inline style attribute`);
    assert.doesNotMatch(html, /\son[a-z]+="/, `${path}: inline event handler`);
    assert.doesNotMatch(html, /<style\b/, `${path}: inline style element`);
  }
});
