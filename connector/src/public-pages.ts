import { WORKFLOWS } from './workflows.js';
import { APP_HOME_SCRIPT } from './public-ui/app-home.js';
import { PUBLIC_STYLES } from './public-ui/styles.js';
import { THEME_SCRIPT } from './public-ui/theme.js';
import { HERO_SCRIPT } from './public-ui/hero-canvas.js';
import { SEQUENCE_SCRIPT } from './public-ui/sequence-canvas.js';
import { SKILL_CATALOG, SKILL_CATEGORIES, SKILL_COUNT } from './public-ui/skill-groups.js';
import { FAVICON_DATA_URI } from './public-ui/favicon.js';
import { SKILL_DOCS, SKILL_DOCS_UPDATED } from './public-ui/skill-docs.js';

export { APP_HOME_SCRIPT, HERO_SCRIPT, PUBLIC_STYLES, SEQUENCE_SCRIPT, THEME_SCRIPT };

export type PublicPageConfig = {
  publicUrl?: string;
  appHandle?: string;
  basePath?: string;
  launchStage?: 'candidate' | 'public';
  /** Set only after the exact versioned GitHub release asset exists and was checked. */
  pluginDownloadUrl?: string;
  /** The advertised no-login MCP link, when it is served on another origin than publicUrl. */
  openMcpUrl?: string;
};
export type PageConfig = PublicPageConfig;
export type AppHomeConfig = { clientId: string; publicUrl: string; appHandle?: string };

const SITE_ORIGIN = 'https://mktskills.com';
const FAMILY_HOME = `${SITE_ORIGIN}/`;
const OG_IMAGE_URL = `${SITE_ORIGIN}/shopify-va/og-shopify-va.png`;
const LOGO_URL = `${SITE_ORIGIN}/brand/mkt-skills-512.png`;
const REPOSITORY = 'https://github.com/vinceservidad/Shopify-Expert-AI-Skills';
const AUTHOR = 'https://www.vinceservidad.com/';
const SHOPIFY_AFFILIATE = 'https://shopify.pxf.io/c/2227499/2974326/13624';
const DEFAULT_MCP_URL = 'https://shopify-mcp.mktskills.com/mcp';
const DEFAULT_OPEN_MCP_URL = 'https://mktskills.com/mcp/shopify-skills';
const CLI_ADD_CMD = 'npx skills add vinceservidad/Shopify-Expert-AI-Skills';
const CTX7_ADD_CMD = 'npx ctx7 skills install /vinceservidad/Shopify-Expert-AI-Skills';
const CLAUDE_PLUGIN_CMD = 'claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills';
const CLAUDE_SESSION_CMD = '/plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills';
const CURSOR_PLUGIN_CMD = '/add-plugin vinceservidad/Shopify-Expert-AI-Skills';
const AGY_PLUGIN_CMD = `agy plugin install ${REPOSITORY}`;
const CODEX_MARKETPLACE_CMD = 'codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main';
const CODEX_PLUGIN_CMD = 'codex plugin add shopify-va-toolkit@shopify-skills';
const RELEASE_VERSION = 'v0.2.4';
const RELEASE_TAG_URL = `${REPOSITORY}/releases/tag/${RELEASE_VERSION}`;
const RELEASE_DOWNLOAD_BASE = `${REPOSITORY}/releases/download/${RELEASE_VERSION}`;
const STARTER_SKILL_ZIP_URL = `${RELEASE_DOWNLOAD_BASE}/shopify-va.zip`;
const PRODUCT_LISTING_ZIP_URL = `${RELEASE_DOWNLOAD_BASE}/shopify-product-listing.zip`;
const SOURCE_ZIP = `${REPOSITORY}/archive/refs/heads/main.zip`;
const SUPPORT = 'support@mktskills.com';

const escape = (value: string) =>
  value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
const sourceFile = (path: string) => `${REPOSITORY}/blob/main/${path}`;
const sourceCandidateFile = (path: string) => `${REPOSITORY}/blob/feat/cloudflare-hosted-mcp/${path}`;

// Titles stay under 60 characters with the topic first; descriptions stay under 160 (pinned by tests/public-seo.test.ts).
const PRODUCT_TITLE = 'Shopify Skills for AI Agents | Marketing Skills';
const PRODUCT_DESCRIPTION =
  '19 free MIT-licensed Shopify skills for ChatGPT, Claude, and coding agents. Your AI app drafts the store work, and you approve every change in Shopify Admin.';
const HELP_TITLE = 'Shopify Skills Setup for AI Agents | Marketing Skills';
const HELP_DESCRIPTION =
  'Add 19 free Shopify skills to ChatGPT, Claude, or a coding agent in four steps, with every install command and fixes for common setup problems.';
const PRIVACY_TITLE = 'Shopify Skills Privacy Notice | Marketing Skills';
const PRIVACY_DESCRIPTION =
  'What the read-only Shopify skills MCP server reads, what it stores, how long it keeps it, and how store owners remove access.';
const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
const MARKETING_WEBSITE_ID = `${SITE_ORIGIN}/#website`;
const OG_IMAGE_ALT = 'Shopify Skills for AI Agents: 19 free MIT-licensed skills for ChatGPT, Claude, and coding agents';

type BottleneckRow = {
  problem: string;
  fixFirst: string;
  checkNext: string;
  prompt: string;
};

const BOTTLENECKS: readonly BottleneckRow[] = [
  {
    problem: 'New products take hours to write',
    fixFirst: 'Product Listings',
    checkNext: 'Product Pages, Shopify SEO',
    prompt: 'Write a Shopify product title, short description, and three bullets using only my product specs. Ask about missing facts first and do not publish.',
  },
  {
    problem: 'Messy tags, prices, or stock counts',
    fixFirst: 'Catalog & Inventory',
    checkNext: 'Merchandising, Store Audit',
    prompt: 'Check my Shopify product CSV for missing prices, blank inventory, and messy tags. Give me a fix plan before I import it.',
  },
  {
    problem: 'Shoppers view products but don\'t buy',
    fixFirst: 'Product Pages',
    checkNext: 'Conversion Rate (CRO), Store Audit',
    prompt: 'Review this Shopify product page on mobile. List the top three issues stopping buyers and draft clearer copy.',
  },
  {
    problem: 'Split shipments, shipping errors, or stuck 3PL orders',
    fixFirst: 'Order Operations',
    checkNext: 'Shopify Flow, Customer Support',
    prompt: 'Check our Shopify shipping profiles, Markets routing, and stuck 3PL orders. Show why orders split or fail checkout and write a fix plan.',
  },
  {
    problem: 'A chargeback response is due soon',
    fixFirst: 'Order Operations',
    checkNext: 'Customer Support, Store Audit',
    prompt: 'Build a factual Shopify Payments chargeback evidence packet from these order timestamps, carrier delivery scans, and support emails.',
  },
  {
    problem: 'More support tickets or subscription cancellations',
    fixFirst: 'Customer Support',
    checkNext: 'Order Operations, Email & SMS Flows',
    prompt: 'Draft calm replies for these customer and subscription tickets using only our shipping and return rules. Flag any policy gaps first.',
  },
  {
    problem: 'A launch, migration, or Black Friday sale is coming up',
    fixFirst: 'Store Audit',
    checkNext: 'Merchandising, Theme Development',
    prompt: 'Run a launch and Black Friday Cyber Monday (BFCM) readiness check on our Shopify store. Cover URL redirects, discount combinations, safety stock, and mobile checkout.',
  },
  {
    problem: 'Too many apps, a slow mobile store, or TikTok Shop sync errors',
    fixFirst: 'Catalog & Inventory',
    checkNext: 'Store Audit, Theme Development',
    prompt: 'Audit our installed Shopify apps, product review spam rules, and SKU sync for TikTok Shop and the Shop App. List the lowest-risk fixes first.',
  },
  {
    problem: 'Shopping ads get disapproved or waste spend',
    fixFirst: 'Google Ads & Shopping',
    checkNext: 'Store Analytics, Product Listings',
    prompt: 'Review our Google Merchant Center feed and Shopping campaigns. Find price mismatches, missing GTINs, and products that should sit in separate margin groups.',
  },
  {
    problem: 'Meta ads spend money but tracking is unreliable',
    fixFirst: 'Meta Ads',
    checkNext: 'Ad Creative Strategy, Theme Development',
    prompt: 'Check our Meta Advantage+ campaigns, Conversions API Event Match Quality, and creative mix. Tell me what to fix before we raise the budget.',
  },
];

