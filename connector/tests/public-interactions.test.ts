import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { renderHelpPage, renderProductPage } from '../src/public-pages.js';
import { publicContent } from '../src/public-routes.js';
import { SKILL_CATALOG } from '../src/public-ui/skill-groups.js';
import { THEME_SCRIPT } from '../src/public-ui/theme.js';

/* A small fake DOM: enough of Element, selectors and events to drive the real served script. */
type Listener = (event: FakeEvent) => void;
type FakeEvent = { type: string; key?: string; preventDefault(): void; prevented: boolean };
class El {
  attrs = new Map<string, string>();
  children: El[] = [];
  parent?: El;
  listeners = new Map<string, Listener[]>();
  classes = new Set<string>();
  hidden = false;
  checked = false;
  value = '';
  tabIndex = 0;
  id = '';
  className = '';
  style: Record<string, string> = {};
  offsetWidth = 100;
  innerHTML = '';
  private text = '';
  constructor(public tagName: string, attrs: Record<string, string> = {}) {
    for (const [k, v] of Object.entries(attrs)) this.attrs.set(k, v);
    if (attrs.id) this.id = attrs.id;
  }
  get textContent(): string { return this.text || this.children.map(c => c.textContent).join(''); }
  set textContent(value: string) { this.text = value; this.innerHTML = value; this.children = []; }
  classList = { toggle: (name: string, on?: boolean) => { if (on ?? !this.classes.has(name)) this.classes.add(name); else this.classes.delete(name); }, add: (name: string) => this.classes.add(name), remove: (name: string) => this.classes.delete(name) };
  append(...nodes: El[]) { for (const n of nodes) { n.parent = this; this.children.push(n); } return this; }
  appendChild(n: El) { this.append(n); return n; }
  removeChild(n: El) { this.children = this.children.filter(c => c !== n); }
  getAttribute(name: string) { return this.attrs.get(name) ?? null; }
  setAttribute(name: string, value: string) { this.attrs.set(name, value); if (name === 'id') this.id = value; }
  addEventListener(type: string, fn: Listener) { this.listeners.set(type, [...this.listeners.get(type) ?? [], fn]); }
  focus() { focused = this; }
  select() {}
  descendants(): El[] { return this.children.flatMap(c => [c, ...c.descendants()]); }
  matches(selector: string): boolean {
    const m = /^([a-z0-9]*)((?:\[[^\]]+\])*)$/.exec(selector)!;
    if (m[1] && m[1] !== this.tagName) return false;
    return [...m[2].matchAll(/\[([a-z-]+)(?:=([^\]]+))?\]/g)].every(([, name, val]) => this.attrs.has(name) && (val === undefined || this.attrs.get(name) === val));
  }
  querySelectorAll(selector: string) { return this.descendants().filter(e => e.matches(selector)); }
  querySelector(selector: string) { return this.querySelectorAll(selector)[0] ?? null; }
  fire(type: string, key?: string) {
    const event: FakeEvent = { type, key, prevented: false, preventDefault() { this.prevented = true; } };
    for (const fn of this.listeners.get(type) ?? []) fn(event);
    return event;
  }
}
let focused: El | undefined;
const settled = () => new Promise<void>(resolve => setImmediate(resolve));

function boot(body: El, clipboard?: { writeText(text: string): Promise<void> }) {
  const timers: Array<() => void> = [];
  const document = Object.assign(body, {
    readyState: 'complete', body, activeElement: undefined as El | undefined,
    createElement: (tag: string) => new El(tag),
    addEventListener() {},
    execCommand: () => false,
  });
  runInNewContext(THEME_SCRIPT, {
    document, navigator: clipboard ? { clipboard } : {}, matchMedia: () => ({ matches: true }),
    setTimeout: (fn: () => void) => { timers.push(fn); return timers.length; }, clearTimeout: () => {},
    Promise, Array, IntersectionObserver: undefined, window: {},
  });
  return { timers, document };
}

