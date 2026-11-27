import assert from 'node:assert/strict';
import { test } from 'node:test';
import { skillPagePaths } from '../src/public-pages.js';
import { publicContent } from '../src/public-routes.js';

/* The owner's anti-AI copy check v2 (2026-11-27): no reassurance, promises or next steps the product doesn't back,
   no sign-offs, and no parenthetical glosses after MCP, OAuth or PKCE outside setup steps. Applied to the guide copy
   of /shopify-va, /setup, /privacy, every skill and reference page (without the rendered skill file), the meta, OG
   and JSON-LD text, llms.txt, and the guide part of llms-full.txt (the skill library's own text is out of scope). */
const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };
const body = (path: string) => publicContent(path, config)!.body as string;
const decode = (value: string) => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&middot;/g, '·').replace(/&amp;/g, '&');

/** Everything a reader or a crawler sees that the guide wrote: visible text, title and aria-label attributes,
 *  meta and OG content, and JSON-LD string values. Rendered skill and reference bodies are removed first. */
function guideText(html: string): string {
  const page = html
    .replace(/<div class="md-body">[\s\S]*?<\/div>\s*<\/section>/, '</section>')
    .replace(/<section id="reference" class="md-body">[\s\S]*?<\/section>/, '');
  const attributes = [...page.matchAll(/\s(?:content|title|aria-label|alt|placeholder)="([^"]*)"/g)].map(m => m[1]);
  const jsonLd = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => {
    const strings: string[] = [];
    JSON.stringify(JSON.parse(m[1]!), (_key, value) => { if (typeof value === 'string') strings.push(value); return value; });
    return strings;
  });
  const visible = page.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, ' ').replace(/<[^>]+>/g, ' ');
  return decode([visible, ...attributes, ...jsonLd].join(' \n ')).replace(/[ \t]+/g, ' ');
}

const { skills, references } = skillPagePaths();
const HTML_PATHS = ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy', ...skills, ...references];
function allGuideTexts(): Record<string, string> {
  const full = body('/shopify-va/llms-full.txt');
  return {
    ...Object.fromEntries(HTML_PATHS.map(path => [path, guideText(body(path))])),
    '/shopify-va/llms.txt': body('/shopify-va/llms.txt'),
    '/shopify-va/llms-full.txt (guide part)': full.slice(0, full.indexOf('\n## Skill: ')),
  };
}

/** Reassurance, promises and next steps the product doesn't back, intro lines that restate a heading, and sign-offs. */
const REASSURANCE_AND_SIGN_OFFS: readonly RegExp[] = [
  /\bsafe hands\b/i, /\bget results fast\b/i, /\bwe(?:'|’)?ll help you\b/i, /\bwe will help you\b/i, /\bstart today\b/i,
  /\bget started (?:today|now)\b/i, /\byou(?:'|’)re all set\b/i, /\byou(?:'|’)re good to go\b/i, /\bin no time\b/i,
  /\brest assured\b/i, /\bpeace of mind\b/i, /\bworry[- ]free\b/i, /\bdon(?:'|’)t worry\b/i, /\beffortless/i, /\bhassle[- ]free\b/i,
  /\bquick overview\b/i, /\bhere(?:'|’)s how it works\b/i, /\bhere is how it works\b/i, /\bhere(?:'|’)s what you get\b/i,
  /\blet me know\b/i, /\bif you have any questions\b/i, /\bfeel free to\b/i, /\bhappy (?:selling|shopping|building|automating)\b/i,
  /\bgood luck\b/i, /\bhope this helps\b/i, /\bthat(?:'|’)s it[.!]/i, /\byou(?:'|’)ve got this\b/i, /\bcheers[.!]/i,
];

test('copy check v2: no reassurance, unbacked promises, restating intro lines or sign-offs in any guide copy', () => {
  for (const sample of ["You're in safe hands.", "Here's how it works.", 'Let me know if you have any questions.', 'Happy selling!', "You're all set.", 'Start today.'])
    assert.ok(REASSURANCE_AND_SIGN_OFFS.some(pattern => pattern.test(sample)), `the list catches: ${sample}`);
  assert.ok(!REASSURANCE_AND_SIGN_OFFS.some(pattern => pattern.test('Nothing changes in the store without approval.')), 'a real product fact passes');
  const texts = allGuideTexts();
  assert.ok(Object.keys(texts).length > 100, 'guide pages, every skill and reference page, and the text routes are checked');
  for (const [path, text] of Object.entries(texts))
    for (const pattern of REASSURANCE_AND_SIGN_OFFS) assert.doesNotMatch(text, pattern, `${path}: ${pattern}`);
});

/** "MCP (a way for AI apps to connect)", "MCP server (Streamable HTTP)", "OAuth (an open standard)", "PKCE (proof key)". */
const GLOSS_AFTER_TERM = /\b(?:MCP|OAuth|PKCE)(?: (?:2\.1|server|servers|link|URL|connector))? ?\(/;

test('copy check v2: no parenthetical gloss after MCP, OAuth or PKCE outside setup steps', () => {
  for (const sample of ['MCP (a way for AI apps to connect)', 'The MCP server (Streamable HTTP) is here.', 'OAuth 2.1 (an open standard)', 'PKCE (proof key for code exchange)'])
    assert.match(sample, GLOSS_AFTER_TERM, sample);
  assert.doesNotMatch('Add it as a custom connector (remote MCP server).', GLOSS_AFTER_TERM, 'a field label in parentheses is not a gloss after the term');
  // Setup steps keep the exact labels a person needs to find a field, so the numbered quick-start steps are exempt.
  const texts = allGuideTexts();
  texts['/shopify-va/setup'] = guideText(body('/shopify-va/setup').replace(/<section id="quick-start">[\s\S]*?<\/section>/, ''));
  texts['/shopify-va'] = guideText(body('/shopify-va').replace(/<ol class="quick-setup">[\s\S]*?<\/ol>/, ''));
  for (const [path, text] of Object.entries(texts)) assert.doesNotMatch(text, GLOSS_AFTER_TERM, path);
});