const SUPPORTED_APPS: readonly { name: string; mode: string }[] = [
  { name: 'ChatGPT', mode: 'Paste the connector link' },
  { name: 'Claude', mode: 'Paste the connector link' },
  { name: 'Claude Code', mode: 'CLI or GitHub plugin' },
  { name: 'OpenAI Codex', mode: 'Plugin or CLI' },
  { name: 'Cursor', mode: 'Plugin or CLI' },
  { name: 'Windsurf', mode: 'CLI' },
  { name: 'GitHub Copilot', mode: 'CLI' },
  { name: 'Antigravity', mode: 'Plugin or CLI' },
];

type SampleOutput = {
  id: 'ex-csv' | 'ex-cb' | 'ex-list';
  tab: string;
  skill: string;
  inputText: string;
  outputPoints: readonly string[];
};

const SAMPLE_OUTPUTS: readonly SampleOutput[] = [
  {
    id: 'ex-csv',
    tab: 'Messy CSV',
    skill: 'Catalog & Inventory',
    inputText: 'Product export CSV with 4 rows: 2 price updates, 1 blank inventory count, and 1 variant missing a SKU.',
    outputPoints: [
      'Splits the file into 2 safe rows for a pilot test and 2 blocked rows.',
      'Prevents the blank inventory cell from resetting live stock to 0.',
      'Returns a before-and-after rollback table you review before importing.',
    ],
  },
  {
    id: 'ex-cb',
    tab: 'Chargeback',
    skill: 'Order Operations',
    inputText: 'Order #4812 payment timestamps, carrier delivery scans, checkout policy URL, and two customer support emails.',
    outputPoints: [
      'Builds a factual Shopify Payments evidence packet with AVS, CVV, and delivery timestamps.',
      'Quotes the exact checkout return and shipping terms active on the order date.',
      'Flags a missing signed delivery receipt before you submit the response.',
    ],
  },
  {
    id: 'ex-list',
    tab: 'New listing',
    skill: 'Product Listings',
    inputText: 'Supplier sheet for a 500 ml stainless steel travel mug. Product weight and dishwasher rules are missing.',
    outputPoints: [
      'Drafts the product title, short description, and three bullets from confirmed facts only.',
      'Lists product weight and care rules as questions for the store owner instead of guessing.',
      'Keeps the draft unsaved until the store owner confirms pricing and stock.',
    ],
  },
];

const SKILL_SEQUENCE: readonly { step: string; stage: string; skills: string; gate: string }[] = [
  {
    step: '01',
    stage: 'Research and segment',
    skills: 'Product Research',
    gate: 'Confirm buyer demand, segments, competitors, and landed cost before creating listings.',
  },
  {
    step: '02',
    stage: 'Target and product truth',
    skills: 'Product Listings, Catalog & Inventory, Merchandising',
    gate: 'Lock confirmed specs, SKU structure, collections, and pricing before building pages.',
  },
  {
    step: '03',
    stage: 'Storefront and tracking',
    skills: 'Product Pages, Theme Development, Store Audit, Conversion Rate (CRO)',
    gate: 'Fix mobile product pages, Checkout Extensibility, Web Pixels, and speed before paid traffic.',
  },
  {
    step: '04',
    stage: 'Operations and guardrails',
    skills: 'Order Operations, Shopify Flow, Customer Support',
    gate: 'Verify shipping profiles, 3PL routing, fraud holds, and return rules before order spikes.',
  },
  {
    step: '05',
    stage: 'Retention and organic',
    skills: 'Email & SMS Flows, Shopify SEO',
    gate: 'Turn on welcome, abandoned cart, and post-purchase flows, and fix collection SEO, before you pay for traffic.',
  },
  {
    step: '06',
    stage: 'Creative and paid ads',
    skills: 'Ad Creative Strategy, Google Ads & Shopping, Meta Ads',
    gate: 'Build review-backed hooks, Merchant Center feeds, and Advantage+ campaigns after tracking passes.',
  },
  {
    step: '07',
    stage: 'Reconcile and iterate',
    skills: 'Store Analytics, Daily Store Coordinator',
    gate: 'Reconcile Shopify net sales, refunds, and profit after ad spend before scaling.',
  },
];

export const FAQ_ITEMS: readonly { question: string; answer: string }[] = [
  {
    question: 'What are Shopify skills for AI agents?',
    answer:
      'Shopify skills are instruction files that your AI app loads before doing store work. Each one tells your AI app which facts to ask the store owner for first and which Shopify rules to check. Together, the 19 skills cover catalog work, order operations, paid ads, and theme code.',
  },
  {
    question: 'Are these Shopify skills free?',
    answer:
      'Yes. All 19 skills are open source under the MIT license, and you can read every file on GitHub before installing. No account or credit card is needed.',
  },
  {
    question: 'Which AI apps work with Shopify VA Skills?',
    answer:
      'In ChatGPT and Claude, you paste the connector link into a new custom connector. Most coding agents, including Claude Code, OpenAI Codex, and Cursor, install all 19 skills with a single CLI command.',
  },
  {
    question: 'Do I need to connect my live Shopify store?',
    answer:
      'No. Paste product specs, CSV exports, support tickets, or ad reports into the chat, and the skills work from what you paste. The read-only live store connection is optional.',
  },
  {
    question: 'Can these skills change my store, prices, or orders?',
    answer:
      'No. The skills and the live store connection only read data and write drafts. Someone with store permissions applies each approved change in Shopify Admin or the ad platform.',
  },
  {
    question: 'How do I know which skill to use first?',
    answer:
      'Describe the store problem in plain words, like "our stock counts are wrong," and your AI app picks the skill. You don\'t need to know the skill names.',
  },
];

const firstRequest = `Write one Shopify product title, a short description, and three clear bullet points.
Use only these approved facts. Ask about missing facts first. Do not save or publish anything.

Product name: [name]
Approved facts: [materials, size, features, and confirmed details]
Target buyer: [who uses it, if known]
Brand tone: [for example, warm and simple]

Return the draft, missing facts, and a short review checklist.`;

function appLink(config: PublicPageConfig): string | undefined {
  return config.appHandle && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(config.appHandle)
    ? `https://apps.shopify.com/${config.appHandle}` : undefined;
}

function mcpEndpoint(config: PublicPageConfig): string {
  if (!config.publicUrl) return DEFAULT_MCP_URL;
  try { return `${new URL(config.publicUrl).origin}/mcp`; } catch { return DEFAULT_MCP_URL; }
}

function openMcpEndpoint(config: PublicPageConfig): string {
  if (config.openMcpUrl) return config.openMcpUrl;
  if (!config.publicUrl) return DEFAULT_OPEN_MCP_URL;
  try { return `${new URL(config.publicUrl).origin}/mcp/shopify-skills`; } catch { return DEFAULT_OPEN_MCP_URL; }
}

function releaseLink(config: PublicPageConfig): string | undefined {
  if (!config.pluginDownloadUrl) return undefined;
  try {
    const url = new URL(config.pluginDownloadUrl);
    return url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password
      && !url.search && !url.hash && /^\/vinceservidad\/Shopify-Expert-AI-Skills\/releases\/download\/[^/]+\/[^/]+\.plugin$/.test(url.pathname)
      ? url.href : undefined;
  } catch { return undefined; }
}

function pagePath(config: PublicPageConfig, suffix = ''): string {
  const base = config.basePath && /^\/[a-z0-9][a-z0-9/-]*[a-z0-9]$/.test(config.basePath) && !config.basePath.includes('//') ? config.basePath : '/shopify-va';
  return `${base}${suffix}`;
}

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

