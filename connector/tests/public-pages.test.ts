import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FAQ_ITEMS, PUBLIC_STYLES, renderHelpPage, renderLlmsTxt, renderPrivacyPage, renderProductPage, type PublicPageConfig } from '../src/public-pages.js';
import { publicContent } from '../src/public-routes.js';
import { SKILL_CATALOG, SKILL_GROUPS } from '../src/public-ui/skill-groups.js';

const RELEASE_PLUGIN_URL =
  'https://github.com/vinceservidad/Shopify-Expert-AI-Skills/releases/download/v0.2.2/shopify-va-toolkit-skills-only.plugin';

const candidateConfig: PublicPageConfig = {
  publicUrl: 'https://shopify-mcp.mktskills.com',
  basePath: '/shopify-va',
  launchStage: 'candidate',
  pluginDownloadUrl: RELEASE_PLUGIN_URL,
};

const STALE_OR_SLOP_PATTERNS = [
  /A public plugin download has not been released/,
  /unreleased 0\.2\.0/,
  /Custom GPT/i,
  /GPT Instructions/i,
  /the new domain/,
  /Email forwarding must be verified/,
  /mailbox is being prepared/,
  /connector address provided by the operator/,
  /September 30, 2026/,
  /\b(?:delve|supercharge|game-changer|cutting-edge|synergy|holistic|revolutionize|unleash|effortlessly|streamline|empower|leverage)\b/i,
  /\b(?:diagnose|diagnosis|triage|symptom|prescribe|clinical|pathology)\b/i,
];

function stripToVisibleText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&middot;/g, '·')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