test('a copy button keeps its icon after the Copied flash and announces the result', async () => {
  const body = new El('body');
  const btn = new El('button', { 'data-copy': 'hello' });
  btn.innerHTML = '<svg></svg>Copy prompt';
  body.append(btn);
  let copied = '';
  const { timers } = boot(body, { writeText: async text => { copied = text; } });
  assert.equal(btn.hidden, false, 'the script reveals copy buttons');
  btn.fire('click'); await settled();
  assert.equal(copied, 'hello');
  assert.equal(btn.textContent, 'Copied');
  assert.ok(btn.classes.has('is-copied'));
  const live = body.querySelector('div[role=status]');
  assert.ok(live, 'an announcement region exists');
  timers.forEach(fn => fn());
  assert.equal(live!.textContent, 'Copied to clipboard');
  assert.equal(btn.innerHTML, '<svg></svg>Copy prompt', 'icon and label come back');
  assert.ok(!btn.classes.has('is-copied'));
});

test('a copy that is refused says so instead of failing silently', async () => {
  const body = new El('body');
  const btn = new El('button', { 'data-copy': 'hello' });
  btn.innerHTML = 'Copy';
  body.append(btn);
  boot(body, { writeText: async () => { throw new Error('denied'); } });
  btn.fire('click'); await settled(); await settled();
  assert.equal(btn.textContent, 'Copy failed');
  assert.ok(!btn.classes.has('is-copied'));
});

function tabGroup() {
  const body = new El('body');
  const group = new El('div', { 'data-tabs': 'demo' });
  const radios = [0, 1, 2].map(() => new El('input', { type: 'radio' }));
  // Radios in one named group: checking one unchecks the others, as in a browser.
  const state = [true, false, false];
  radios.forEach((radio, i) => Object.defineProperty(radio, 'checked', {
    get: () => state[i],
    set: (on: boolean) => { if (on) state.fill(false); state[i] = on; },
  }));
  const list = new El('div', { 'data-tablist': '' });
  const labels = ['A', 'B', 'C'].map(() => new El('label'));
  list.append(...labels);
  const panels = [0, 1, 2].map(() => new El('div', { 'data-tabpanel': '' }));
  group.append(...radios, list, ...panels);
  body.append(group);
  boot(body);
  return { labels, radios, panels, list };
}

test('tab groups gain tab roles, a roving tabindex and arrow, Home and End keys', () => {
  const { labels, radios, panels, list } = tabGroup();
  assert.equal(list.getAttribute('role'), 'tablist');
  assert.deepEqual(labels.map(l => l.getAttribute('role')), ['tab', 'tab', 'tab']);
  assert.deepEqual(panels.map(p => p.getAttribute('role')), ['tabpanel', 'tabpanel', 'tabpanel']);
  assert.deepEqual(labels.map(l => l.getAttribute('aria-selected')), ['true', 'false', 'false']);
  assert.deepEqual(labels.map(l => l.tabIndex), [0, -1, -1]);
  assert.deepEqual(radios.map(r => r.tabIndex), [-1, -1, -1], 'the hidden radios leave the tab order');
  assert.equal(panels[1].getAttribute('aria-labelledby'), labels[1].id);
  assert.equal(labels[1].getAttribute('aria-controls'), panels[1].id);

  const right = labels[0].fire('keydown', 'ArrowRight');
  assert.ok(right.prevented);
  assert.deepEqual(radios.map(r => r.checked), [false, true, false]);
  assert.equal(focused, labels[1]);
  assert.deepEqual(labels.map(l => l.tabIndex), [-1, 0, -1]);
  labels[1].fire('keydown', 'End');
  assert.deepEqual(labels.map(l => l.getAttribute('aria-selected')), ['false', 'false', 'true']);
  labels[2].fire('keydown', 'ArrowRight');
  assert.equal(radios[0].checked, true, 'arrows wrap around');
  labels[0].fire('keydown', 'ArrowLeft');
  assert.equal(radios[2].checked, true);
  labels[2].fire('keydown', 'Home');
  assert.equal(radios[0].checked, true);
  assert.equal(labels[0].fire('keydown', 'a').prevented, false, 'other keys are left alone');
});