type PageKey = 'guide' | 'setup' | 'privacy';
const PAGES: Record<PageKey, { path: string; name: string; title: string; description: string; crumb: string }> = {
  guide: { path: '/shopify-va', name: 'Shopify VA', title: PRODUCT_TITLE, description: PRODUCT_DESCRIPTION, crumb: 'Shopify VA' },
  setup: { path: '/shopify-va/setup', name: 'Setup', title: HELP_TITLE, description: HELP_DESCRIPTION, crumb: 'Setup' },
  privacy: { path: '/shopify-va/privacy', name: 'Privacy', title: PRIVACY_TITLE, description: PRIVACY_DESCRIPTION, crumb: 'Privacy' },
};

/** Breadcrumb trail: Marketing Skills > Shopify VA, then Setup or Privacy on the sub-pages. */
function breadcrumbTrail(page: PageKey): { name: string; url: string }[] {
  const trail = [{ name: 'Marketing Skills', url: FAMILY_HOME }, { name: PAGES.guide.crumb, url: `${SITE_ORIGIN}${PAGES.guide.path}` }];
  if (page !== 'guide') trail.push({ name: PAGES[page].crumb, url: `${SITE_ORIGIN}${PAGES[page].path}` });
  return trail;
}

/**
 * schema.org JSON-LD for each page. Only facts visible on the page or in the repository are used: no ratings,
 * reviews, counts of users, or dates that are not generated from source. The Organization shares the marketing
 * site's @id so both sites describe one entity; WebPage points at that site's WebSite by @id.
 */
function pageJsonLd(page: PageKey): string {
  const url = `${SITE_ORIGIN}${PAGES[page].path}`, webPageId = `${url}#webpage`, appId = `${SITE_ORIGIN}/shopify-va#software`;
  const trail = breadcrumbTrail(page);
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization', '@id': ORGANIZATION_ID, name: 'Marketing Skills', alternateName: 'MKT Skills', url: FAMILY_HOME, logo: LOGO_URL,
      founder: { '@type': 'Person', name: 'Vince Servidad', url: AUTHOR }, sameAs: [REPOSITORY],
    },
    {
      '@type': 'WebPage', '@id': webPageId, url, name: PAGES[page].title,
      description: PAGES[page].description, inLanguage: 'en',
      isPartOf: { '@id': MARKETING_WEBSITE_ID }, publisher: { '@id': ORGANIZATION_ID },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE_URL, width: 1200, height: 630 },
      ...(page === 'guide' ? { about: { '@id': appId }, mainEntity: { '@id': appId } } : { about: { '@id': appId } }),
    },
    {
      '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
      itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
    },
  ];
  if (page === 'guide') {
    graph.push(
      {
        '@type': 'SoftwareApplication', '@id': appId, name: 'Shopify VA Skills', url,
        description: PRODUCT_DESCRIPTION, applicationCategory: 'BusinessApplication', operatingSystem: 'Any',
        isAccessibleForFree: true, license: 'https://opensource.org/licenses/MIT', inLanguage: 'en',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: SKILL_CATALOG.map(skill => skill.name),
        author: { '@type': 'Person', name: 'Vince Servidad', url: AUTHOR }, publisher: { '@id': ORGANIZATION_ID },
        softwareHelp: { '@type': 'WebPage', url: `${SITE_ORIGIN}${PAGES.setup.path}` },
      },
      {
        '@type': 'FAQPage', '@id': `${url}#faq`,
        mainEntity: FAQ_ITEMS.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
      },
    );
  }
  return safeJsonLd({ '@context': 'https://schema.org', '@graph': graph });
}

