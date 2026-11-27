import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { publicContent } from '../src/public-routes.js';
import { THEME_SCRIPT } from '../src/public-ui/theme.js';

const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };
const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
const html = publicContent('/shopify-va', config)!.body as string;
const rule = (selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`(?:^|\\n|\\})${escaped}\\{([^}]*)\\}`));
  assert.ok(match, `missing rule ${selector}`);
  return match[1];
};

test('skill cards are raised surfaces: fill, ring plus top highlight, 8px radius, no hairline index', () => {
  const card = rule('.skill-entry');
  assert.match(card, /background:var\(--raised\)/);
  assert.match(card, /box-shadow:inset 0 1px 0 var\(--hl\),0 0 0 1px var\(--border\)/);
  assert.match(card, /border-radius:var\(--radius-box\)/);
  assert.match(card, /position:relative/);
  const grid = rule('.skill-index');
  assert.match(grid, /gap:16px/);
  assert.doesNotMatch(grid, /border-top/);
});

test('skill cards respond to hover and keyboard focus: mint ring, 2px lift, soft mint glow', () => {
  const hot = rule('.skill-entry:hover,.skill-entry:focus-within');
  assert.match(hot, /0 0 0 1px var\(--border-hover\)/);
  assert.match(hot, /transform:translateY\(-2px\)/);
  assert.match(hot, /rgba\(108,201,160,/);
  assert.match(rule('.skill-entry'), /transition:[^;]*box-shadow[^;]*transform/);
});

test('each skill card has one group-coloured top bar and no pill, kicker or nested card', () => {
  assert.match(rule('.skill-entry'), /--cat:var\(--accent\)/);
  assert.match(rule('.skill-entry'), /inset 0 2px 0 var\(--cat\)/);
  for (const cat of ['Orders & Support', 'Growth & Ads', 'Store & Theme']) assert.match(rule(`.skill-entry[data-cat="${cat}"]`), /--cat:#[0-9a-f]{6}/);
  const cards = [...html.matchAll(/<article class="skill-entry"[\s\S]*?<\/article>/g)].map(m => m[0]);
  assert.equal(cards.length, 19);
  for (const card of cards) {
    assert.doesNotMatch(card, /class="[^"]*(badge|pill|kicker|eyebrow|cmd-row|request|ex-col|seq-item)/, 'no pill, kicker or card-in-card');
  }
  assert.doesNotMatch(css, /backdrop-filter|text-fill-color|linear-gradient/, 'no glassmorphism or gradient fills');
  assert.match(rule('.section-head'), /text-align:center/, 'section headings stay centred');
});

test('the whole skill card opens its GitHub page while Copy prompt keeps working', () => {
  assert.match(rule(".skill-gh::after"), /content:'';position:absolute;inset:0/);
  assert.match(rule('.skill-entry .copy-btn'), /position:relative;z-index:1/);
  assert.match(html, /<a class="skill-gh" href="[^"]+\/skills\/shopify-product-listing\/SKILL\.md"><span>Read<span class="sr-only"> Product Listings<\/span> on GitHub<\/span><\/a>/);
});

test('example columns, sequence rows and problem rows are live raised cards too', () => {
  assert.match(rule('.ex-col'), /background:var\(--raised\);box-shadow:var\(--card\)/);
  assert.match(rule('.ex-col:hover'), /box-shadow:var\(--card-hot\);transform:translateY\(-2px\)/);
  assert.match(rule('.seq-item'), /background:var\(--raised\);box-shadow:var\(--card\)/);
  assert.match(rule('.seq-item.is-lit,.seq-item:target,.seq-item:hover'), /var\(--card-hot\);transform:translateY\(-2px\)/);
  assert.match(rule('.bottleneck-table'), /border-collapse:separate;border-spacing:0 8px/);
  assert.match(rule('.bottleneck-table td'), /background:var\(--raised\)/);
  assert.match(rule('.bottleneck-table tbody tr:hover,.bottleneck-table tbody tr:focus-within'), /--ring:var\(--border-hover\);--bar:var\(--accent\);transform:translateY\(-2px\)/);
  for (const marker of ['<div class="skill-index" data-stagger>', '<ol class="sequence-list" data-stagger>', '<tbody data-stagger>', '<div class="ex-grid" data-stagger>']) assert.ok(html.includes(marker), marker);
});

test('reduced motion drops the lift and shows staggered cards at once', () => {
  const reduced = css.slice(css.indexOf('@media(prefers-reduced-motion:reduce)'));
  assert.match(reduced, /\.will-rise\{opacity:1;translate:none\}/);
  assert.match(reduced, /\.skill-entry:hover,\.skill-entry:focus-within,[^{]*\{transform:none\}/);
  assert.match(rule('.will-rise'), /opacity:0;translate:0 16px/);
});

/* Drive the served script with a tiny DOM and a controllable IntersectionObserver. */
function bootStagger(reduced: boolean) {
  const mk = () => ({ classes: new Set<string>(), style: { transitionDelay: '' } as Record<string, string>, classList: null as unknown as { add(c: string): void } });
  const cards = Array.from({ length: 9 }, () => { const c = mk(); c.classList = { add: (n: string) => c.classes.add(n) }; return c; });
  const group = { children: cards };
  const observers: Array<{ cb: (entries: unknown[]) => void; seen: unknown[] }> = [];
  const timers: Array<() => void> = [];
  class IO { seen: unknown[] = []; constructor(public cb: (entries: unknown[]) => void) { observers.push(this); } observe(el: unknown) { this.seen.push(el); } unobserve() {} }
  const document = {
    readyState: 'complete',
    querySelectorAll: (sel: string) => (sel === '[data-stagger]' ? [group] : []),
    querySelector: () => null,
    addEventListener() {},
  };
  const window = { IntersectionObserver: IO };
  runInNewContext(THEME_SCRIPT, { document, window, IntersectionObserver: IO, matchMedia: () => ({ matches: reduced }), setTimeout: (fn: () => void) => timers.push(fn), Array, Math });
  return { cards, observers, timers };
}

test('cards fade up in a capped stagger as they scroll in, then drop the delay', () => {
  const { cards, observers, timers } = bootStagger(false);
  assert.equal(observers.length, 1);
  assert.ok(cards.every(c => c.classes.has('will-rise')));
  observers[0].cb(cards.map(target => ({ target, isIntersecting: true })));
  assert.ok(cards.every(c => c.classes.has('is-in')));
  assert.deepEqual(cards.map(c => c.style.transitionDelay), ['0ms', '70ms', '140ms', '210ms', '280ms', '350ms', '420ms', '420ms', '420ms']);
  timers.forEach(fn => fn());
  assert.ok(cards.every(c => c.style.transitionDelay === ''), 'hover is never delayed after the reveal');
});

test('under reduced motion no card is hidden or animated', () => {
  const { cards, observers } = bootStagger(true);
  assert.equal(observers.length, 0);
  assert.ok(cards.every(c => !c.classes.has('will-rise')));
});