function catalog() {
  const body = new El('body');
  const wrap = new El('div', { 'data-skill-filter-wrap': '' }); wrap.hidden = true;
  const input = new El('input', { 'data-skill-filter': '' });
  const status = new El('span', { 'data-skill-status': '' });
  const tabs = ['All', 'Catalog', 'Growth & Ads'].map((cat, i) => new El('button', { 'data-skill-cat': cat, 'aria-pressed': i === 0 ? 'true' : 'false' }));
  const empty = new El('div', { 'data-skill-empty': '' }); empty.hidden = true;
  const emptyQuery = new El('span', { 'data-skill-empty-query': '' });
  const reset = new El('button', { 'data-skill-reset': '' });
  empty.append(emptyQuery, reset);
  const data = [
    ['Product Listings', 'Turns specs into titles.', 'Catalog', 'Write a title'],
    ['Meta Ads', 'Checks Advantage+ structure.', 'Growth & Ads', 'Review our campaigns'],
    ['Google Ads & Shopping', 'Finds feed disapprovals.', 'Growth & Ads', 'Review our feed'],
  ];
  const cards = data.map(([name, summary, cat, prompt]) => {
    const card = new El('article', { 'data-skill-card': '', 'data-cat': cat });
    const h3 = new El('h3'); h3.textContent = name;
    const p = new El('p'); p.textContent = summary;
    const copy = new El('button', { 'data-copy': prompt }); copy.textContent = 'Copy prompt';
    const link = new El('a'); link.textContent = 'Read the skill';
    card.append(h3, p, copy, link);
    return card;
  });
  wrap.append(input, status, ...tabs);
  body.append(wrap, ...cards, empty);
  boot(body);
  return { wrap, input, status, tabs, empty, emptyQuery, reset, cards };
}
const visible = (cards: El[]) => cards.filter(c => !c.hidden).length;

test('the skill search ignores button labels and covers names, summaries and starter prompts', () => {
  const f = catalog();
  assert.equal(f.wrap.hidden, false, 'controls appear once the script runs');
  f.input.value = 'copy'; f.input.fire('input');
  assert.equal(visible(f.cards), 0, '"copy" only appears in the button label');
  f.input.value = 'read the skill'; f.input.fire('input');
  assert.equal(visible(f.cards), 0, '"Read the skill" only appears in the link label');
  f.input.value = 'ads'; f.input.fire('input');
  assert.equal(visible(f.cards), 2);
  assert.equal(f.status.textContent, '2 of 3 skills');
  f.input.value = 'review our campaigns'; f.input.fire('input');
  assert.equal(visible(f.cards), 1, 'the starter prompt is searchable');
});

test('typing a search moves the category buttons back to All so the pressed tab never lies', () => {
  const f = catalog();
  f.tabs[1].fire('click');
  assert.equal(visible(f.cards), 1);
  assert.deepEqual(f.tabs.map(t => t.getAttribute('aria-pressed')), ['false', 'true', 'false']);
  f.input.value = 'ads'; f.input.fire('input');
  assert.deepEqual(f.tabs.map(t => t.getAttribute('aria-pressed')), ['true', 'false', 'false']);
  assert.equal(visible(f.cards), 2, 'the search covers every category');
  f.tabs[2].fire('click');
  assert.equal(f.input.value, '', 'choosing a category clears the search');
  assert.equal(visible(f.cards), 2);
});

test('a search with no results shows an empty state that can be reset', () => {
  const f = catalog();
  assert.equal(f.empty.hidden, true);
  f.input.value = 'zzzz'; f.input.fire('input');
  assert.equal(visible(f.cards), 0);
  assert.equal(f.empty.hidden, false);
  assert.equal(f.emptyQuery.textContent, '"zzzz"');
  assert.equal(f.status.textContent, '0 of 3 skills');
  f.reset.fire('click');
  assert.equal(f.empty.hidden, true);
  assert.equal(visible(f.cards), 3);
  assert.equal(f.input.value, '');
  assert.equal(focused, f.input, 'focus returns to the search box');
  f.input.value = 'zzzz'; f.input.fire('input');
  f.input.value = 'zzzz'; f.input.fire('keydown', 'Escape');
  assert.equal(f.input.value, '', 'Escape clears the search');
  assert.equal(f.empty.hidden, true);
});

// Markup contracts that the interactions above depend on.
const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };

test('tab groups are plain radio inputs in the markup, with tab roles added only by the script', () => {
  const html = renderProductPage(config);
  assert.doesNotMatch(html, /role="tab/, 'no ARIA tab roles before the script runs');
  assert.equal((html.match(/data-tablist/g) ?? []).length, 2);
  assert.equal((html.match(/data-tabpanel/g) ?? []).length, 6);
  assert.equal((html.match(/data-tabs="/g) ?? []).length, 2);
});

test('the skill controls stay hidden until the script runs and the page carries an empty state', () => {
  const html = renderProductPage(config);
  assert.match(html, /<div class="catalog-controls" data-skill-filter-wrap hidden>/);
  assert.match(html, /<div class="skill-empty" data-skill-empty hidden>/);
  assert.match(html, /data-skill-reset/);
  const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
  assert.match(css, /\[hidden\]\{display:none!important\}/);
});

test('the stage strip links each gate to its row so the highlight works from the keyboard', () => {
  const html = renderProductPage(config);
  for (let i = 1; i <= 7; i++) {
    assert.match(html, new RegExp(`<li class="seq-item" id="seq-${i}">`));
    assert.match(html, new RegExp(`<a href="#seq-${i}" data-seq-label aria-label="Stage ${i}: [^"]+">0${i}</a>`));
  }
  const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
  assert.match(css, /\.seq-item:target/, 'a row stays highlighted after its gate is followed, even without script');
  const script = publicContent('/shopify-va/assets/sequence.js', config)!.body as string;
  assert.match(script, /Array\.prototype\.forEach\.call\(labels, bind\)/);
  assert.match(script, /classList\.toggle\('is-lit'/);
});

test('the common-problems table repeats fix first and check next on phones instead of dropping them', () => {
  const html = renderProductPage(config);
  const subs = html.match(/<span class="bn-sub">Fix first: [\s\S]*?<\/span>/g) ?? [];
  assert.equal(subs.length, 10);
  for (const sub of subs) assert.match(sub, /^<span class="bn-sub">Fix first: <a href="\/shopify-va\/skills\/shopify-[a-z-]+">[^<]+<\/a>\. Check next: <a href="\/shopify-va\/skills\//, sub);
  const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
  assert.match(css, /\.bn-sub\{display:none\}/);
  assert.match(css, /@media\(max-width:720px\)\{[\s\S]*?\.bn-sub\{display:block/);
});

test('footer links are at least 24px tall and keyboard focus is visible on the radio tabs', () => {
  const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
  assert.match(css, /\.site-footer nav a\{display:inline-flex;align-items:center;min-height:32px\}/);
  assert.match(css, /#wb-claude:focus-visible ~ \.wb-tabs label\[for=wb-claude\]/);
  assert.match(css, /\.wb-tabs label:focus-visible/);
  assert.match(css, /\.wb-panels,\.ex-panels\{display:grid\}/, 'panels share one grid cell so switching tabs does not move the page');
});

test('every command on the setup page has its own copy button and the page has a jump list', () => {
  const html = renderHelpPage(config);
  assert.match(html, /<nav class="doc-jump" aria-label="On this page">/);
  for (const id of ['quick-start', 'install-help', 'store-connection', 'fix-issues', 'contact']) {
    assert.match(html, new RegExp(`href="#${id}"`));
    assert.match(html, new RegExp(`<section id="${id}"(?: class="related")?>`));
  }
  assert.ok((html.match(/class="cmd-row"/g) ?? []).length >= 9);
  assert.match(html, /<a href="\/shopify-va\/setup" aria-current="page">How to set up<\/a>/);
  for (const command of ['npx skills add vinceservidad/Shopify-Expert-AI-Skills', 'codex plugin add shopify-va-toolkit@shopify-skills']) {
    assert.match(html, new RegExp(`data-copy="${command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  }
});

test('the install drawer lists both Codex commands, since the first alone does not install the plugin', () => {
  const html = renderProductPage(config);
  const drawer = html.match(/<details class="setup-drawer">[\s\S]*?<\/details>/)![0];
  assert.match(drawer, /data-copy="codex plugin marketplace add [^"]+"/);
  assert.match(drawer, /data-copy="codex plugin add shopify-va-toolkit@shopify-skills"/);
  assert.equal((drawer.match(/aria-label="Copy [^"]+ command: [^"]+"/g) ?? []).length, 8, 'each Copy button names its command');
});

test('skill summaries read in one voice and do not open with a second-person instruction', () => {
  for (const skill of SKILL_CATALOG) assert.doesNotMatch(skill.summary, /^(Use this|Run this|Before |When |Your AI app|Helps you)/, skill.name);
});