/** Visible trail matching the BreadcrumbList JSON-LD (Marketing Skills > Shopify VA > Setup). */
function breadcrumbNav(config: PublicPageConfig, page: PageKey): string {
  const trail = breadcrumbTrail(page);
  const items = trail.map((item, index) => index === trail.length - 1
    ? `<li aria-current="page">${escape(item.name)}</li>`
    : `<li><a href="${index === 0 ? item.url : pagePath(config)}">${escape(item.name)}</a></li>`).join('');
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

type LayoutMeta = {
  page: PageKey;
  hasHero?: boolean;
  hasSequence?: boolean;
  currentNav?: 'setup';
};

/** The heading face and the body 400 face are used above the fold on every page, so they are preloaded.
 *  Font preloads need crossorigin even on the same origin, or the browser fetches the file twice. */
export const PRELOADED_FONTS = ['schibsted-grotesk-latin-wght-normal.woff2', 'ibm-plex-sans-latin-400-normal.woff2'] as const;
function fontPreloads(config: PublicPageConfig): string {
  return PRELOADED_FONTS.map(file => `<link rel="preload" href="${pagePath(config, `/assets/fonts/${file}`)}" as="font" type="font/woff2" crossorigin>`).join('');
}

function layout(meta: LayoutMeta, content: string, config: PublicPageConfig): string {
  const { title, description } = PAGES[meta.page], canonical = `${SITE_ORIGIN}${PAGES[meta.page].path}`;
  const socialTags = `<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:site_name" content="Marketing Skills"><meta property="og:type" content="website"><meta property="og:locale" content="en_US"><meta property="og:image" content="${OG_IMAGE_URL}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(OG_IMAGE_ALT)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${OG_IMAGE_URL}"><meta name="twitter:image:alt" content="${escape(OG_IMAGE_ALT)}">`;
  // JSON-LD is a data block, not executable script, so script-src is unaffected and no inline script is added.
  const ldTag = `<script type="application/ld+json">${pageJsonLd(meta.page)}</script>`;
  const heroScript = meta.hasHero ? `<script src="${pagePath(config, '/assets/hero.js')}" defer></script>` : '';
  const sequenceScript = meta.hasSequence ? `<script src="${pagePath(config, '/assets/sequence.js')}" defer></script>` : '';
  return `<!doctype html><html lang="en" class="site"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="author" content="Vince Servidad"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="theme-color" content="#15191a"><meta name="color-scheme" content="dark"><link rel="canonical" href="${escape(canonical)}">${socialTags}<link rel="icon" href="${FAVICON_DATA_URI}" type="image/png" sizes="32x32">${ldTag}<script src="${pagePath(config, '/assets/theme.js')}" defer></script>${heroScript}${sequenceScript}${fontPreloads(config)}<link rel="stylesheet" href="${pagePath(config, '/assets/public.css')}"></head><body${meta.hasHero ? ' class="has-hero"' : ''}><a class="skip-link" href="#main">Skip to content</a><div class="top-bar"><header class="family-header shell"><a class="setup-brand" href="${FAMILY_HOME}">Marketing Skills</a><nav class="family-tabs" aria-label="Marketing Skills products"><a href="${FAMILY_HOME}">marketing/</a><a href="${pagePath(config)}" data-product="va" aria-current="page">shopify-va/</a></nav><nav class="family-nav" aria-label="Site"><a href="${pagePath(config, '#bottlenecks')}">Problems</a><a href="${pagePath(config, '#skills')}">Skills</a><a href="${pagePath(config, '/setup')}"${meta.currentNav === 'setup' ? ' aria-current="page"' : ''}>How to set up</a></nav></header></div><main id="main">${content}</main><div class="footer-band"><footer class="site-footer shell"><p>Independent open-source project by <a href="${AUTHOR}">Vince Servidad</a>. Not affiliated with Shopify. We may earn a commission if you sign up for Shopify through our links.</p><nav aria-label="Footer navigation"><a href="${FAMILY_HOME}">Marketing Skills</a><a href="${SHOPIFY_AFFILIATE}" target="_blank" rel="sponsored noopener noreferrer">Start a free Shopify trial</a><a href="${pagePath(config, '/setup')}">How to set up</a><a href="${pagePath(config, '/privacy')}">Privacy</a><a href="${pagePath(config, '/llms.txt')}">llms.txt</a><a href="${REPOSITORY}">GitHub</a><a href="${REPOSITORY}/blob/main/LICENSE">MIT License</a></nav></footer></div></body></html>`;
}

function heroWorkbench(openMcpUrl: string, guideUrl: string): string {
  return `<div class="workbench" id="install" data-tabs="setup">
    <input class="wb-radio" type="radio" name="wb" id="wb-claude" checked>
    <input class="wb-radio" type="radio" name="wb" id="wb-chatgpt">
    <input class="wb-radio" type="radio" name="wb" id="wb-cli">
    <div class="wb-tabs" data-tablist aria-label="Quick setup">
      <label for="wb-claude">Claude</label>
      <label for="wb-chatgpt">ChatGPT</label>
      <label for="wb-cli">Coding agents</label>
    </div>
    <div class="wb-panels">
      <div class="wb-panel wb-claude" data-tabpanel>
        <div class="wb-row"><code>${escape(openMcpUrl)}</code><button type="button" class="copy-btn" data-copy="${escape(openMcpUrl)}" hidden>Copy link</button></div>
        <p class="wb-note">Open Settings → Connectors → Add custom connector, paste this link, and save.</p>
        <div class="wb-links"><a href="#setup">Step-by-step setup</a><a href="${guideUrl}">Troubleshooting</a></div>
      </div>
      <div class="wb-panel wb-chatgpt" data-tabpanel>
        <div class="wb-row"><code>${escape(openMcpUrl)}</code><button type="button" class="copy-btn" data-copy="${escape(openMcpUrl)}" hidden>Copy link</button></div>
        <p class="wb-note">Open Settings → Apps &amp; Connectors and add a custom connector with this link (some plans need Developer mode on).</p>
        <div class="wb-links"><a href="#setup">Step-by-step setup</a><a href="${guideUrl}">Troubleshooting</a></div>
      </div>
      <div class="wb-panel wb-cli" data-tabpanel>
        <div class="wb-row"><code>${CLI_ADD_CMD}</code><button type="button" class="copy-btn" data-copy="${CLI_ADD_CMD}" hidden>Copy command</button></div>
        <p class="wb-note">Installs all ${SKILL_COUNT} skills in Claude Code, Codex, Cursor, and other coding agents.</p>
        <div class="wb-links"><a href="#setup">Step-by-step setup</a><a href="${guideUrl}">Troubleshooting</a></div>
      </div>
    </div>
  </div>`;
}

function sampleOutputsSection(): string {
  const radios = SAMPLE_OUTPUTS.map(
    (item, index) => `<input class="ex-radio" type="radio" name="ex" id="${item.id}"${index === 0 ? ' checked' : ''}>`,
  ).join('');
  const labels = SAMPLE_OUTPUTS.map(item => `<label for="${item.id}">${escape(item.tab)}</label>`).join('');
  const panels = SAMPLE_OUTPUTS.map(
    item => `<div class="ex-panel ${item.id}" data-tabpanel><p class="ex-label">What you paste <span>(${escape(item.skill)})</span></p><p class="ex-input">${escape(item.inputText)}</p><p class="ex-label">What your AI app returns</p><ul class="ex-points">${item.outputPoints.map(point => `<li>${escape(point)}</li>`).join('')}</ul></div>`,
  ).join('');
  return `<div class="ex-box" data-tabs="examples">${radios}<div class="ex-tabs-wrap"><div class="ex-tabs" data-tablist aria-label="Sample tasks">${labels}</div></div><div class="ex-panels">${panels}</div></div>`;
}

function sequenceSection(): string {
  const rows = SKILL_SEQUENCE.map(
    (row, index) => `<li class="seq-item" id="seq-${index + 1}"><span class="seq-num">${row.step}</span><span class="seq-stage">${escape(row.stage)}</span><span class="seq-skills">${escape(row.skills)}</span><span class="seq-gate">${escape(row.gate)}</span></li>`,
  ).join('');
  const gates = SKILL_SEQUENCE.map((row, index) => `<a href="#seq-${index + 1}" data-seq-label aria-label="Stage ${index + 1}: ${escape(row.stage)}">${row.step}</a>`).join('');
  const strip = `<div class="seq-strip" data-seq-strip><canvas class="seq-canvas" data-seq-canvas aria-hidden="true"></canvas><nav class="seq-gates" aria-label="Jump to a stage">${gates}</nav></div>`;
  return `${strip}<ol class="sequence-list">${rows}</ol>`;
}

const COPY_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5"/></svg>';

function bottleneckTable(): string {
  const rows = BOTTLENECKS.map(
    row => `<tr><td class="bn-problem">${escape(row.problem)}<span class="bn-sub">Fix first: ${escape(row.fixFirst)}. Check next: ${escape(row.checkNext)}.</span></td><td class="bn-first">${escape(row.fixFirst)}</td><td class="bn-next">${escape(row.checkNext)}</td><td class="bn-action"><button type="button" class="copy-btn copy-btn-text" data-copy="${escape(row.prompt)}" aria-label="Copy starter prompt: ${escape(row.problem)}">${COPY_ICON}Copy prompt</button></td></tr>`,
  ).join('');
  return `<div class="table-wrap"><table class="bottleneck-table"><thead><tr><th scope="col">Problem</th><th scope="col">Fix first</th><th scope="col">Check next</th><th scope="col">Starter prompt</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function skillCatalogSection(): string {
  const tabs = ['All', ...SKILL_CATEGORIES]
    .map(
      (cat, index) =>
        `<button type="button" class="seg-tab" data-skill-cat="${escape(cat)}" aria-pressed="${index === 0 ? 'true' : 'false'}">${escape(cat)}</button>`,
    )
    .join('');
  const items = SKILL_CATALOG.map(
    skill => `<article class="skill-entry" data-skill-card data-cat="${escape(skill.category)}"><div class="skill-text"><div><h3>${escape(skill.name)}</h3><span class="skill-cat">${escape(skill.category)}</span></div><p>${escape(skill.summary)}</p></div><div class="skill-actions"><button type="button" class="copy-btn copy-btn-line" data-copy="${escape(skill.prompt)}">Copy prompt</button><a class="skill-gh" href="${sourceFile(`skills/${skill.slug}/SKILL.md`)}"><span>Read<span class="sr-only"> ${escape(skill.name)}</span> on GitHub</span></a></div></article>`,
  ).join('');
  return `<div class="catalog-controls" data-skill-filter-wrap hidden><div class="seg-tabs" role="group" aria-label="Filter skills by category">${tabs}</div><div class="skill-filter"><input type="search" data-skill-filter placeholder="Search skills (stock, ads, Flow)" aria-label="Search Shopify skills"><span data-skill-status role="status">${SKILL_COUNT} skills</span></div></div><div class="skill-index">${items}</div><div class="skill-empty" data-skill-empty hidden><p>No skills match <span class="skill-empty-q" data-skill-empty-query></span>.</p><button type="button" class="copy-btn copy-btn-line" data-skill-reset>Show all skills</button></div>`;
}

function cmdItem(label: string, note: string, command: string, id?: string): string {
  return `<div class="cmd-item"${id ? ` id="${id}"` : ''}><div class="cmd-label"><strong>${escape(label)}</strong><span>${escape(note)}</span></div><code class="cmd-code">${escape(command)}</code><button type="button" class="copy-btn copy-btn-line" data-copy="${escape(command)}" aria-label="Copy ${escape(label)} command: ${escape(note)}" hidden>Copy</button></div>`;
}

function cmdRow(command: string, label: string): string {
  return `<div class="cmd-row"><code class="cmd-code">${escape(command)}</code><button type="button" class="copy-btn copy-btn-line" data-copy="${escape(command)}" aria-label="Copy ${escape(label)}" hidden>Copy</button></div>`;
}

function supportedAppsMatrix(): string {
  return `<div class="apps-matrix">${SUPPORTED_APPS.map(
    app => `<div class="app-cell"><span class="app-name">${escape(app.name)}</span><span class="app-mode">${escape(app.mode)}</span></div>`,
  ).join('')}</div>`;
}

function faqSection(): string {
  return `<div class="faq-list">${FAQ_ITEMS.map(
    (item, index) =>
      `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${escape(item.question)}</summary><p>${escape(item.answer)}</p></details>`,
  ).join('')}</div>`;
}

export function renderProductPage(config: PublicPageConfig = {}): string {
  const install = config.launchStage === 'public' ? appLink(config) : undefined;
  const plugin = releaseLink(config);
  const mcpUrl = mcpEndpoint(config);
  const openMcpUrl = openMcpEndpoint(config);

  const liveStoreNote = install
    ? `<a href="${install}">Install on Shopify</a> or <a href="${pagePath(config, '/setup#store-connection')}">read live store setup</a>.`
    : `The live store connection is waiting for Shopify App Store review. The connector link and CLI above work now. <a href="${pagePath(config, '/setup#store-connection')}">Read live store details</a>.`;

  const releaseNote = plugin
    ? `<a href="${escape(plugin)}">Download skills-only plugin (${RELEASE_VERSION})</a> · <a href="${pagePath(config, '/setup')}">ZIP files and troubleshooting</a>`
    : `<a href="${RELEASE_TAG_URL}">Browse ${RELEASE_VERSION} release files</a> · <a href="${pagePath(config, '/setup')}">ZIP files and troubleshooting</a>`;

  return layout(
    {
      page: 'guide',
      hasHero: true,
      hasSequence: true,
    },
    `
    <section class="hero stage">
      <canvas class="hero-canvas" data-hero-canvas aria-hidden="true"></canvas>
      <div class="shell hero-grid">
        <div class="hero-main">
          <h1 class="hero-h1">Shopify skills for AI agents</h1>
          <p class="hero-sub">19 free Shopify skills under the MIT license for product listings, orders, ads, and Liquid themes. Connect them to ChatGPT, Claude, or a coding agent. Your AI app drafts the work, and you approve every change in Shopify Admin.</p>
          ${heroWorkbench(openMcpUrl, pagePath(config, '/setup'))}
        </div>
        <div class="hero-aside" id="examples" role="region" aria-labelledby="examples-heading">
          <h2 class="aside-h" id="examples-heading">Sample tasks</h2>
          <p class="aside-sub">Paste store specs, exports, or order logs. Your AI app returns structured checks and asks about anything it can't confirm.</p>
          ${sampleOutputsSection()}
        </div>
      </div>
    </section>

    <section id="sequence" class="band band-major" aria-labelledby="sequence-heading">
      <div class="shell">
        <div class="section-head">
          <h2 id="sequence-heading">What comes first</h2>
          <p>A new store or a launch goes through these seven stages in order. If a live store has one clear problem, start at the stage it belongs to.</p>
        </div>
        ${sequenceSection()}
      </div>
    </section>

    <section id="bottlenecks" class="band band-major" aria-labelledby="bottlenecks-heading">
      <div class="shell">
        <div class="section-head">
          <h2 id="bottlenecks-heading">Common store problems</h2>
          <p>Pick the row that sounds like your store. It names the skill to start with and the ones to check after it, and gives you a starter prompt to copy.</p>
        </div>
        ${bottleneckTable()}
      </div>
    </section>

    <section id="skills" class="band band-related" aria-labelledby="skills-heading">
      <div class="shell">
        <div class="section-head">
          <h2 id="skills-heading">All ${SKILL_COUNT} Shopify skills</h2>
          <p>Each skill has a starter prompt you can copy and its full instructions on GitHub. Filter by area or search for a task.</p>
        </div>
        ${skillCatalogSection()}
      </div>
    </section>

    <section id="setup" class="band band-major" aria-labelledby="setup-heading">
      <div class="shell">
        <div class="section-head">
          <h2 id="setup-heading">How to set up</h2>
          <p>You can start without a Shopify account or store access. Setup takes three steps.</p>
        </div>
        <ol class="quick-setup">
          <li>
            <h3>Connect your AI app</h3>
            <p>In Claude, open Settings → Connectors → Add custom connector. ChatGPT keeps custom connectors under Settings → Apps &amp; Connectors (some plans need Developer mode on). Paste the connector link from the <a href="#install">setup box at the top of this page</a> and save.</p>
            <p>For Claude Code, Codex, Cursor, and other coding agents, run the install command from the same box once.</p>
          </li>
          <li>
            <h3>Try one product listing</h3>
            <p>Open a new chat and paste this prompt. Fill in the brackets with facts the store owner has confirmed. Your AI app asks about anything missing, then writes the draft.</p>
            <pre class="request" tabindex="0"><code>${escape(firstRequest)}</code></pre>
            <button type="button" class="copy-btn copy-btn-line" data-copy="${escape(firstRequest)}" hidden>Copy prompt</button>
          </li>
          <li>
            <h3>Review before anything goes live</h3>
            <p>Paste only what the task needs, and never paste passwords, API keys, or card details. Check each draft against the store owner's facts before anyone applies it in Shopify Admin.</p>
          </li>
        </ol>
        <details class="setup-drawer">
          <summary>Other ways to install (plugins, CLI, ZIP files, and live store)</summary>
          <div class="setup-drawer-body">
            <p class="setup-intro">The skills work in these AI apps. Each install command is below.</p>
            ${supportedAppsMatrix()}
            <div class="cmd-list">
              ${cmdItem('Agent Skills CLI', `All ${SKILL_COUNT} skills`, CLI_ADD_CMD)}
              ${cmdItem('Context7 CLI', `All ${SKILL_COUNT} skills`, CTX7_ADD_CMD)}
              ${cmdItem('Claude Code', 'GitHub plugin', CLAUDE_PLUGIN_CMD)}
              ${cmdItem('Cursor', 'Run in Cursor chat', CURSOR_PLUGIN_CMD)}
              ${cmdItem('Antigravity', 'Plugin', AGY_PLUGIN_CMD)}
              ${cmdItem('OpenAI Codex', 'Step 1: add the marketplace', CODEX_MARKETPLACE_CMD)}
              ${cmdItem('OpenAI Codex', 'Step 2: install the plugin', CODEX_PLUGIN_CMD)}
              ${cmdItem('Live store data (optional)', 'Read-only, store owner approves', mcpUrl, 'mcp')}
            </div>
            <p class="setup-foot">${liveStoreNote}</p>
            <p class="setup-foot">${releaseNote}</p>
          </div>
        </details>
        <p class="setup-foot">ZIP files, ChatGPT Projects, and troubleshooting are in <a href="${pagePath(config, '/setup')}">the setup guide</a> · <a href="${SHOPIFY_AFFILIATE}" target="_blank" rel="sponsored noopener noreferrer">Start a free Shopify trial</a> (affiliate link).</p>
      </div>
    </section>

    <section id="faq" class="band band-related band-last" aria-labelledby="faq-heading">
      <div class="shell">
        <div class="section-head">
          <h2 id="faq-heading">FAQ</h2>
        </div>
        ${faqSection()}
      </div>
    </section>`,
    config,
  );
}

export function renderHelpPage(config: PublicPageConfig = {}): string {
  const install = config.launchStage === 'public' ? appLink(config) : undefined;
  const plugin = releaseLink(config);
  const connectionUrl = mcpEndpoint(config);
  const openMcpUrl = openMcpEndpoint(config);
  return layout(
    {
      page: 'setup',
      currentNav: 'setup',
    },
    `
    <div class="page-body shell">
      <div class="doc-head">
        ${breadcrumbNav(config, 'setup')}
        <h1>How to set up Shopify skills</h1>
        <p>The quick start connects all ${SKILL_COUNT} skills and needs no account or store access. Other ways to connect and fixes for common problems come after it.</p>
        <nav class="doc-jump" aria-label="On this page"><a href="#quick-start">Four steps</a><a href="#install-help">All ways to connect</a><a href="#store-connection">Live store data</a><a href="#fix-issues">Fix common issues</a><a href="#contact">Contact</a></nav>
      </div>
      <section id="quick-start">
        <h2>Set up in four steps</h2>
        <h3>1. Connect your AI app</h3>
        <p>Claude: open Settings → Connectors → Add custom connector, paste this link, and save.</p>
        ${cmdRow(openMcpUrl, 'connector link')}
        <p>ChatGPT: open Settings → Apps &amp; Connectors and create a custom connector with the same link. Some plans need Developer mode turned on first.</p>
        <p>Coding agents (Claude Code, Codex, Cursor, and others): run this once in your terminal.</p>
        ${cmdRow(CLI_ADD_CMD, 'install command')}
        <h3>2. Try one product listing</h3>
        <p>Open a new chat and paste this prompt. Fill in the brackets with facts the store owner has confirmed. Your AI app asks about anything missing, then writes the draft.</p>
        <pre class="request" tabindex="0"><code>${escape(firstRequest)}</code></pre>
        <button type="button" class="copy-btn copy-btn-line" data-copy="${escape(firstRequest)}" hidden>Copy prompt</button>
        <h3>3. Ask for daily tasks</h3>
        <p>Describe the problem in plain words, and your AI app picks the right skill. For example:</p>
        <ul>
          <li>"Check this product CSV for missing prices and duplicate SKUs."</li>
          <li>"Draft a reply to this late-order email using our shipping policy."</li>
          <li>"Build a chargeback evidence packet from these order details."</li>
          <li>"Our Merchant Center feed has disapproved products. What should I fix first?"</li>
        </ul>
        <h3>4. Follow three rules</h3>
        <ol class="steps">
          <li>Paste only what the task needs. Never paste passwords, API keys, card details, or extra customer data.</li>
          <li>Treat every answer as a draft. Check it against the facts the store owner gave you before you use it.</li>
          <li>Get approval before any store change. Your AI app only reads and drafts, so you or the store owner apply changes in Shopify Admin.</li>
        </ol>
        <p>Each skill is listed on the <a href="${pagePath(config, '#skills')}">main page</a> with a starter prompt you can copy.</p>
      </section>
      <section id="install-help">
        <h2>All ways to connect</h2>
        <dl>
          <dt>ChatGPT and Claude (custom connector)</dt>
          <dd><p>Add this link as a custom connector (remote MCP server). It gives your AI app all ${SKILL_COUNT} skills and 8 VA task workflows.</p>${cmdRow(openMcpUrl, 'connector link')}</dd>
          <dt>Agent Skills CLI (most coding agents)</dt>
          <dd><p>Run this once. To see the list before you install, add <code>--list</code> to the end.</p>${cmdRow(CLI_ADD_CMD, 'Agent Skills CLI command')}</dd>
          <dt>Context7 CLI</dt>
          <dd><p>Install all ${SKILL_COUNT} skills through Context7.</p>${cmdRow(CTX7_ADD_CMD, 'Context7 CLI command')}</dd>
          <dt>Claude Code plugin</dt>
          <dd><p>Run this in your terminal, or the second command inside a Claude Code session. To confirm all ${SKILL_COUNT} skills loaded, run <code>claude plugin details shopify-va-toolkit</code>.</p>${cmdRow(CLAUDE_PLUGIN_CMD, 'Claude Code terminal command')}${cmdRow(CLAUDE_SESSION_CMD, 'Claude Code session command')}</dd>
          <dt>Cursor plugin</dt>
          <dd><p>In Cursor chat, run this, or use the Agent Skills CLI above.</p>${cmdRow(CURSOR_PLUGIN_CMD, 'Cursor command')}</dd>
          <dt>Antigravity plugin</dt>
          <dd><p>Paste this into your terminal.</p>${cmdRow(AGY_PLUGIN_CMD, 'Antigravity command')}</dd>
          <dt>OpenAI Codex plugin</dt>
          <dd><p>Run these two commands in order.</p>${cmdRow(CODEX_MARKETPLACE_CMD, 'Codex marketplace command')}${cmdRow(CODEX_PLUGIN_CMD, 'Codex plugin command')}<p>${plugin ? `You can also download <a href="${escape(plugin)}">the skills-only plugin file</a>.` : `You can also browse <a href="${RELEASE_TAG_URL}">Release ${RELEASE_VERSION}</a>.`}</p></dd>
          <dt>Claude web or desktop (Skills ZIP)</dt>
          <dd><p>Download <a href="${STARTER_SKILL_ZIP_URL}"><code>shopify-va.zip</code></a> or <a href="${PRODUCT_LISTING_ZIP_URL}"><code>shopify-product-listing.zip</code></a> from <a href="${RELEASE_TAG_URL}">Release ${RELEASE_VERSION}</a>. Upload the ZIP without unzipping it under Customize → Skills, then turn it on. The Anthropic Plugin Directory listing is under review.</p></dd>
          <dt>ChatGPT Projects (manual setup)</dt>
          <dd><p>Download and unzip a skill ZIP from <a href="${RELEASE_TAG_URL}">${RELEASE_VERSION}</a>. Paste the text of <code>SKILL.md</code> into Project instructions. Upload the files in <code>references/</code> as project files.</p></dd>
        </dl>
        <p><a href="${sourceFile('docs/ai-agent-setup.md')}">Full coding agent setup guide</a> · <a href="${RELEASE_TAG_URL}">All ${RELEASE_VERSION} downloads</a> · <a href="${SOURCE_ZIP}">Full source ZIP</a></p>
      </section>
      <section id="store-connection">
        <h2>Read live store data (optional)</h2>
        ${
          install
            ? `<ol class="steps"><li>The store owner installs <a href="${install}">Marketing Skills VA Toolkit</a> on the target Shopify store.</li><li>In Claude or ChatGPT connectors, enter <code>${escape(connectionUrl)}</code>.</li><li>Sign in, then paste the pairing code in Shopify Admin so the store owner can approve read access.</li><li>Ask your AI app to show the store name first, so you know it's the right store.</li></ol>`
            : `<p>The live store connection is waiting for Shopify App Store review. Until then, use the connector link or CLI above. After approval, or on a development store, add this remote MCP server URL:</p>${cmdRow(connectionUrl, 'live store connection link')}`
        }
        <p>This connection is read-only and uses OAuth 2.1 with PKCE. By default it asks for three read scopes (<code>read_products</code>, <code>read_inventory</code>, and <code>read_orders</code>), so it cannot edit products, send customer emails, take payments, or issue refunds.</p>
        <p>The store owner can also turn on four optional read scopes inside the app: <code>read_reports</code>, <code>read_discounts</code>, <code>read_themes</code>, and <code>read_customers</code>. Even with <code>read_customers</code> enabled, the connection reads totals only and never pulls buyer names or emails.</p>
        <p><a href="https://help.openai.com/en/articles/11487775-connectors-in-chatgpt">ChatGPT connector docs</a> · <a href="https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp">Claude MCP docs</a></p>
      </section>
      <section id="fix-issues" class="related">
        <h2>Fix common issues</h2>
        <dl>
          <dt>My AI app won't accept Markdown (.md) files</dt>
          <dd>Use the connector link instead, or rename copies of the files to <code>.txt</code>.</dd>
          <dt>Sign-in code expired</dt>
          <dd>Start a new sign-in. Old codes can't be reused.</dd>
          <dt>Store owner approval is pending</dt>
          <dd>Ask the store owner to approve the code in Shopify Admin. Staff accounts can't approve AI connections.</dd>
          <dt>Results show only one page</dt>
          <dd>Ask your AI app to read the next page, or to tell you which records it checked.</dd>
        </dl>
      </section>
      <section id="contact" class="related">
        <h2>Contact and support</h2>
        <p>Email <a href="mailto:${SUPPORT}">${SUPPORT}</a> for help, or open a <a href="${REPOSITORY}/issues">GitHub issue</a> for public questions. Don't post passwords, keys, or private store data in a public issue.</p>
        <p><a href="${pagePath(config, '/privacy')}">Privacy notice</a> · <a href="${pagePath(config, '/llms.txt')}">llms.txt</a> · <a href="${SHOPIFY_AFFILIATE}" target="_blank" rel="sponsored noopener noreferrer">Start a free Shopify trial</a></p>
      </section>
    </div>`,
    config,
  );
}

export function renderPrivacyPage(config: PublicPageConfig = {}): string {
  return layout(
    {
      page: 'privacy',
    },
    `
    <div class="page-body shell">
      <div class="doc-head">
        ${breadcrumbNav(config, 'privacy')}
        <h1>Shopify skills privacy notice</h1>
        <p>${config.launchStage === 'public' ? 'This notice covers the live read-only Shopify MCP server.' : 'This notice covers the Shopify MCP server while it waits for Shopify App Store review.'}</p>
        <p class="muted">Updated November 25, 2026. Operator: Vince Servidad.</p>
      </div>
      <section>
        <h2>What the MCP server reads</h2>
        <p>The no-sign-in link serves only the public skills and stores no user data. If a store owner turns on the optional live store connection, it runs fixed read-only queries using <code>read_products</code>, <code>read_inventory</code>, and <code>read_orders</code>.</p>
        <p>Store owners can also grant four optional read scopes inside the app: <code>read_reports</code>, <code>read_discounts</code>, <code>read_themes</code>, and <code>read_customers</code>. Customer and order queries return store totals and order line items without personal contact details or payment data. Shopify still classifies order records as protected customer data.</p>
      </section>
      <section>
        <h2>What we store and for how long</h2>
        <p>For live store connections, we store encrypted OAuth and Shopify token records so the connection keeps working:</p>
        <ul class="retention-list">
          <li>MCP access tokens: 1 hour.</li>
          <li>Store grants and rotating MCP refresh tokens: up to 7 days.</li>
          <li>Encrypted Shopify tokens: up to 7 days from owner approval (or earlier upstream expiry).</li>
          <li>OAuth client entries: 28 days.</li>
          <li>Pending owner approvals: 10 minutes.</li>
          <li>Review codes and auth codes: 2 minutes.</li>
          <li>Hashed lifecycle markers: 28 days (no shop domain, buyer data, or tokens).</li>
          <li>Hashed webhook receipts: 7 days (no shop domain, buyer data, or tokens).</li>
        </ul>
        <p>An hourly job deletes expired records. We don't save client briefs, uploaded files, chats, or query results.</p>
      </section>
      <section class="related">
        <h2>Your controls and contact</h2>
        <p>Store owners approve every live store connection in Shopify Admin. They can remove access or uninstall the app at any time. We respond to Shopify's customer data request and data deletion webhooks.</p>
        <p>Email <a href="mailto:${SUPPORT}">${SUPPORT}</a> for privacy requests, or open <a href="${REPOSITORY}/issues">GitHub issues</a>. This service is free under the MIT license, with no payments, ad trackers, or data sales.</p>
      </section>
    </div>`,
    config,
  );
}

const REFERENCE_FILES: readonly { title: string; path: string }[] = [
  { title: 'Google Merchant Center Next & Performance Max Feed guide', path: 'skills/shopify-google-ads/references/merchant-center-next-pmax.md' },
  { title: 'Meta Advantage+ Shopping & Conversions API (CAPI) guide', path: 'skills/shopify-meta-ads/references/advantage-plus-capi.md' },
  { title: 'Checkout Extensibility, Web Pixels & Shopify Functions guide', path: 'skills/shopify-theme-development/references/checkout-extensibility-pixels.md' },
  { title: 'Shopify Markets & Multi-Location Order Routing guide', path: 'skills/shopify-order-operations/references/multi-location-routing-markets.md' },
  { title: 'Official Shopify Flow Operational Recipes', path: 'skills/shopify-flow-automation/references/official-flow-recipes.md' },
  { title: 'Chargeback & Payment Dispute Evidence guide', path: 'skills/shopify-order-operations/references/chargeback-evidence.md' },
  { title: 'Shipping Profiles, Carrier Rates & 3PL Exceptions guide', path: 'skills/shopify-order-operations/references/shipping-3pl-exceptions.md' },
  { title: 'Store Launch, Migration & Peak-Sale (BFCM) Readiness guide', path: 'skills/shopify-store-audit/references/launch-migration-bfcm.md' },
  { title: 'App Stack Hygiene & Product Review Moderation guide', path: 'skills/shopify-store-audit/references/app-stack-reviews.md' },
  { title: 'Subscriptions & Multi-Channel Sales Sync guide', path: 'skills/shopify-catalog-operations/references/subscriptions-multichannel.md' },
  { title: 'Cross-Skill Build, Launch & Marketing Sequence guide', path: 'skills/shopify-va/references/skill-sequence.md' },
  { title: 'Client Deliverable Templates: CSV QA, BFCM, Chargeback & Handover', path: 'skills/shopify-va/references/deliverable-templates.md' },
  { title: 'Official Meta Ads Experiments, Auction, Catalog & Compliance guide', path: 'skills/shopify-meta-ads/references/official-meta-methods.md' },
  { title: 'Official Google Ads Enhanced Conversions, Smart Bidding & Merchant Center guide', path: 'skills/shopify-google-ads/references/official-google-methods.md' },
  { title: 'Email Deliverability & TCPA/CTIA SMS Compliance guide', path: 'skills/shopify-email-marketing/references/deliverability-sms-compliance.md' },
  { title: 'Technical SEO, Product JSON-LD & Core Web Vitals Standards', path: 'skills/shopify-seo/references/technical-seo-standards.md' },
  { title: 'CRO Experiment Validity, SRM & Mobile Friction Standards', path: 'skills/shopify-cro/references/experiment-validity-friction.md' },
  { title: 'FTC Endorsement & Review Compliance guide', path: 'skills/shopify-creative-strategy/references/ftc-endorsement-compliance.md' },
  { title: 'Product Page Social Proof Compliance & Mobile UX Standards', path: 'skills/shopify-product-page/references/proof-compliance-mobile-ux.md' },
  { title: 'Shopify Analytics, GA4 & Consent Mode v2 Reconciliation guide', path: 'skills/shopify-analytics/references/shopify-analytics-ga4-consent.md' },
  { title: 'Theme Performance, Accessibility & App Extensions Standards', path: 'skills/shopify-theme-development/references/performance-accessibility-extensions.md' },
  { title: 'Shopify Product Taxonomy, GTIN, HS Code & EU GPSR Compliance guide', path: 'skills/shopify-product-listing/references/taxonomy-compliance.md' },
  { title: 'High-Variant Catalogs, productSet & Combined Listings guide', path: 'skills/shopify-catalog-operations/references/high-variant-combined-listings.md' },
  { title: 'Shopify Search & Discovery and Native Bundles guide', path: 'skills/shopify-merchandising/references/search-discovery-bundles.md' },
];

const llmsHeading = '# Marketing Skills: Shopify VA Skills';
const llmsSummary = () => `> ${SKILL_COUNT} free MIT-licensed Shopify skills for ChatGPT, Claude, and coding agents such as Claude Code, Codex, and Cursor. Your AI app drafts store work, and a person approves every store change. Built by Vince Servidad.`;

function installCommands(): string {
  return `\`\`\`
${CLI_ADD_CMD}
${CTX7_ADD_CMD}
${CLAUDE_PLUGIN_CMD}
${CURSOR_PLUGIN_CMD}
${AGY_PLUGIN_CMD}
${CODEX_MARKETPLACE_CMD}
${CODEX_PLUGIN_CMD}
\`\`\``;
}

/** llms.txt follows https://llmstxt.org: H1, blockquote, plain body text, H2 link lists, and a final Optional section. */
export function renderLlmsTxt(config: PublicPageConfig = {}): string {
  const openMcpUrl = openMcpEndpoint(config), mcpUrl = mcpEndpoint(config);
  const skillLines = SKILL_CATALOG.map(skill => `- [${skill.name}](${sourceFile(`skills/${skill.slug}/SKILL.md`)}): ${skill.summary}`).join('\n');
  const referenceLines = REFERENCE_FILES.map(file => `- [${file.title}](${sourceFile(file.path)})`).join('\n');
  return `${llmsHeading}

${llmsSummary()}

Last updated: ${SKILL_DOCS_UPDATED} (date of the latest change to the skill files). Free under the MIT license, with no account or payment. The skills and both MCP servers only read data and write drafts. They cannot change a store, prices, orders, or ad accounts. Someone with store permissions applies each approved change in Shopify Admin or the ad platform. Not affiliated with Shopify.

The no-sign-in MCP server (Streamable HTTP) is ${openMcpUrl}. Add it as a custom connector in Claude or ChatGPT. To install in a coding agent, run one of these commands. They run in a terminal, except /add-plugin, which runs in Cursor chat. The setup page also lists the command for inside a Claude Code session.

${installCommands()}

## Guide pages

- [Shopify skills for AI agents](${SITE_ORIGIN}/shopify-va): Common store problems with starter prompts, the seven-stage order of work, a searchable list of all ${SKILL_COUNT} skills, and an FAQ
- [How to set up Shopify skills](${SITE_ORIGIN}/shopify-va/setup): Four-step setup guide, all install options, and troubleshooting
- [No-sign-in MCP server](${openMcpUrl}): Serves all ${SKILL_COUNT} skills, their reference files, and ${WORKFLOWS.length} VA task workflows, with no account
- [Optional signed-in MCP server](${mcpUrl}): Read-only Shopify Admin checks over OAuth 2.1 with PKCE, pending Shopify App Store review

## All ${SKILL_COUNT} Shopify skills

${skillLines}

## Optional

- [Full text of all ${SKILL_COUNT} skills and setup](${SITE_ORIGIN}/shopify-va/llms-full.txt): Plain text, for agents that can read a long file
- [Privacy notice](${SITE_ORIGIN}/shopify-va/privacy): What the read-only MCP server reads and stores, and for how long
- [GitHub repository](${REPOSITORY}): Source, issues, and the MIT license
- [Marketing Skills](${FAMILY_HOME}): The parent library of free marketing skills for AI agents
${referenceLines}
`;
}

/** Push a skill's own headings two levels down (outside code fences) so each skill nests under its "## Skill:" heading. */
function demoteHeadings(markdown: string): string {
  let fence = false;
  return markdown.split('\n').map(line => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    return !fence && /^#{1,4} /.test(line) ? `##${line}` : line;
  }).join('\n');
}

