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

// The owner's Shopify VA palette (anti-slop spec, 2026-11-27). /app keeps its own light tokens under .app-home.
const PALETTE = {
  ground: '#15191a', surface: '#1d2223', line: '#343c3d', ink: '#eff2f0', muted: '#b2bbb6', accent: '#62c597', signal: '#eab04f',
};
const SURFACES = ['ground', 'surface'] as const;

test('root tokens are exactly the owner palette', () => {
  const t = rootTokens();
  for (const [name, hex] of Object.entries(PALETTE)) assert.equal(t[name], hex, `--${name}`);
  assert.equal(t['on-accent'], PALETTE.ground, 'button and selected-tab labels use the ground colour');
  assert.match(PUBLIC_STYLES, /:root\{\s*color-scheme:dark/);
  assert.doesNotMatch(PUBLIC_STYLES, /--(?:raised|ground-alt|border|ink-2|hl|well|btn-shadow)\s*:/, 'no leftover tokens from the old ladder');
  assert.ok(luminance(t.ground) > luminance('#070807'), 'charcoal, not near-black');
});

// Text (ink, muted) needs 7:1 and accents (accent, signal) 4.5:1 on every surface they sit on.
for (const surface of SURFACES) {
  for (const [fg, min] of [['ink', 7], ['muted', 7], ['accent', 4.5], ['signal', 4.5]] as const) {
    test(`${fg} on ${surface} meets ${min}:1`, () => {
      const t = rootTokens();
      const ratio = contrast(t[fg], t[surface]);
      assert.ok(ratio >= min, `${fg} ${t[fg]} on ${surface} ${t[surface]} = ${ratio.toFixed(2)}:1, needs ${min}:1`);
    });
  }
}

test('labels on the accent (primary button, selected tab) meet 7:1, and so does the accent hover fill', () => {
  const t = rootTokens();
  assert.ok(contrast(t['on-accent'], t.accent) >= 7, `on-accent on accent = ${contrast(t['on-accent'], t.accent).toFixed(2)}:1`);
  assert.ok(contrast(t['on-accent'], t['accent-hover']) >= 7, `on-accent on accent-hover = ${contrast(t['on-accent'], t['accent-hover']).toFixed(2)}:1`);
});

test('contrast table', () => {
  const t = rootTokens();
  const rows = SURFACES.flatMap(s => ['ink', 'muted', 'accent', 'signal'].map(f => `${f} ${t[f]} on ${s} ${t[s]} = ${contrast(t[f], t[s]).toFixed(2)}:1`));
  console.log([...rows, `on-accent ${t['on-accent']} on accent ${t.accent} = ${contrast(t['on-accent'], t.accent).toFixed(2)}:1`].join('\n'));
});

test('two accents with separate roles: signal marks only the lit stage', async () => {
  const signalRules = [...PUBLIC_STYLES.matchAll(/([^{}]+)\{[^}]*var\(--signal\)[^}]*\}/g)].map(m => m[1].trim());
  assert.deepEqual(signalRules, ['.seq-gates a.is-focus', '.seq-item.is-lit .seq-num,.seq-item:target .seq-num']);
  const { SEQUENCE_SCRIPT } = await import('../src/public-ui/sequence-canvas.js');
  const { HERO_SCRIPT } = await import('../src/public-ui/hero-canvas.js');
  assert.match(SEQUENCE_SCRIPT, /var accent = '#62c597', muted = '#b2bbb6', ground = '#15191a', signal = '#eab04f'/);
  assert.match(SEQUENCE_SCRIPT, /ctx\.strokeStyle = on \? signal : c > 0 \? accent : muted/, 'only the lit gate is drawn in the signal colour');
  assert.match(HERO_SCRIPT, /EMERALD = \[98, 197, 151\]/, 'hero waves use the accent hue');
  for (const source of [PUBLIC_STYLES, HERO_SCRIPT, SEQUENCE_SCRIPT]) assert.doesNotMatch(source, /6cc9a0|108, ?201, ?160|b9eb6a|#070807/i, 'no old mint, lime or near-black left');
  // The embedded /app keeps its own light accent.
  assert.match(PUBLIC_STYLES, /\.app-home\{[^}]*--accent:#007a5c/);
});
