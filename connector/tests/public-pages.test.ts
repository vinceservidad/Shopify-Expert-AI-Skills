import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FAQ_ITEMS, PUBLIC_STYLES, renderHelpPage, renderLlmsTxt, renderPrivacyPage, renderProductPage, type PublicPageConfig } from '../src/public-pages.js';
import { publicContent } from '../src/public-routes.js';
import { SKILL_CATALOG, SKILL_GROUPS } from '../src/public-ui/skill-groups.js';

const RELEASE_PLUGIN_URL =
  'https://github.com/vinceservidad/Shopify-Expert-AI-Skills/releases/download/v0.2.4/shopify-va-toolkit-skills-only.plugin';

const candidateConfig: PublicPageConfig = {
  publicUrl: 'https://shopify-mcp.mktskills.com',
  basePath: '/shopify-va',
  launchStage: 'candidate',
  pluginDownloadUrl: RELEASE_PLUGIN_URL,
  openMcpUrl: 'https://mktskills.com/mcp/shopify-skills',
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
  /\b(?:delve|supercharge|game-changer|cutting-edge|synergy|holistic|revolutionize|unleash|effortlessly|streamline|empower|leverage|unlock|elevate|robust|harness|transformative)\b/i,
  /\b(?:highlighting|showcasing|underscoring|reflecting)\b/i,
  /\b(?:experts agree|studies show|What if I told you|Think about it:|Plot twist:|Opening a new store\?|What do you think\?|In conclusion)\b/i,
  /\bOverall,/,
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

test('product page brand, 4-item header, 3-tab hero setup, bottleneck table, 19-skill catalog, 4x2 apps grid, and setup drawer', () => {
  const html = renderProductPage(candidateConfig);

  // Header brand parity with mktskills.com + 4 clean nav links
  assert.ok(html.includes('<a class="setup-brand" href="https://mktskills.com/">Marketing Skills</a>'));
  assert.ok(html.includes('<a href="https://mktskills.com/">marketing/</a>'));
  assert.ok(html.includes('data-product="va" aria-current="page">shopify-va/</a>'));
  const navMatch = /<nav class="family-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(html);
  assert.ok(navMatch, 'family-nav missing');
  const navLinks = navMatch[1].match(/<a\b/g) ?? [];
  assert.equal(navLinks.length, 3, 'top nav should have exactly 3 links: Problems, Skills, How to set up');
  assert.ok(navMatch[1].includes('href="/shopify-va/setup">How to set up</a>'));

  // Above-the-fold trust highlights (<= 35 words, no hero KPI strip, no em-dashes)
  assert.ok(html.includes('19 free Shopify skills under the MIT license'));
  assert.ok(html.includes('approve every change in Shopify Admin.'));
  assert.doesNotMatch(stripToVisibleText(html), /—|\s–\s/, 'Product page generated copy must contain zero em-dashes or spaced en-dashes');
  assert.ok(html.includes('class="seg-tabs"'), 'Category filter must use connected segmented tabs');
  assert.ok(html.includes('class="apps-matrix"'), 'Supported AI apps must use unified hairline matrix');

  // Duplicate #how-it-works band removed; 3-tab hero workbench shows click paths above the fold
  assert.ok(!html.includes('id="how-it-works"'), 'duplicate #how-it-works section must be removed');
  const heroInstallMatch = /<div class="workbench" id="install" data-tabs="setup">[\s\S]*?<\/section>/.exec(html);
  assert.ok(heroInstallMatch, 'hero workbench missing');
  const heroInstall = heroInstallMatch[0];
  assert.ok(heroInstall.includes('for="wb-claude">Claude</label>'));
  assert.ok(heroInstall.includes('for="wb-chatgpt">ChatGPT</label>'));
  assert.ok(heroInstall.includes('for="wb-cli">Coding agents</label>'));
  assert.ok(heroInstall.includes('Settings → Connectors → Add custom connector'));
  assert.ok(heroInstall.includes('Settings → Apps &amp; Connectors'));
  assert.ok(heroInstall.includes('<a href="#setup">Step-by-step setup</a>'), 'hero must point to the on-page setup steps');

  // Setup steps live on the landing page without duplicating the MCP URL copy button; secondary methods stay in a collapsed drawer
  const setupMatch = /<section id="setup"[\s\S]*?<\/section>/.exec(html);
  assert.ok(setupMatch, 'landing setup section missing');
  const setup = setupMatch[0];
  assert.ok(setup.includes('<h2 id="setup-heading">How to set up</h2>'));
  assert.equal((setup.match(/<ol class="quick-setup">[\s\S]*?<\/ol>/)?.[0].match(/<li>/g) ?? []).length, 3, 'landing quick setup should have 3 steps');
  for (const step of ['Connect your AI', 'Try one product listing', 'Review before anything goes live']) {
    assert.ok(setup.includes(`<h3>${step}</h3>`), `Missing setup step: ${step}`);
  }
  assert.ok(!setup.includes('data-copy="https://mktskills.com/mcp/shopify-skills"'), '#setup must not duplicate the hero MCP URL copy button');
  assert.ok(setup.includes('Write one Shopify product title'), 'first prompt must be on the landing page');
  assert.ok(setup.includes('data-copy="Write one Shopify product title'), 'first prompt needs a copy button');
  assert.ok(setup.includes('<details class="setup-drawer">'), 'secondary install paths must sit inside a collapsed drawer');
  assert.ok(!setup.includes('<details class="setup-drawer" open>'), 'setup drawer must start collapsed');
  assert.ok(setup.includes('href="/shopify-va/setup">the setup guide</a>'), 'landing must still link the full setup guide');
  assert.ok(html.includes('releases/download/v0.2.4/shopify-va-toolkit-skills-only.plugin'));
  assert.ok(!html.includes('v0.2.2'), 'landing must not link the old v0.2.2 release');

  // Skills section opens on All (19 skills) with the category tabs still available
  assert.ok(html.includes('data-skill-cat="All" aria-pressed="true"'));
  assert.ok(html.includes('data-skill-cat="Catalog" aria-pressed="false"'));
  assert.equal((html.match(/data-skill-cat="[^"]*" aria-pressed="true"/g) ?? []).length, 1, 'exactly one skill tab is selected');
  assert.ok(html.includes('<span data-skill-status role="status">19 skills</span>'));
  assert.ok(!html.includes('5 of 19'));

  // Sample outputs and 7-stage sequence sections
  assert.ok(html.includes('id="examples"'));
  for (const id of ['ex-csv', 'ex-cb', 'ex-list']) {
    assert.ok(html.includes(`id="${id}"`), `Missing example tab input: ${id}`);
  }
  for (const tab of ['Messy CSV', 'Chargeback', 'New listing']) {
    assert.ok(html.includes(tab), `Missing example tab label: ${tab}`);
  }
  assert.ok(html.includes('id="sequence"'));
  assert.ok(html.includes('Research and segment'));
  assert.ok(html.includes('Reconcile and iterate'));

  // Bottleneck table & Sidekick comparison
  assert.ok(html.includes('id="bottlenecks"'));
  assert.ok(html.includes('<th scope="col">Problem</th>'));
  assert.ok(html.includes('Fix first'));
  assert.ok(html.includes('Check next'));
  // The store-job / plan-and-draft / make-the-change table was removed
  assert.ok(!html.includes('id="sidekick"'));
  assert.ok(!html.includes('What the skills do, and what happens in Shopify'));
  assert.ok(!html.includes('compare-table'));
  assert.ok(!html.includes('Make the approved change'));
  assert.ok(html.includes('Someone with store permissions applies each approved change in Shopify Admin'), 'FAQ must keep the apply-in-Admin boundary');
  // Common-problems copy buttons are quiet text buttons; the skill grid keeps its outlined ones
  const bottlenecks = html.slice(html.indexOf('id="bottlenecks"'), html.indexOf('id="skills"'));
  assert.equal((bottlenecks.match(/<button type="button" class="copy-btn copy-btn-text" data-copy=/g) ?? []).length, 10);
  assert.ok(!bottlenecks.includes('copy-btn-line'));
  assert.match(bottlenecks, /aria-label="Copy starter prompt: [^"]+"/);
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
  assert.ok(html.includes('https://mktskills.com/mcp/shopify-skills'));
  assert.ok(html.includes('npx skills add vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('npx ctx7 skills install /vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('/add-plugin vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('agy plugin install https://github.com/vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main'));
  assert.ok(html.includes('https://shopify-mcp.mktskills.com/mcp'));
  assert.ok(html.includes('https://shopify.pxf.io/c/2227499/2974326/13624'));
  assert.ok(html.includes('rel="sponsored noopener noreferrer"'));
  assert.ok(html.includes('waiting for Shopify App Store review'));
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
  assert.deepEqual(types, ['Organization', 'WebPage', 'BreadcrumbList', 'SoftwareApplication', 'FAQPage']);

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
    assert.equal(llms.contentType, 'text/plain; charset=utf-8');
    assert.ok(llms.body.includes('https://mktskills.com/mcp/shopify-skills'));
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
    assert.ok(llms.body.includes('skill-sequence.md'));
    assert.ok(llms.body.includes('deliverable-templates.md'));
    assert.ok(llms.body.includes('official-meta-methods.md'));
    assert.ok(llms.body.includes('official-google-methods.md'));
    assert.ok(llms.body.includes('deliverability-sms-compliance.md'));
    assert.ok(llms.body.includes('technical-seo-standards.md'));
    assert.ok(llms.body.includes('experiment-validity-friction.md'));
    assert.ok(llms.body.includes('ftc-endorsement-compliance.md'));
    assert.ok(llms.body.includes('proof-compliance-mobile-ux.md'));
    assert.ok(llms.body.includes('shopify-analytics-ga4-consent.md'));
    assert.ok(llms.body.includes('performance-accessibility-extensions.md'));
    assert.ok(llms.body.includes('taxonomy-compliance.md'));
    assert.ok(llms.body.includes('high-variant-combined-listings.md'));
    assert.ok(llms.body.includes('search-discovery-bundles.md'));
    assert.doesNotMatch(llms.body, /—|\s–\s/, 'llms.txt must contain zero em-dashes or spaced en-dashes');
  }
  assert.ok(renderLlmsTxt(candidateConfig).includes('npx ctx7 skills install /vinceservidad/Shopify-Expert-AI-Skills'));
});

test('product page rejects invalid pluginDownloadUrl values', () => {
  const invalidUrls = [
    'https://evil.example.com/vinceservidad/Shopify-Expert-AI-Skills/releases/download/v0.2.4/shopify-va-toolkit-skills-only.plugin',
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
  assert.ok(helpHtml.includes('https://mktskills.com/mcp/shopify-skills'));
  assert.ok(helpHtml.includes('data-copy="https://mktskills.com/mcp/shopify-skills"'));
  assert.ok(helpHtml.includes('data-copy="Write one Shopify product title'));
  assert.ok(helpHtml.includes('claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('/add-plugin vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('agy plugin install https://github.com/vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('shopify-va.zip'));
  assert.ok(helpHtml.includes('Anthropic Plugin Directory listing'));
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

test('public pages exclude AI slop, mid-sentence bold, medical jargon, and stale copy', () => {
  for (const html of [
    renderProductPage(candidateConfig),
    renderHelpPage(candidateConfig),
    renderPrivacyPage(candidateConfig),
  ]) {
    assert.doesNotMatch(html, /<(p|li)\b[^>]*>(?:(?!<\/\1>)[\s\S])*?<strong\b/i, 'Paragraphs and list items must not contain mid-sentence bold');
    const visible = stripToVisibleText(html);
    assert.doesNotMatch(visible, /—|\s–\s/, 'Public pages must contain zero em-dashes or spaced en-dashes');
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
  assert.doesNotMatch(PUBLIC_STYLES, /transition\s*:\s*all\b/i);
  assert.doesNotMatch(PUBLIC_STYLES, /border-radius\s*:\s*999px/);
  assert.doesNotMatch(PUBLIC_STYLES, /#(?:f6f4ee|fffefb|e3dfd3|ebe8df|eeebe1|eeebe3|7e3bd0|c9a7ff)/i);
  for (const match of PUBLIC_STYLES.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)) {
    const px = Number(match[1]);
    assert.ok(px >= 13, `Found font-size < 13px: ${match[0]}`);
    assert.ok([13, 15, 18].includes(px), `Body font-size must be strictly 13px, 15px, or 18px (got ${match[0]})`);
  }
});

test('public pages preserve strict CSP invariants while permitting non-executable JSON-LD', () => {
  for (const path of ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy']) {
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

test('example panel classes do not collide with the bullet lists inside them', () => {
  const html = renderProductPage(candidateConfig);
  // "New listing" uses the panel class ex-list; selecting it must reveal only its own panel, so no other
  // element may carry that class (a shared class made every panel's bullet list show at once).
  assert.equal((html.match(/class="[^"]*\bex-list\b[^"]*"/g) ?? []).length, 1);
  assert.equal((html.match(/<ul class="ex-points">/g) ?? []).length, 3);
});
