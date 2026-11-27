import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { FONT_CACHE_CONTROL, publicContent } from '../src/public-routes.js';
import { PRELOADED_FONTS } from '../src/public-pages.js';
import { FONT_FILES_BASE64, FONT_LICENSES } from '../src/public-ui/fonts.js';

const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };
const css = publicContent('/shopify-va/assets/public.css', config)!.body as string;
const publicCss = css.slice(0, css.indexOf('.app-home{'));
const FILES = ['schibsted-grotesk-latin-wght-normal.woff2', 'ibm-plex-sans-latin-400-normal.woff2', 'ibm-plex-sans-latin-600-normal.woff2', 'ibm-plex-mono-latin-400-normal.woff2'];
const source = (name: string) => readFileSync(new URL(`../src/public-ui/fonts/${name}`, import.meta.url));

test('each font is served under /shopify-va/assets/fonts/ as woff2 with an immutable one-year cache', () => {
  assert.equal(FONT_CACHE_CONTROL, 'public, max-age=31536000, immutable');
  for (const name of FILES) {
    const content = publicContent(`/shopify-va/assets/fonts/${name}`, config);
    assert.ok(content && content.body instanceof Uint8Array, name);
    assert.equal(content.contentType, 'font/woff2');
    assert.equal(content.cacheControl, FONT_CACHE_CONTROL);
    assert.equal(Buffer.from(content.body).toString('latin1', 0, 4), 'wOF2', `${name} is a woff2 file`);
    assert.deepEqual(Buffer.from(content.body), source(name), `${name} matches the committed OFL file byte for byte`);
  }
  assert.deepEqual(Object.keys(FONT_FILES_BASE64).sort(), [...FILES].sort());
  for (const bad of ['/shopify-va/assets/fonts/other.woff2', '/shopify-va/assets/fonts/../public.css', '/shopify-va/assets/fonts/constructor.woff2', '/shopify-va/assets/fonts/toString.woff2']) {
    assert.equal(publicContent(bad, config), undefined, bad);
  }
});

test('the OFL licence texts ship with the fonts', () => {
  for (const [file, url] of [['LICENSE-schibsted-grotesk.txt', 'license-schibsted-grotesk.txt'], ['LICENSE-ibm-plex.txt', 'license-ibm-plex.txt']]) {
    assert.equal(FONT_LICENSES[file], source(file).toString('utf8'));
    assert.match(FONT_LICENSES[file], /SIL OPEN FONT LICENSE/i);
    const served = publicContent(`/shopify-va/assets/fonts/${url}`, config);
    assert.equal(served?.body, FONT_LICENSES[file]);
    assert.equal(served?.contentType, 'text/plain; charset=utf-8');
  }
});

test('the stylesheet declares the four faces with font-display swap and uses them by role', () => {
  const faces = [...css.matchAll(/@font-face\{([^}]*)\}/g)].map(m => m[1]);
  assert.equal(faces.length, 4);
  for (const face of faces) assert.match(face, /font-display:swap/);
  assert.match(faces[0], /font-family:"Schibsted Grotesk";font-style:normal;font-weight:400 900;[^}]*url\(fonts\/schibsted-grotesk-latin-wght-normal\.woff2\) format\("woff2"\)/);
  assert.match(faces[1], /font-family:"IBM Plex Sans";[^}]*font-weight:400;[^}]*ibm-plex-sans-latin-400-normal\.woff2/);
  assert.match(faces[2], /font-family:"IBM Plex Sans";[^}]*font-weight:600;[^}]*ibm-plex-sans-latin-600-normal\.woff2/);
  assert.match(faces[3], /font-family:"IBM Plex Mono";[^}]*font-weight:400;[^}]*ibm-plex-mono-latin-400-normal\.woff2/);
  assert.match(css, /--display:"Schibsted Grotesk",/);
  assert.match(css, /--sans:"IBM Plex Sans",/);
  assert.match(css, /--mono:"IBM Plex Mono",/);
  assert.match(css, /:root\{[^}]*font-family:var\(--sans\)/);
  assert.match(css, /h1,h2,h3\{[^}]*font-family:var\(--display\)/);
  assert.match(css, /code,pre\{font-family:var\(--mono\)\}/);
  assert.match(css, /\.hero-h1\{[^}]*font-family:var\(--display\);[^}]*font-weight:700/);
  assert.match(css, /\nh2\{[^}]*font-weight:650/);
  assert.match(css, /\nh3\{[^}]*font-weight:600/);
});

test('banned faces never appear and no system stack is the design font', () => {
  assert.doesNotMatch(publicCss, /\b(?:Inter|Roboto|Arial|Open Sans|Lato|Space Grotesk)\b/);
  assert.doesNotMatch(publicCss, /system-ui|-apple-system|BlinkMacSystemFont|Segoe UI/, 'system stacks are only kept for the /app light theme');
  for (const m of publicCss.matchAll(/font-family:([^;}]+)/g)) {
    assert.match(m[1].trim(), /^(?:var\(--(?:sans|display|mono)\)|"(?:Schibsted Grotesk|IBM Plex Sans|IBM Plex Mono)")$/, `font-family:${m[1]}`);
  }
  // Only the loaded weights are asked for: Plex Sans 400/600, Plex Mono 400; Schibsted covers 400-900.
  for (const m of publicCss.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const weight = m[2].match(/font-weight:(\d+)/)?.[1];
    if (!weight || /font-family:var\(--(?:display)\)/.test(m[2]) || /^h[123]\b|\.hero-h1|\.doc-head h1|\.aside-h|\.seq-stage|\.setup-brand|\.faq-item summary/.test(m[1].trim())) continue;
    assert.ok(['400', '600'].includes(weight), `${m[1].trim()} asks for weight ${weight}, which is not loaded`);
  }
});

test('every page preloads the heading and body faces from its own origin', () => {
  assert.deepEqual([...PRELOADED_FONTS], ['schibsted-grotesk-latin-wght-normal.woff2', 'ibm-plex-sans-latin-400-normal.woff2']);
  for (const path of ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy']) {
    const html = publicContent(path, config)!.body as string;
    const preloads = [...html.matchAll(/<link rel="preload" href="([^"]+)" as="font" type="font\/woff2" crossorigin>/g)].map(m => m[1]);
    assert.deepEqual(preloads, PRELOADED_FONTS.map(f => `/shopify-va/assets/fonts/${f}`), path);
    assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit|fonts\.bunny/);
    assert.ok(html.indexOf('rel="preload"') < html.indexOf('rel="stylesheet"'), 'preloads come before the stylesheet');
  }
});
