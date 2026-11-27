import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { publicContent } from '../src/public-routes.js';
import { THEME_SCRIPT } from '../src/public-ui/theme.js';
import { SKILL_DOCS } from '../src/public-ui/skill-docs.js';

/* Anti-slop rules (owner spec, 2026-11-27): no cards, no glow, no gradients, no lift or reveal, no uppercase,
   no one-sided coloured borders, no arrows in link text, no banned marketing words.
   v2 additions (owner, 2026-11-27): no em dashes, and Leverage and game-changer join the banned words. */
const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };
const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
const html = publicContent('/shopify-va', config)!.body as string;
const PAGES = ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy'];
const page = (path: string) => publicContent(path, config)!.body as string;
const rule = (selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`(?:^|\\n|\\})${escaped}\\{([^}]*)\\}`));
  assert.ok(match, `missing rule ${selector}`);
  return match[1];
};
const visibleText = (markup: string) => markup
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

test('no glow: the only box-shadow in the stylesheet is the open install drawer, and it is not coloured', () => {
  const shadows = [...css.matchAll(/([^{}]+)\{[^}]*box-shadow:([^;}]+)/g)].map(m => [m[1].trim(), m[2].trim()]);
  assert.deepEqual(shadows.map(([selector]) => selector), ['.setup-drawer[open]']);
  assert.match(shadows[0][1], /^0 12px 32px rgba\(0,0,0,\.35\)$/, 'a neutral overlay shadow, no accent tint');
  assert.doesNotMatch(css, /text-shadow|drop-shadow|--accent-glow|--card-hot|shadowBlur/);
  for (const name of ['hero', 'sequence']) assert.doesNotMatch(page(`/shopify-va/assets/${name}.js`), /shadowBlur|shadowColor|filter\s*=/, name);
});

test('no gradients, glassmorphism or decorative washes in the stylesheet', () => {
  assert.doesNotMatch(css, /gradient\(/);
  assert.doesNotMatch(css, /backdrop-filter|text-fill-color|background-clip:text/);
  assert.match(rule('.hero.stage'), /background:var\(--ground\)/);
});

test('no uppercase labels, eyebrow kickers, pills or hard-coded all-caps labels', () => {
  assert.doesNotMatch(css, /text-transform\s*:\s*uppercase|font-variant(?:-caps)?\s*:\s*(?:all-)?small-caps/);
  assert.doesNotMatch(css, /border-radius\s*:\s*(?:999|50%|9999)/);
  for (const path of PAGES) {
    const markup = page(path);
    assert.doesNotMatch(markup, /class="[^"]*\b(?:eyebrow|kicker|badge|pill|chip|tag-label)\b/, path);
    // Acronyms (FAQ, CSV, MIT, BFCM, SKU...) are content; a label is a run of two or more all-caps words.
    assert.doesNotMatch(visibleText(markup), /\b[A-Z]{3,}(?: [A-Z]{3,})+\b/, `${path}: all-caps label`);
  }
});

test('no cards: skill entries, stage rows, problem rows and examples are ruled rows with radius 0 and no fill', () => {
  for (const selector of ['.skill-entry', '.seq-item', '.bottleneck-table td', '.app-cell', '.ex-points li']) {
    const body = rule(selector);
    assert.doesNotMatch(body, /border-radius|box-shadow|background:var\(--surface\)/, selector);
  }
  for (const selector of ['.skill-entry', '.seq-item', '.ex-points li', '.app-cell']) assert.match(rule(selector), /border-bottom:1px solid var\(--line\)/, selector);
  assert.match(rule('.bottleneck-table tbody tr'), /border-bottom:1px solid var\(--line\)/);
  assert.doesNotMatch(html, /class="[^"]*\b(?:ex-col|ex-grid|card)\b/);
  // No nested boxes: a skill row holds text and two actions, never a well or another row.
  const entries = [...html.matchAll(/<article class="skill-entry"[\s\S]*?<\/article>/g)].map(m => m[0]);
  assert.equal(entries.length, 19);
  for (const entry of entries) assert.doesNotMatch(entry, /class="[^"]*(cmd-row|request|ex-input|seq-item|wb-row)/);
});

test('no coloured edge on one side of a row, card or callout', () => {
  assert.doesNotMatch(css, /inset -?\d+px 0 0 var\(--(?:accent|signal|bar|cat)\)/);
  assert.doesNotMatch(css, /inset 0 2px 0 var\(--cat\)|--bar:|--cat:/);
  for (const m of css.matchAll(/border-(?:left|right|top)(?:-color)?:[^;}]*var\(--(accent|signal)\)/g)) assert.fail(`one-sided accent border: ${m[0]}`);
});