/** llms-full.txt (a common companion to llms.txt, not part of the llmstxt.org spec): the complete text of every skill and the setup steps. */
export function renderLlmsFullTxt(config: PublicPageConfig = {}): string {
  const openMcpUrl = openMcpEndpoint(config), mcpUrl = mcpEndpoint(config);
  const names = new Map(SKILL_CATALOG.map(skill => [skill.slug, skill.name]));
  const skills = SKILL_DOCS.map(doc => `## Skill: ${names.get(doc.slug) ?? doc.slug} (${doc.slug})

Source: ${sourceFile(`skills/${doc.slug}/SKILL.md`)}
When to use: ${doc.description}

${demoteHeadings(doc.body)}`).join('\n\n');
  const faq = FAQ_ITEMS.map(item => `### ${item.question}\n\n${item.answer}`).join('\n\n');
  return `${llmsHeading}

${llmsSummary()}

Last updated: ${SKILL_DOCS_UPDATED}. This file holds the full text of all ${SKILL_COUNT} skills (the SKILL.md files; reference files are linked from ${SITE_ORIGIN}/shopify-va/llms.txt) and the setup steps. Guide: ${SITE_ORIGIN}/shopify-va

## Setup

Free under the MIT license; no account or store access is needed to start.

### 1. Connect your AI app

Claude: open Settings, then Connectors, then Add custom connector, paste ${openMcpUrl}, and save. ChatGPT: open Settings, then Apps and Connectors, and create a custom connector with the same link (some plans need Developer mode first). Coding agents such as Claude Code, Codex, and Cursor: run \`${CLI_ADD_CMD}\` once in a terminal.

### 2. Other install commands

${installCommands()}

### 3. Try one product listing

${firstRequest}

### 4. Follow three rules

1. Paste only what the task needs. Never paste passwords, API keys, card details, or extra customer data.
2. Treat every answer as a draft. Check it against the facts the store owner gave you before you use it.
3. Get approval before any store change. Your AI app only reads and drafts, so you or the owner apply changes in Shopify Admin.

### Optional live store connection

The signed-in MCP server at ${mcpUrl} is read-only and uses OAuth 2.1 with PKCE. By default it asks for three read scopes (read_products, read_inventory, read_orders); the store owner can enable four more read scopes (read_reports, read_discounts, read_themes, read_customers). It cannot edit products, send emails, take payments, or issue refunds. It is pending Shopify App Store review unless the guide says otherwise.

## FAQ

${faq}

${skills}
`;
}