test('product page brand, 4-item header, 3-step explainer, bottleneck table, 19-skill catalog, 4x2 apps grid, and multi-platform setup', () => {
  const html = renderProductPage(candidateConfig);

  // Header brand parity with mktskills.com + 4 clean nav links
  assert.ok(html.includes('<a class="setup-brand" href="https://mktskills.com/">Marketing Skills</a>'));
  assert.ok(html.includes('<a href="https://mktskills.com/">marketing/</a>'));
  assert.ok(html.includes('data-product="va" aria-current="page">shopify-va/</a>'));
  const navMatch = /<nav class="family-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(html);
  assert.ok(navMatch, 'family-nav missing');
  const navLinks = navMatch[1].match(/<a\b/g) ?? [];
  assert.equal(navLinks.length, 4, 'top nav should have exactly 4 links');

  // Above-the-fold trust highlights
  assert.ok(html.includes('Free &amp; MIT open source'));
  assert.ok(html.includes('ChatGPT &amp; Claude with no terminal and no login'));
  assert.ok(html.includes('Read &amp; draft only'));

  // 3-step explainer
  assert.ok(html.includes('Connect once'));
  assert.ok(html.includes('Pick the store task'));
  assert.ok(html.includes('Review drafts before publishing'));

  // Bottleneck table & Sidekick comparison
  assert.ok(html.includes('id="bottlenecks"'));
  assert.ok(html.includes('Bottleneck'));
  assert.ok(html.includes('Fix first'));
  assert.ok(html.includes('Check next'));
  assert.ok(html.includes('id="sidekick"'));
  assert.ok(html.includes('Shopify Sidekick'));
  assert.ok(html.includes('Chargeback'));
  assert.ok(html.includes('BFCM'));
  assert.ok(html.includes('TikTok Shop'));

  // 19-skill catalog parity & clean human names
  assert.equal(SKILL_CATALOG.length, 19);
  assert.deepEqual(
    SKILL_CATALOG.map(s => s.slug).sort(),
    SKILL_GROUPS.flatMap(g => g.skills).sort(),
  );
  const visible = stripToVisibleText(html);
  for (const name of ['Product Listings', 'Catalog & Inventory', 'Order Operations', 'Customer Support', 'Store Audit', 'Shopify Flow', 'Theme Development']) {
    assert.ok(visible.includes(name), `Missing clean human name: ${name}`);
  }

  // Balanced 8-app grid
  for (const app of ['ChatGPT', 'Claude', 'Claude Code', 'OpenAI Codex', 'Cursor', 'Windsurf', 'GitHub Copilot', 'Antigravity']) {
    assert.ok(html.includes(`<span class="app-name">${app}</span>`), `Missing app cell: ${app}`);
  }

  // All multi-platform install commands + affiliate link
  assert.ok(html.includes('https://shopify-mcp.mktskills.com/mcp/shopify-skills'));
  assert.ok(html.includes('npx skills add vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('npx ctx7 skills install /vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('/add-plugin vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('agy plugin install https://github.com/vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main'));
  assert.ok(html.includes('https://shopify-mcp.mktskills.com/mcp'));
  assert.ok(html.includes('https://shopify.pxf.io/c/2227499/2974326/13624'));
  assert.ok(html.includes('rel="sponsored noopener noreferrer"'));
  assert.ok(html.includes('Shopify App Store review pending'));
  assert.doesNotMatch(html, /https:\/\/apps\.shopify\.com\//);
});

test('product page leaks zero internal filenames or skill slugs in visible text', () => {
  const html = renderProductPage(candidateConfig);
  const visible = stripToVisibleText(html);
  const forbiddenVisible = [
    'client-setup.md',
    'daily-work-plan.md',
    'product-listing-check.md',
    'catalog-review.md',
    'stock-review.md',
    'shopify-product-listing',
    'shopify-catalog-operations',
    'shopify-order-operations',
    'shopify-flow-automation',
    'shopify-theme-development',
    'SKILL.md',
    'references/',
  ];
  for (const leaked of forbiddenVisible) {
    assert.ok(!visible.includes(leaked), `Internal filename or slug leaked in visible text: ${leaked}`);
  }
});

test('product page and help page emit full Open Graph, Twitter Card, and valid JSON-LD matching FAQ word-for-word', () => {
  const html = renderProductPage(candidateConfig);
  const helpHtml = renderHelpPage(candidateConfig);

  for (const page of [html, helpHtml]) {
    assert.ok(page.includes('<meta property="og:title"'));
    assert.ok(page.includes('<meta property="og:description"'));
    assert.ok(page.includes('<meta property="og:image" content="https://mktskills.com/shopify-va/og-shopify-va.png"'));
    assert.ok(page.includes('<meta property="og:image:width" content="1200"'));
    assert.ok(page.includes('<meta property="og:image:height" content="630"'));
    assert.ok(page.includes('<meta name="twitter:card" content="summary_large_image"'));
    assert.ok(page.includes('<meta name="twitter:image" content="https://mktskills.com/shopify-va/og-shopify-va.png"'));
  }

  const ldMatch = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
  assert.ok(ldMatch, 'JSON-LD script missing on product page');
  const parsed = JSON.parse(ldMatch[1]) as { '@graph': Array<Record<string, unknown>> };
  const types = parsed['@graph'].map(node => node['@type']);
  assert.deepEqual(types, ['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage']);

  const appNode = parsed['@graph'].find(node => node['@type'] === 'SoftwareApplication')!;
  assert.equal(appNode.license, 'https://opensource.org/licenses/MIT');
  assert.deepEqual(appNode.offers, { '@type': 'Offer', price: '0', priceCurrency: 'USD' });

  const faqNode = parsed['@graph'].find(node => node['@type'] === 'FAQPage') as {
    mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
  };
  assert.equal(faqNode.mainEntity.length, 6);
  assert.equal(FAQ_ITEMS.length, 6);
  const visible = stripToVisibleText(html);
  for (let i = 0; i < FAQ_ITEMS.length; i++) {
    assert.equal(faqNode.mainEntity[i].name, FAQ_ITEMS[i].question);
    assert.equal(faqNode.mainEntity[i].acceptedAnswer.text, FAQ_ITEMS[i].answer);
    assert.ok(visible.includes(FAQ_ITEMS[i].question), `Visible FAQ missing question: ${FAQ_ITEMS[i].question}`);
    assert.ok(visible.includes(FAQ_ITEMS[i].answer), `Visible FAQ missing answer: ${FAQ_ITEMS[i].answer}`);
  }
});

test('OG image and llms.txt discovery routes return valid payloads', () => {
  for (const path of ['/og-shopify-va.png', '/shopify-va/og-shopify-va.png']) {
    const img = publicContent(path, candidateConfig);
    assert.ok(img && img.body instanceof Uint8Array, path);
    assert.equal(img.contentType, 'image/png');
    // PNG magic header bytes: 89 50 4E 47
    assert.deepEqual(Array.from(img.body.slice(0, 4)), [0x89, 0x50, 0x4e, 0x47]);
  }
  for (const path of ['/llms.txt', '/shopify-va/llms.txt']) {
    const llms = publicContent(path, candidateConfig);
    assert.ok(llms && typeof llms.body === 'string', path);
    assert.equal(llms.contentType, 'text/markdown; charset=utf-8');
    assert.ok(llms.body.includes('https://shopify-mcp.mktskills.com/mcp/shopify-skills'));
    assert.ok(llms.body.includes('merchant-center-next-pmax.md'));
    assert.ok(llms.body.includes('advantage-plus-capi.md'));
    assert.ok(llms.body.includes('checkout-extensibility-pixels.md'));
    assert.ok(llms.body.includes('multi-location-routing-markets.md'));
    assert.ok(llms.body.includes('official-flow-recipes.md'));
    assert.ok(llms.body.includes('chargeback-evidence.md'));
    assert.ok(llms.body.includes('shipping-3pl-exceptions.md'));
    assert.ok(llms.body.includes('launch-migration-bfcm.md'));
    assert.ok(llms.body.includes('app-stack-reviews.md'));
    assert.ok(llms.body.includes('subscriptions-multichannel.md'));
  }
  assert.ok(renderLlmsTxt(candidateConfig).includes('npx ctx7 skills install /vinceservidad/Shopify-Expert-AI-Skills'));
});

test('product page rejects invalid pluginDownloadUrl values', () => {
  const invalidUrls = [
    'https://evil.example.com/vinceservidad/Shopify-Expert-AI-Skills/releases/download/v0.2.2/shopify-va-toolkit-skills-only.plugin',
    `${RELEASE_PLUGIN_URL}?download=1`,
    `${RELEASE_PLUGIN_URL}#fragment`,
    'https://github.com/vinceservidad/Shopify-Expert-AI-Skills/releases/download/v0.2.2/custom-archive.zip',
  ];

  for (const badUrl of invalidUrls) {
    const html = renderProductPage({ ...candidateConfig, pluginDownloadUrl: badUrl });
    assert.ok(!html.includes(badUrl), `Unexpected invalid plugin URL emitted: ${badUrl}`);
    assert.ok(!html.includes('Download skills-only plugin'));
  }
});

test('help and privacy pages cover all install paths and Remote MCP accurately', () => {
  const helpHtml = renderHelpPage(candidateConfig);
  const privacyHtml = renderPrivacyPage(candidateConfig);

  assert.ok(helpHtml.includes('id="install-help"'));
  assert.ok(helpHtml.includes('npx skills add vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('npx ctx7 skills install /vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('https://shopify-mcp.mktskills.com/mcp/shopify-skills'));
  assert.ok(helpHtml.includes('claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('/add-plugin vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('agy plugin install https://github.com/vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('shopify-va.zip'));
  assert.ok(helpHtml.includes('MKT Skills — Shopify VA'));
  assert.ok(helpHtml.includes('Project instructions'));
  assert.ok(helpHtml.includes('codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main'));
  assert.ok(helpHtml.includes(`href="${RELEASE_PLUGIN_URL}"`));
  assert.ok(helpHtml.includes('id="store-connection"'));
  assert.ok(helpHtml.includes('https://shopify-mcp.mktskills.com/mcp'));
  assert.doesNotMatch(helpHtml, /https:\/\/apps\.shopify\.com\//);

  assert.ok(privacyHtml.includes('November 25, 2026'));
  assert.ok(privacyHtml.includes('read_products'));
  assert.ok(privacyHtml.includes('read_inventory'));
  assert.ok(privacyHtml.includes('read_orders'));
});

test('public pages exclude AI slop, medical jargon, and stale copy', () => {
  for (const html of [
    renderProductPage(candidateConfig),
    renderHelpPage(candidateConfig),
    renderPrivacyPage(candidateConfig),
  ]) {
    const visible = stripToVisibleText(html);
    for (const pattern of STALE_OR_SLOP_PATTERNS) {
      assert.doesNotMatch(visible, pattern, `Unexpected sloppy/medical/stale phrase matching ${pattern}`);
    }
  }
});

test('public pages and styles enforce strict design guardrails (0 webfonts, 13/15/18px body scale, 0 pills/eyebrows/purple/beige)', () => {
  for (const html of [
    renderProductPage(candidateConfig),
    renderHelpPage(candidateConfig),
    renderPrivacyPage(candidateConfig),
  ]) {
    assert.doesNotMatch(html, /class="[^"]*\b(?:eyebrow|stage-badge|install-tag|term-dots|callout|install-card|job-card)\b/);
    assert.doesNotMatch(html, /rel="preload"[^>]*as="font"/i);
    assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
  }
  assert.doesNotMatch(PUBLIC_STYLES, /@font-face/i);
  assert.doesNotMatch(PUBLIC_STYLES, /border-radius\s*:\s*999px/);
  assert.doesNotMatch(PUBLIC_STYLES, /#(?:f6f4ee|fffefb|e3dfd3|ebe8df|eeebe1|eeebe3|7e3bd0|c9a7ff)/i);
  for (const match of PUBLIC_STYLES.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)) {
    const px = Number(match[1]);
    assert.ok(px >= 13, `Found font-size < 13px: ${match[0]}`);
    assert.ok([13, 15, 18].includes(px), `Body font-size must be strictly 13px, 15px, or 18px (got ${match[0]})`);
  }
});

test('public pages preserve strict CSP invariants while permitting non-executable JSON-LD', () => {
  for (const path of ['/shopify-va', '/shopify-va/help', '/shopify-va/privacy']) {
    const content = publicContent(path, candidateConfig);
    assert.ok(content && typeof content.body === 'string', path);
    for (const tag of content.body.match(/<script\b[^>]*>/g) ?? []) {
      if (/type="application\/ld\+json"/.test(tag)) continue;
      assert.match(tag, /\ssrc="/, `${path}: executable inline script ${tag}`);
    }
    assert.doesNotMatch(content.body, /\sstyle="/, `${path}: inline style attribute`);
    assert.doesNotMatch(content.body, /\son[a-z]+="/, `${path}: inline event handler`);
    assert.doesNotMatch(content.body, /<style\b/, `${path}: inline style element`);
  }
});
