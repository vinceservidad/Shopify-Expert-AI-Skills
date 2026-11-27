import assert from 'node:assert/strict';
import test from 'node:test';
import { PUBLIC_STYLES } from '../src/public-pages.js';

function rootTokens(): Record<string, string> {
  const block = PUBLIC_STYLES.match(/:root\{([^}]*)\}/)![1];
  return Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):(#[0-9a-f]{6})/g)].map(m => [m[1], m[2]]));
}
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Every public band is dark: text, links and button labels must meet WCAG AA on the surfaces they sit on.
const PAIRS: Array<[string, string, string, number]> = [
  ['ink', 'ground', 'headings and body on ground', 4.5],
  ['ink-2', 'ground', 'paragraphs on ground', 4.5],
  ['muted', 'ground', '14px captions on ground', 4.5],
  ['accent', 'ground', 'links and active marks on ground', 4.5],
  ['ink', 'ground-alt', 'headings on the alt band', 4.5],
  ['ink-2', 'ground-alt', 'paragraphs on the alt band', 4.5],
  ['muted', 'ground-alt', 'captions on the alt band', 4.5],
  ['accent', 'ground-alt', 'links on the alt band', 4.5],
  ['ink', 'raised', 'text on cards, boxes and tab strips', 4.5],
  ['ink-2', 'raised', 'secondary text on raised surfaces', 4.5],
  ['muted', 'raised', 'captions on raised surfaces', 4.5],
  ['accent', 'raised', 'links on raised surfaces', 4.5],
  ['on-accent', 'accent', 'button and active tab labels on lime', 4.5],
];

test('dark theme: root tokens are the dark ladder', () => {
  const t = rootTokens();
  assert.equal(t.ground, '#070807');
  assert.equal(t.raised, '#121412');
  assert.ok(luminance(t['ground-alt']) >= luminance(t.ground) && luminance(t['ground-alt']) <= luminance(t.raised), 'alt band is a small step between ground and raised');
  for (const key of ['ground', 'ground-alt', 'raised']) assert.ok(luminance(t[key]) < 0.05, `${key} is dark`);
  assert.match(PUBLIC_STYLES, /:root\{\s*color-scheme:dark/);
  assert.doesNotMatch(PUBLIC_STYLES, /band-mist|band-forest/);
});

for (const [fg, bg, use, min] of PAIRS) {
  test(`WCAG AA: ${fg} on ${bg} (${use})`, () => {
    const t = rootTokens();
    const ratio = contrast(t[fg], t[bg]);
    assert.ok(ratio >= min, `${fg} ${t[fg]} on ${bg} ${t[bg]} = ${ratio.toFixed(2)}:1, needs ${min}:1`);
  });
}

test('contrast table', () => {
  const t = rootTokens();
  console.log(PAIRS.map(([f, b]) => `${f} ${t[f]} on ${b} ${t[b]} = ${contrast(t[f], t[b]).toFixed(2)}:1`).join('\n'));
});