export function renderAppHome(config: AppHomeConfig): string {
  const workflows = WORKFLOWS.map(workflow => `<details class="workflow"><summary>${escape(workflow.title)}</summary><p>${escape(workflow.purpose)}</p><p><strong>Have ready:</strong> ${escape(workflow.required_inputs.map(input => input.replaceAll('_', ' ')).join(', '))}.</p><ol>${workflow.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol><p><strong>Expected result:</strong> ${escape(workflow.output_sections.join(', '))}.</p><ul>${workflow.qa.map(item => `<li>${escape(item)}</li>`).join('')}</ul><p><a href="${sourceCandidateFile(`skills/${workflow.owner_skill}/${workflow.reference}`)}" target="_blank" rel="noopener noreferrer">Open the full guide and template</a></p></details>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="shopify-api-key" content="${escape(config.clientId)}"><title>Marketing Skills VA Toolkit</title><script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script><script src="https://cdn.shopify.com/shopifycloud/polaris-1.1.js"></script><link rel="stylesheet" href="/assets/public.css"><script src="/assets/app-home.js" defer></script></head><body class="app-home"><a class="skip-link" href="#app-main">Skip to content</a><main id="app-main"><s-page heading="Marketing Skills VA Toolkit"><s-section heading="Your store connection"><p id="session-status" role="status" aria-live="polite">Checking your Shopify session…</p><p>Free, read-only tools and task guides. Store changes, sent replies and refunds are not available through this connection.</p><div class="actions"><s-button id="retry-session">Check session again</s-button></div></s-section><div id="authenticated-content" hidden><s-section heading="Extra read permissions"><p>Sales reports, discounts, theme files and customer totals use four optional read permissions: <code>read_reports</code>, <code>read_discounts</code>, <code>read_themes</code> and <code>read_customers</code>. They stay off until the store owner grants them here. With them, the app still cannot change anything, and customer access returns totals only, never names or emails.</p><p id="optional-scopes-status" role="status"></p><s-button id="request-optional-scopes" disabled>Grant extra read permissions</s-button></s-section><s-section heading="Choose a VA job"><p>Use these instructions with your client's approved facts in ChatGPT or Claude. Client documents stay in that chat or project. The app does not run an AI task or certify expertise.</p>${workflows}</s-section><s-section heading="Check store information"><p>Read one page at a time. Check the store, retrieval time and coverage before using the result. These checks cannot change any store record.</p><form id="product-search" class="search-form"><label for="product-query">Product search <span class="muted">(optional)</span></label><input id="product-query" name="query" maxlength="500" autocomplete="off"><div class="actions"><s-button id="read-shop" type="button">Check store identity</s-button><s-button id="read-products" type="button">View products</s-button><s-button id="read-orders" type="button">View recent orders</s-button></div></form><p id="evidence-status" role="status" aria-live="polite">Choose a check to read current data.</p><div id="evidence-result" class="evidence-result"></div><s-button id="next-page" hidden>Read next page</s-button></s-section><s-section heading="Approve an AI connection"><p id="owner-guidance">The store owner must review and approve each connection.</p><form id="pairing-form"><label for="pairing-code">Connection request code</label><input id="pairing-code" name="pairing_code" maxlength="128" autocomplete="off" spellcheck="false" aria-describedby="pairing-help"><p id="pairing-help" class="muted">Copy this code from the original ChatGPT or Claude sign-in tab. Only approve a request you recognize.</p><s-button id="inspect-pairing" type="button" disabled>Review request</s-button></form><p id="pairing-status" role="status" aria-live="polite"></p><div id="pairing-review" hidden><dl id="pairing-facts"></dl><p>This authorizes supported read access to the displayed store. It does not grant store editing permission.</p><s-button id="approve-pairing" variant="primary" disabled>Approve this connection</s-button><s-button id="cancel-pairing">Cancel review</s-button></div></s-section><s-section heading="Approved AI connections"><p>Disconnecting stops this client's future access. It does not delete existing conversations in the AI service.</p><s-button id="refresh-connections">Refresh connections</s-button><p id="connections-status" role="status" aria-live="polite"></p><div id="connections-list"></div></s-section></div><s-section heading="Help"><p>First time using the guides? <a href="/help" target="_blank" rel="noopener noreferrer">Open the first-task walkthrough</a>. <a href="/privacy" target="_blank" rel="noopener noreferrer">Read the privacy notice</a>.</p><p>Missing facts, policies and stock thresholds need an owner decision. No background monitoring or scheduled work is enabled.</p></s-section></s-page></main></body></html>`;
}