test('no motion besides the two canvases: no reveal, stagger, lift, keyframes or press transforms', () => {
  assert.doesNotMatch(css, /@keyframes|animation:|will-reveal|will-rise|translateY|translate:/);
  assert.doesNotMatch(html, /data-reveal|data-stagger/);
  assert.doesNotMatch(THEME_SCRIPT, /IntersectionObserver|will-rise|will-reveal|transitionDelay/);
  for (const m of css.matchAll(/transition:([^;}]+)/g)) {
    for (const part of m[1].split(/,(?![^(]*\))/)) assert.match(part.trim(), /^(?:none|color|background-color|border-color)\b/, `transition on ${part}`);
  }
});

test('hover is a plain background or border change and only on interactive rows', () => {
  for (const selector of ['.skill-entry:hover,.skill-entry:focus-within', '.bottleneck-table tbody tr:hover,.bottleneck-table tbody tr:focus-within']) {
    assert.equal(rule(selector), 'background:var(--surface)', selector);
  }
  assert.match(rule('.seq-item.is-lit,.seq-item:target,.seq-item:hover'), /^background:var\(--surface\)$/);
  for (const selector of ['.app-cell:hover', '.wb-row:hover', '.cmd-row:hover', '.ex-col:hover', '.ex-points li:hover']) assert.ok(!css.includes(`${selector}{`), `${selector} is not interactive`);
  assert.match(css, /a:focus-visible,button:focus-visible,input:focus-visible,label:focus-visible,summary:focus-visible,pre:focus-visible\{outline:2px solid var\(--accent\)/, 'focus rings stay visible');
});

test('no arrow glyphs added to link or button text (UI paths such as Settings → Connectors stay in sentences)', () => {
  for (const path of PAGES) {
    const markup = page(path);
    for (const m of markup.matchAll(/<(a|button|summary|label)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
      assert.doesNotMatch(m[2].replace(/<[^>]+>/g, ''), /[→↗↓↘›»⟶➜➔]|&rarr;|&raquo;/, `${path}: arrow in ${m[0].slice(0, 80)}`);
    }
  }
  assert.doesNotMatch(css, /content:\s*['"][^'"]*[→↗↓›»⟶➜➔][^'"]*['"]/, 'no arrow pseudo-elements');
});

/* Owner list, v1 plus v2 (Leverage in any form, game-changer). Case-insensitive, any word form. */
const BANNED = /\b(?:elevat|unlock|seamless|supercharg|transform|empower|unleash|leverag)\w*|\bgame[\s-]?changer/i;
/* Guide text routes with the skill library's own text taken out: SKILL.md bodies and front-matter descriptions are
   the skills' content, not guide copy (two skills use "transformation" for data mapping; reported, not rewritten). */
const TEXT_ROUTES = ['/shopify-va/llms.txt', '/shopify-va/llms-full.txt', '/llms.txt', '/llms-full.txt'];
const guideText = (path: string) => {
  let text = page(path);
  for (const doc of SKILL_DOCS) {
    // llms-full.txt: drop each skill's "When to use: <description>" and its (heading-demoted) body, up to the next "## " section.
    const start = text.indexOf(`When to use: ${doc.description}`);
    if (start >= 0) { const end = text.indexOf('\n## ', start); text = text.slice(0, start) + (end >= 0 ? text.slice(end) : ''); }
    text = text.split(doc.description).join(' ');
  }
  return text;
};

test('banned marketing words, including v2 Leverage and game-changer, are absent from copy, meta, JSON-LD, titles, labels and text routes', () => {
  assert.match('We leverage it. Leveraging. A game-changer, a game changer.', BANNED, 'the pattern catches the v2 words');
  for (const word of ['Leverage', 'leveraged', 'LEVERAGING', 'game-changer', 'Game changers', 'gamechanger']) assert.match(word, BANNED, word);
  for (const path of PAGES) {
    const markup = page(path);
    const meta = [...markup.matchAll(/<(?:title>([^<]*)<\/title|meta [^>]*content="([^"]*)")/g)].map(m => m[1] ?? m[2]).join(' ');
    const jsonLd = [...markup.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]).join(' ');
    const attrs = [...markup.matchAll(/\s(?:title|aria-label|alt|placeholder)="([^"]*)"/g)].map(m => m[1]).join(' ');
    for (const [part, text] of Object.entries({ visible: visibleText(markup), meta, jsonLd, attrs })) {
      assert.doesNotMatch(text, BANNED, `${path} ${part}`);
    }
  }
  for (const path of TEXT_ROUTES) assert.doesNotMatch(guideText(path), BANNED, path);
});

test('no em dash (U+2014) anywhere in the rendered pages, their attributes, JSON-LD, or the text routes; no en dash or spaced hyphen stands in for one', () => {
  const dash = /\u2014|&mdash;|&#8212;|&#x2014;|\\u2014/i;
  for (const path of [...PAGES, ...TEXT_ROUTES, '/shopify-va/assets/public.css', '/shopify-va/assets/hero.js', '/shopify-va/assets/sequence.js', '/shopify-va/assets/theme.js']) {
    const body = page(path);
    assert.doesNotMatch(body, dash, path);
    if (!path.includes('/assets/')) assert.doesNotMatch(path.endsWith('.txt') ? guideText(path) : visibleText(body), /\u2013|&ndash;| -- | - /, `${path}: an en dash or spaced hyphen used as a dash`);
  }
  // The skill library itself carries none either, so llms-full.txt is clean end to end.
  for (const doc of SKILL_DOCS) assert.doesNotMatch(doc.body + doc.description, /\u2014/, doc.slug);
});

test('01-07 markers appear only in the real stage sequence; setup steps use plain ordinals', () => {
  assert.match(rule('.quick-setup>li::before'), /content:counter\(qs\) '\.'/);
  assert.doesNotMatch(css, /content:'0' counter/);
  const outsideSequence = html.replace(/<section id="sequence"[\s\S]*?<\/section>/, '');
  assert.doesNotMatch(visibleText(outsideSequence), /(?:^|\s)0[1-9](?:\s|$)/);
});

test('section rhythm varies by role: major sections open wider than related ones', () => {
  assert.match(css, /--gap-major:128px/);
  assert.match(css, /--gap-related:56px/);
  assert.match(rule('.band-major'), /padding:var\(--gap-major\) 0 var\(--gap-related\)/);
  assert.match(rule('.band-related'), /padding:var\(--gap-related\) 0 var\(--gap-related\)/);
  const roles = [...html.matchAll(/<section id="([a-z]+)" class="band (band-[a-z]+)/g)].map(m => `${m[1]}:${m[2]}`);
  assert.deepEqual(roles, ['sequence:band-major', 'bottlenecks:band-major', 'skills:band-related', 'setup:band-major', 'faq:band-related']);
  assert.ok(!css.includes('--section-y'), 'no single padding value for every section');
});

test('radius by role: 6px buttons and tabs, 12px panels, 4px wells, code and inputs, 0 on rows', () => {
  assert.match(css, /--radius-btn:6px;\s*--radius-panel:12px;\s*--radius-well:4px/);
  for (const selector of ['.copy-btn', '.wb-tabs,.ex-tabs,.seg-tabs']) assert.match(rule(selector), /border-radius:var\(--radius-btn\)/, selector);
  assert.match(rule('.setup-drawer'), /border-radius:var\(--radius-panel\)/);
  for (const selector of ['.wb-row', '.cmd-row', '.command,.request', '.ex-input', '.skill-filter input']) assert.match(rule(selector), /border-radius:var\(--radius-well\)/, selector);
  const used = new Set([...css.slice(0, css.indexOf('.app-home{')).matchAll(/border-radius:([^;}]+)/g)].map(m => m[1].trim()));
  assert.deepEqual([...used].sort(), ['0', 'var(--radius-btn)', 'var(--radius-panel)', 'var(--radius-well)']);
});

test('the whole skill row opens its page on this site while Copy prompt keeps working, and no row links to GitHub', () => {
  assert.match(rule('.skill-link::after'), /content:'';position:absolute;inset:0/);
  assert.match(rule('.skill-entry .copy-btn'), /position:relative;z-index:1/);
  assert.match(html, /<a class="skill-link" href="\/shopify-va\/skills\/shopify-product-listing"><span>Read the<span class="sr-only"> Product Listings<\/span> skill<\/span><\/a>/);
  const entries = [...html.matchAll(/<article class="skill-entry"[\s\S]*?<\/article>/g)].map(m => m[0]);
  assert.equal(entries.length, 19);
  for (const entry of entries) {
    const links = [...entry.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map(m => m[1]!);
    assert.equal(links.length, 1, 'one link per row: the stretched "Read the skill" link');
    assert.match(links[0]!, /^\/shopify-va\/skills\/shopify-[a-z-]+$/);
    assert.doesNotMatch(entry, /github\.com|on GitHub/i);
    assert.match(entry, /data-copy="[^"]+">Copy prompt<\/button>/);
  }
  assert.match(rule('.section-head'), /text-align:center/, 'section headings outside the hero stay centred');
});

test('the theme script no longer hides anything waiting for a scroll reveal', () => {
  const card = { classes: new Set<string>(), classList: { add(n: string) { card.classes.add(n); } }, style: {} };
  const document = { readyState: 'complete', querySelectorAll: (sel: string) => (sel === '[data-stagger]' || sel === '[data-reveal]' ? [{ children: [card] }] : []), querySelector: () => null, addEventListener() {} };
  let observed = 0;
  class IO { observe() { observed++; } unobserve() {} }
  runInNewContext(THEME_SCRIPT, { document, window: { IntersectionObserver: IO }, IntersectionObserver: IO, matchMedia: () => ({ matches: false }), setTimeout, Array, Math });
  assert.equal(observed, 0);
  assert.equal(card.classes.size, 0);
});
