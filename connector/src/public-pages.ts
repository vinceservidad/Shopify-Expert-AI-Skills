import { WORKFLOWS } from './workflows.js';
import { APP_HOME_SCRIPT } from './public-ui/app-home.js';
import { PUBLIC_STYLES } from './public-ui/styles.js';
import { THEME_SCRIPT } from './public-ui/theme.js';
import { HERO_SCRIPT } from './public-ui/hero-canvas.js';
import { SKILL_CATALOG, SKILL_CATEGORIES, SKILL_COUNT } from './public-ui/skill-groups.js';
import { FAVICON_DATA_URI } from './public-ui/favicon.js';

export { APP_HOME_SCRIPT, HERO_SCRIPT, PUBLIC_STYLES, THEME_SCRIPT };

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

const PRODUCT_TITLE = '19 Free Shopify Skills for AI Agents and VAs | Marketing Skills';
const PRODUCT_DESCRIPTION =
  '19 free MIT-licensed Shopify skills for ChatGPT, Claude, and coding agents. Your AI app drafts the store work, and you approve every change in Shopify Admin.';
const HELP_TITLE = 'How to Set Up | Shopify VA Skills | Marketing Skills';
const HELP_DESCRIPTION =
  'How to add the 19 Shopify VA skills to ChatGPT, Claude, or your coding agent, plus fixes for common setup issues.';
const PRIVACY_TITLE = 'Privacy Notice | Shopify VA Skills | Marketing Skills';
const PRIVACY_DESCRIPTION =
  'What the read-only Shopify VA MCP server reads, what it stores, and when it deletes it.';

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

const SIDEKICK_ROWS: readonly { job: string; ours: string; sidekick: string }[] = [
  // ours: what the skills plan and draft in your AI app. sidekick: where the approved change is made.
  {
    job: 'Google, Meta, and email marketing',
    ours: 'Audit Google Merchant Center feeds, Performance Max, Conversions API, and email flows.',
    sidekick: 'Fix the product data and settings the audit flags, in Shopify Admin or the ad platform.',
  },
  {
    job: 'Theme code and Web Pixels',
    ours: 'Plan Liquid edits, Checkout UI extension limits, and Web Pixel checks, with a rollback step.',
    sidekick: 'Apply the change in a duplicate theme, preview it, then publish.',
  },
  {
    job: 'Approvals and handovers',
    ours: 'Write owner approval rules, rollback steps, and end-of-shift notes.',
    sidekick: 'The owner approves, and staff make the change with their own permissions.',
  },
  {
    job: 'Chargebacks, 3PLs, and sales channels',
    ours: 'Build chargeback evidence, check shipping rates, and trace sync errors.',
    sidekick: 'Submit the evidence and update settings in Shopify Admin or the channel app.',
  },
  {
    job: 'Several clients or a store not live yet',
    ours: 'Work from exports and notes in ChatGPT, Claude, Cursor, or Codex without store sign-in.',
    sidekick: 'Sign in to each store in Shopify Admin when a change is approved.',
  },
  {
    job: 'Quick edits inside Shopify Admin',
    ours: 'Skills read supplied files and draft changes for review.',
    sidekick: 'Use Shopify Admin, or Shopify Sidekick inside the admin.',
  },
];

const SUPPORTED_APPS: readonly { name: string; mode: string }[] = [
  { name: 'ChatGPT', mode: 'Paste a link' },
  { name: 'Claude', mode: 'Paste a link' },
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
      'Lists product weight and care rules as owner questions instead of guessing.',
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
    gate: 'Turn on welcome, abandoned cart, and post-purchase flows plus collection SEO so traffic stays.',
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
      'Shopify skills are instruction files that your AI app loads before doing store work. Each one tells your AI app which client facts to ask for first and which Shopify rules to check. Together, the 19 skills cover catalog work, order operations, paid ads, and theme code.',
  },
  {
    question: 'Are these Shopify skills free?',
    answer:
      'Yes. All 19 skills are open source under the MIT license, and you can read every file on GitHub before installing. No account or credit card is needed.',
  },
  {
    question: 'Which AI apps work with Shopify VA Skills?',
    answer:
      'In ChatGPT and Claude, you paste one link as a custom connector. Most coding agents, including Claude Code, OpenAI Codex, and Cursor, install all 19 skills with a single CLI command.',
  },
  {
    question: 'Do I need to connect my live Shopify store?',
    answer:
      'No. Paste product specs, CSV exports, support tickets, or ad reports into the chat, and the skills work from those files. A read-only connection to your live store is optional.',
  },
  {
    question: 'Can these skills change my store, prices, or orders?',
    answer:
      'No. The skills and store connection only read data and write drafts. You still make every approved change yourself in Shopify Admin.',
  },
  {
    question: 'How do I know which skill to use first?',
    answer:
      'You don\'t need to memorize the skill names. Describe the store problem in plain words, like "our stock counts are wrong," and your AI app picks the right skill.',
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

function productJsonLd(): string {
  return safeJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Marketing Skills',
        url: SITE_ORIGIN,
        logo: LOGO_URL,
        founder: { '@type': 'Person', name: 'Vince Servidad', url: AUTHOR },
        sameAs: [REPOSITORY],
      },
      {
        '@type': 'WebSite',
        name: 'Marketing Skills: Shopify VA Skills',
        url: `${SITE_ORIGIN}/shopify-va`,
        description: PRODUCT_DESCRIPTION,
        publisher: { '@type': 'Person', name: 'Vince Servidad', url: AUTHOR },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Shopify VA Skills',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Cross-platform',
        url: `${SITE_ORIGIN}/shopify-va`,
        description: PRODUCT_DESCRIPTION,
        license: 'https://opensource.org/licenses/MIT',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  });
}

type LayoutMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  includeSocialMeta?: boolean;
  jsonLd?: string;
  hasHero?: boolean;
};

function layout(meta: LayoutMeta, content: string, config: PublicPageConfig): string {
  const canonical = `${SITE_ORIGIN}${meta.canonicalPath}`;
  const socialTags = meta.includeSocialMeta
    ? `<meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:site_name" content="Marketing Skills"><meta property="og:type" content="website"><meta property="og:image" content="${OG_IMAGE_URL}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(meta.title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(meta.title)}"><meta name="twitter:description" content="${escape(meta.description)}"><meta name="twitter:image" content="${OG_IMAGE_URL}">`
    : '';
  const ldTag = meta.jsonLd ? `<script type="application/ld+json">${meta.jsonLd}</script>` : '';
  const heroScript = meta.hasHero ? `<script src="${pagePath(config, '/assets/hero.js')}" defer></script>` : '';
  return `<!doctype html><html lang="en" class="site"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"><meta name="author" content="Vince Servidad"><meta name="robots" content="index, follow"><meta name="theme-color" content="#031a14"><meta name="color-scheme" content="light"><link rel="canonical" href="${escape(canonical)}">${socialTags}<link rel="icon" href="${FAVICON_DATA_URI}" type="image/png" sizes="32x32">${ldTag}<script src="${pagePath(config, '/assets/theme.js')}" defer></script>${heroScript}<link rel="stylesheet" href="${pagePath(config, '/assets/public.css')}"></head><body${meta.hasHero ? ' class="has-hero"' : ''}><a class="skip-link" href="#main">Skip to content</a><div class="top-bar"><header class="family-header shell"><a class="setup-brand" href="${FAMILY_HOME}">Marketing Skills</a><nav class="family-tabs" aria-label="Marketing Skills products"><a href="${FAMILY_HOME}">marketing/</a><a href="${pagePath(config)}" data-product="va" aria-current="page">shopify-va/</a></nav><nav class="family-nav" aria-label="Site"><a href="${pagePath(config, '#bottlenecks')}">Problems</a><a href="${pagePath(config, '#skills')}">Skills</a><a href="${pagePath(config, '/setup')}">How to set up</a></nav></header></div><main id="main">${content}</main><div class="footer-band"><footer class="site-footer shell"><p>Independent open-source project by <a href="${AUTHOR}">Vince Servidad</a>. Not affiliated with Shopify. We may earn a commission if you sign up for Shopify through our links.</p><nav aria-label="Footer navigation"><a href="${FAMILY_HOME}">Marketing Skills</a><a href="${SHOPIFY_AFFILIATE}" target="_blank" rel="sponsored noopener noreferrer">Start a free Shopify trial</a><a href="${pagePath(config, '/setup')}">How to set up</a><a href="${pagePath(config, '/privacy')}">Privacy</a><a href="${REPOSITORY}">GitHub</a><a href="${REPOSITORY}/blob/main/LICENSE">MIT License</a></nav></footer></div></body></html>`;
}

function heroWorkbench(openMcpUrl: string, guideUrl: string): string {
  return `<div class="workbench" id="install">
    <input class="wb-radio" type="radio" name="wb" id="wb-claude" checked>
    <input class="wb-radio" type="radio" name="wb" id="wb-chatgpt">
    <input class="wb-radio" type="radio" name="wb" id="wb-cli">
    <div class="wb-tabs" role="tablist" aria-label="Quick setup">
      <label for="wb-claude">Claude</label>
      <label for="wb-chatgpt">ChatGPT</label>
      <label for="wb-cli">Coding agents</label>
    </div>
    <div class="wb-panels">
      <div class="wb-panel wb-claude">
        <div class="wb-row"><code>${escape(openMcpUrl)}</code><button type="button" class="copy-btn" data-copy="${escape(openMcpUrl)}" hidden>Copy link</button></div>
        <p class="wb-note">Open Settings → Connectors → Add custom connector, paste this link, and save.</p>
        <div class="wb-links"><a href="#setup">Step-by-step setup</a><a href="${guideUrl}">Troubleshooting</a></div>
      </div>
      <div class="wb-panel wb-chatgpt">
        <div class="wb-row"><code>${escape(openMcpUrl)}</code><button type="button" class="copy-btn" data-copy="${escape(openMcpUrl)}" hidden>Copy link</button></div>
        <p class="wb-note">Open Settings → Apps &amp; Connectors and add a custom connector with this link (some plans need Developer mode on).</p>
        <div class="wb-links"><a href="#setup">Step-by-step setup</a><a href="${guideUrl}">Troubleshooting</a></div>
      </div>
      <div class="wb-panel wb-cli">
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
    item => `<div class="ex-panel ${item.id}"><div class="ex-grid"><div class="ex-col"><span class="ex-label">What you paste (${escape(item.skill)})</span><p>${escape(item.inputText)}</p></div><div class="ex-col"><span class="ex-label">What your AI app returns</span><ul class="ex-list">${item.outputPoints.map(point => `<li>${escape(point)}</li>`).join('')}</ul></div></div></div>`,
  ).join('');
  return `<div class="ex-box">${radios}<div class="ex-tabs-wrap"><div class="ex-tabs" role="tablist" aria-label="Sample outputs">${labels}</div></div><div class="ex-panels">${panels}</div></div>`;
}

function sequenceSection(): string {
  const rows = SKILL_SEQUENCE.map(
    row => `<li class="seq-item"><span class="seq-num">${row.step}</span><span class="seq-stage">${escape(row.stage)}</span><span class="seq-skills">${escape(row.skills)}</span><span class="seq-gate">${escape(row.gate)}</span></li>`,
  ).join('');
  return `<ol class="sequence-list">${rows}</ol>`;
}

function bottleneckTable(): string {
  const rows = BOTTLENECKS.map(
    row => `<tr><td class="bn-problem">${escape(row.problem)}</td><td class="bn-first">${escape(row.fixFirst)}</td><td class="bn-next">${escape(row.checkNext)}</td><td class="bn-action"><button type="button" class="copy-btn copy-btn-line" data-copy="${escape(row.prompt)}">Copy prompt</button></td></tr>`,
  ).join('');
  return `<div class="table-wrap"><table class="bottleneck-table"><thead><tr><th scope="col">Problem</th><th scope="col">Fix first</th><th scope="col">Check next</th><th scope="col">Starter prompt</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function skillCatalogSection(): string {
  const tabs = [...SKILL_CATEGORIES, 'All']
    .map(
      (cat, index) =>
        `<button type="button" class="seg-tab" data-skill-cat="${escape(cat)}" aria-pressed="${index === 0 ? 'true' : 'false'}">${escape(cat)}</button>`,
    )
    .join('');
  const items = SKILL_CATALOG.map(
    skill => `<article class="skill-entry" data-skill-card data-cat="${escape(skill.category)}"><div><h3>${escape(skill.name)}</h3><p>${escape(skill.summary)}</p></div><div class="skill-actions"><button type="button" class="copy-btn copy-btn-line" data-copy="${escape(skill.prompt)}">Copy prompt</button><a href="${sourceFile(`skills/${skill.slug}/SKILL.md`)}">Read on GitHub</a></div></article>`,
  ).join('');
  return `<div class="catalog-controls" data-skill-filter-wrap><div class="seg-tabs" role="group" aria-label="Filter skills by category">${tabs}</div><div class="skill-filter"><input type="search" data-skill-filter placeholder="Search skills (stock, ads, Flow)" aria-label="Search Shopify skills"><span data-skill-status>${SKILL_COUNT} skills</span></div></div><div class="skill-index">${items}</div>`;
}

function sidekickComparisonTable(): string {
  const rows = SIDEKICK_ROWS.map(
    row => `<tr><td class="cmp-job">${escape(row.job)}</td><td class="cmp-ours">${escape(row.ours)}</td><td class="cmp-other">${escape(row.sidekick)}</td></tr>`,
  ).join('');
  return `<div class="table-wrap"><table class="compare-table"><thead><tr><th scope="col">Store job</th><th scope="col" class="cmp-ours">Plan and draft with the skills</th><th scope="col">Make the approved change</th></tr></thead><tbody>${rows}</tbody></table></div>`;
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
    : `The live store connection is waiting for Shopify App Store review. The link and CLI above work now. <a href="${pagePath(config, '/setup#store-connection')}">Read live store details</a>.`;

  const releaseNote = plugin
    ? `<a href="${escape(plugin)}">Download skills-only plugin (${RELEASE_VERSION})</a> · <a href="${pagePath(config, '/setup')}">ZIP files and troubleshooting</a>`
    : `<a href="${RELEASE_TAG_URL}">Browse ${RELEASE_VERSION} release files</a> · <a href="${pagePath(config, '/setup')}">ZIP files and troubleshooting</a>`;

  return layout(
    {
      title: PRODUCT_TITLE,
      description: PRODUCT_DESCRIPTION,
      canonicalPath: '/shopify-va',
      includeSocialMeta: true,
      jsonLd: productJsonLd(),
      hasHero: true,
    },
    `
    <section class="hero stage">
      <canvas class="hero-canvas" data-hero-canvas aria-hidden="true"></canvas>
      <div class="shell hero-inner">
        <h1 class="hero-h1">Shopify skills for AI agents</h1>
        <p class="hero-sub">19 free Shopify skills under the MIT license for product listings, orders, ads, and Liquid themes. Connect them to ChatGPT, Claude, or your coding agent to draft the work, then approve every change in Shopify Admin.</p>
        ${heroWorkbench(openMcpUrl, pagePath(config, '/setup'))}
      </div>
    </section>

    <section id="examples" class="band" aria-labelledby="examples-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="examples-heading">See what the skills return</h2>
          <p>Paste store specs, exports, or order logs and get back structured checks instead of guessed copy.</p>
        </div>
        ${sampleOutputsSection()}
      </div>
    </section>

    <section id="sequence" class="band band-mist" aria-labelledby="sequence-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="sequence-heading">What comes first</h2>
          <p>Follow this seven-stage order for a new store or launch. For a live store with one clear problem, start at that stage instead.</p>
        </div>
        ${sequenceSection()}
      </div>
    </section>

    <section id="bottlenecks" class="band" aria-labelledby="bottlenecks-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="bottlenecks-heading">Common store problems</h2>
          <p>Each row lists a Shopify problem, the skill to run first, what to check next, and a starter prompt.</p>
        </div>
        ${bottleneckTable()}
      </div>
    </section>

    <section id="skills" class="band band-forest" aria-labelledby="skills-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="skills-heading">All ${SKILL_COUNT} Shopify skills</h2>
          <p>Filter by area or search for a task. Copy a starter prompt, or read the full skill on GitHub.</p>
        </div>
        ${skillCatalogSection()}
      </div>
    </section>

    <section id="sidekick" class="band" aria-labelledby="sidekick-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="sidekick-heading">What the skills do, and what happens in Shopify</h2>
          <p>The skills plan and draft in your AI app. Someone with store permissions still applies the approved change in Shopify Admin or the ad platform.</p>
        </div>
        ${sidekickComparisonTable()}
      </div>
    </section>

    <section id="setup" class="band band-mist" aria-labelledby="setup-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="setup-heading">How to set up</h2>
          <p>Connect all ${SKILL_COUNT} skills in three steps. No Shopify account or store access is required to start.</p>
        </div>
        <ol class="quick-setup">
          <li>
            <h3>Connect your AI</h3>
            <p>Choose Claude, ChatGPT, or Coding agents in the <a href="#install">setup box at the top of this page</a> and follow the one-line step under your copy button. No Shopify login is required.</p>
          </li>
          <li>
            <h3>Try one product listing</h3>
            <p>Open a new chat and paste this prompt. Fill in the brackets with facts the store owner has confirmed. Your AI app asks about anything missing, then writes the draft.</p>
            <pre class="request" tabindex="0"><code>${escape(firstRequest)}</code></pre>
            <button type="button" class="copy-btn copy-btn-line" data-copy="${escape(firstRequest)}" hidden>Copy prompt</button>
          </li>
          <li>
            <h3>Review before anything goes live</h3>
            <p>Paste only what the task needs, and never paste passwords, API keys, or card details. Check each draft against the owner's facts before you or the owner apply changes in Shopify Admin.</p>
          </li>
        </ol>
        <details class="setup-drawer">
          <summary>Other ways to install (plugins, CLI, ZIP files, and live store)</summary>
          <div class="setup-drawer-body">
            <p class="setup-intro">Pick your AI app below, or open <a href="${pagePath(config, '/setup')}">the setup guide</a> for ZIP uploads, ChatGPT Projects, and troubleshooting.</p>
            ${supportedAppsMatrix()}
            <div class="cmd-list">
              <div class="cmd-item">
                <div class="cmd-label"><strong>Agent Skills CLI</strong><span>All ${SKILL_COUNT} skills</span></div>
                <code class="cmd-code">${CLI_ADD_CMD}</code>
                <button type="button" class="copy-btn copy-btn-line" data-copy="${CLI_ADD_CMD}" hidden>Copy</button>
              </div>
              <div class="cmd-item">
                <div class="cmd-label"><strong>Context7 CLI</strong><span>All ${SKILL_COUNT} skills</span></div>
                <code class="cmd-code">${CTX7_ADD_CMD}</code>
                <button type="button" class="copy-btn copy-btn-line" data-copy="${CTX7_ADD_CMD}" hidden>Copy</button>
              </div>
              <div class="cmd-item">
                <div class="cmd-label"><strong>Claude Code</strong><span>GitHub plugin</span></div>
                <code class="cmd-code">${CLAUDE_PLUGIN_CMD}</code>
                <button type="button" class="copy-btn copy-btn-line" data-copy="${CLAUDE_PLUGIN_CMD}" hidden>Copy</button>
              </div>
              <div class="cmd-item">
                <div class="cmd-label"><strong>Cursor</strong><span>Run in Cursor chat</span></div>
                <code class="cmd-code">${CURSOR_PLUGIN_CMD}</code>
                <button type="button" class="copy-btn copy-btn-line" data-copy="${CURSOR_PLUGIN_CMD}" hidden>Copy</button>
              </div>
              <div class="cmd-item">
                <div class="cmd-label"><strong>Antigravity</strong><span>Plugin</span></div>
                <code class="cmd-code">${AGY_PLUGIN_CMD}</code>
                <button type="button" class="copy-btn copy-btn-line" data-copy="${AGY_PLUGIN_CMD}" hidden>Copy</button>
              </div>
              <div class="cmd-item">
                <div class="cmd-label"><strong>OpenAI Codex</strong><span>Marketplace plugin</span></div>
                <code class="cmd-code">${CODEX_MARKETPLACE_CMD}</code>
                <button type="button" class="copy-btn copy-btn-line" data-copy="${CODEX_MARKETPLACE_CMD}" hidden>Copy</button>
              </div>
              <div class="cmd-item" id="mcp">
                <div class="cmd-label"><strong>Live store data (optional)</strong><span>Read-only, owner approves</span></div>
                <code class="cmd-code">${escape(mcpUrl)}</code>
                <button type="button" class="copy-btn copy-btn-line" data-copy="${escape(mcpUrl)}" hidden>Copy</button>
              </div>
            </div>
            <p class="setup-foot">${liveStoreNote}</p>
            <p class="setup-foot">${releaseNote}</p>
          </div>
        </details>
        <p class="setup-foot">ZIP files, ChatGPT Projects, and error fixes are in <a href="${pagePath(config, '/setup')}">the setup guide</a> · <a href="${SHOPIFY_AFFILIATE}" target="_blank" rel="sponsored noopener noreferrer">Start a free Shopify trial</a> (affiliate link).</p>
      </div>
    </section>

    <section id="faq" class="band" aria-labelledby="faq-heading">
      <div class="shell" data-reveal>
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
      title: HELP_TITLE,
      description: HELP_DESCRIPTION,
      canonicalPath: '/shopify-va/setup',
      includeSocialMeta: true,
    },
    `
    <div class="page-body shell">
      <div class="doc-head">
        <h1>How to set up</h1>
        <p>Connect all ${SKILL_COUNT} Shopify skills in four steps. Other ways to connect and fixes for common problems are further down.</p>
      </div>
      <section id="quick-start">
        <h2>Set up in four steps</h2>
        <p>You don't need an account or store access to start.</p>
        <h3>1. Connect your AI</h3>
        <p>Claude: open Settings → Connectors → Add custom connector, paste this link, and save.</p>
        <pre class="command" tabindex="0"><code>${escape(openMcpUrl)}</code></pre>
        <button type="button" class="copy-btn copy-btn-line" data-copy="${escape(openMcpUrl)}" hidden>Copy link</button>
        <p>ChatGPT: open Settings → Apps &amp; Connectors and create a custom connector with the same link. Some plans need Developer mode turned on first.</p>
        <p>Coding agents (Claude Code, Codex, Cursor, and others): run <code>${CLI_ADD_CMD}</code> once.</p>
        <h3>2. Try one product listing</h3>
        <p>Open a new chat and paste this prompt. Fill in the brackets with facts the store owner has confirmed. Your AI app asks about anything missing, then writes the draft.</p>
        <pre class="request" tabindex="0"><code>${escape(firstRequest)}</code></pre>
        <button type="button" class="copy-btn copy-btn-line" data-copy="${escape(firstRequest)}" hidden>Copy prompt</button>
        <h3>3. Use it for daily tasks</h3>
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
          <li>Get approval before any store change. Your AI app only reads and drafts, so you or the owner apply changes in Shopify Admin.</li>
        </ol>
        <p>Each skill is listed on the <a href="${pagePath(config, '#skills')}">main page</a> with a starter prompt you can copy. Other ways to connect are below.</p>
      </section>
      <section id="install-help">
        <h2>All ways to connect</h2>
        <dl>
          <dt>ChatGPT and Claude (custom connector)</dt>
          <dd><p>Add <code>${escape(openMcpUrl)}</code> as a custom connector (remote MCP server). It gives your AI app all ${SKILL_COUNT} skills and 8 VA task workflows.</p></dd>
          <dt>Agent Skills CLI (most coding agents)</dt>
          <dd><p>Run <code>${CLI_ADD_CMD}</code>. To see the list before you install, run <code>${CLI_ADD_CMD} --list</code>.</p></dd>
          <dt>Context7 CLI</dt>
          <dd><p>Run <code>${CTX7_ADD_CMD}</code> to install all ${SKILL_COUNT} skills through Context7.</p></dd>
          <dt>Claude Code plugin</dt>
          <dd><p>Run <code>${CLAUDE_PLUGIN_CMD}</code> in your terminal, or <code>${CLAUDE_SESSION_CMD}</code> inside a session. To confirm all ${SKILL_COUNT} skills loaded, run <code>claude plugin details shopify-va-toolkit</code>.</p></dd>
          <dt>Cursor plugin</dt>
          <dd><p>Run <code>${CURSOR_PLUGIN_CMD}</code> inside Cursor chat, or use the Agent Skills CLI above.</p></dd>
          <dt>Antigravity plugin</dt>
          <dd><p>Run <code>${AGY_PLUGIN_CMD}</code> in your terminal to install the plugin.</p></dd>
          <dt>OpenAI Codex plugin</dt>
          <dd><p>Run <code>${CODEX_MARKETPLACE_CMD}</code>, then <code>${CODEX_PLUGIN_CMD}</code>. ${plugin ? `Or download <a href="${escape(plugin)}">the skills-only plugin file</a>.` : `Or browse <a href="${RELEASE_TAG_URL}">Release ${RELEASE_VERSION}</a>.`}</p></dd>
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
            ? `<ol class="steps"><li>The store owner installs <a href="${install}">MKT Skills VA Toolkit</a> on the target Shopify store.</li><li>In Claude or ChatGPT connectors, enter <code>${escape(connectionUrl)}</code>.</li><li>Sign in, then paste the pairing code in Shopify Admin so the store owner can approve read access.</li><li>Ask your AI app to show the store name first, so you know it's the right store.</li></ol>`
            : `<p>The live store connection is waiting for Shopify App Store review. Until then, use the link or CLI above. After approval, or on a development store, add this remote MCP server URL:</p><pre class="command" tabindex="0"><code>${escape(connectionUrl)}</code></pre>`
        }
        <p>This connection is read-only and uses OAuth 2.1 with PKCE. By default it asks for three read scopes (<code>read_products</code>, <code>read_inventory</code>, and <code>read_orders</code>), so it cannot edit products, send customer emails, take payments, or issue refunds.</p>
        <p>The store owner can also turn on four optional read scopes inside the app: <code>read_reports</code>, <code>read_discounts</code>, <code>read_themes</code>, and <code>read_customers</code>. Even with <code>read_customers</code> enabled, the server reads totals only and never pulls buyer names or emails.</p>
        <p><a href="https://help.openai.com/en/articles/11487775-connectors-in-chatgpt">ChatGPT connector docs</a> · <a href="https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp">Claude MCP docs</a></p>
      </section>
      <section>
        <h2>Fix common issues</h2>
        <dl>
          <dt>My AI app won't accept Markdown (.md) files</dt>
          <dd>Use the connector link instead, or rename copies of the files to <code>.txt</code>.</dd>
          <dt>Sign-in code expired</dt>
          <dd>Start a new sign-in. Old codes can't be reused.</dd>
          <dt>Owner approval is pending</dt>
          <dd>Ask the store owner to approve the code in Shopify Admin. Staff accounts can't approve AI connections.</dd>
          <dt>Results show only one page</dt>
          <dd>Ask your AI app to read the next page, or to tell you which records it checked.</dd>
        </dl>
      </section>
      <section>
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
      title: PRIVACY_TITLE,
      description: PRIVACY_DESCRIPTION,
      canonicalPath: '/shopify-va/privacy',
    },
    `
    <div class="page-body shell">
      <div class="doc-head">
        <h1>Privacy notice</h1>
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
      <section>
        <h2>Your controls and contact</h2>
        <p>Store owners approve every live store connection in Shopify Admin. They can remove access or uninstall the app at any time. We respond to Shopify's customer data request and data deletion webhooks.</p>
        <p>Email <a href="mailto:${SUPPORT}">${SUPPORT}</a> for privacy requests, or open <a href="${REPOSITORY}/issues">GitHub issues</a>. This service is free under the MIT license, with no payments, ad trackers, or data sales.</p>
      </section>
    </div>`,
    config,
  );
}

export function renderLlmsTxt(config: PublicPageConfig = {}): string {
  const openMcpUrl = openMcpEndpoint(config);
  const mcpUrl = mcpEndpoint(config);
  const skillLines = SKILL_CATALOG.map(
    skill => `- [${skill.name}](${sourceFile(`skills/${skill.slug}/SKILL.md`)}): ${skill.summary}`,
  ).join('\n');
  return `# Marketing Skills: Shopify VA Skills

> 19 free MIT-licensed Shopify skills for ChatGPT, Claude, and coding agents such as Claude Code, Codex, and Cursor. Your AI app drafts store work, and a person approves every store change. Built by Vince Servidad.

## Connect or install

- [Live guide](${SITE_ORIGIN}/shopify-va): Problem finder, a searchable list of all 19 skills, where each step happens, and an FAQ
- [How to set up](${SITE_ORIGIN}/shopify-va/setup): Four-step setup guide, all install options, and troubleshooting
- [No-login Remote MCP server](${openMcpUrl}): Streamable HTTP, no account or sign-in. Serves all ${SKILL_COUNT} Shopify skills, reference files, and 8 VA task workflows read-only
- [Optional signed-in Remote MCP server](${mcpUrl}): Streamable HTTP with OAuth 2.1 + PKCE for read-only Shopify Admin checks (pending Shopify App Store review)
- Agent Skills CLI: \`${CLI_ADD_CMD}\`
- Context7 CLI: \`${CTX7_ADD_CMD}\`
- Claude Code plugin: \`${CLAUDE_PLUGIN_CMD}\`
- Cursor plugin: \`${CURSOR_PLUGIN_CMD}\`
- Antigravity plugin: \`${AGY_PLUGIN_CMD}\`
- OpenAI Codex plugin: \`${CODEX_MARKETPLACE_CMD}\` then \`${CODEX_PLUGIN_CMD}\`
- [GitHub repository](${REPOSITORY})

## Official Shopify reference files included

- Google Merchant Center Next & Performance Max Feed guide (\`skills/shopify-google-ads/references/merchant-center-next-pmax.md\`)
- Meta Advantage+ Shopping & Conversions API (CAPI) guide (\`skills/shopify-meta-ads/references/advantage-plus-capi.md\`)
- Checkout Extensibility, Web Pixels & Shopify Functions guide (\`skills/shopify-theme-development/references/checkout-extensibility-pixels.md\`)
- Shopify Markets & Multi-Location Order Routing guide (\`skills/shopify-order-operations/references/multi-location-routing-markets.md\`)
- Official Shopify Flow Operational Recipes (\`skills/shopify-flow-automation/references/official-flow-recipes.md\`)
- Chargeback & Payment Dispute Evidence guide (\`skills/shopify-order-operations/references/chargeback-evidence.md\`)
- Shipping Profiles, Carrier Rates & 3PL Exceptions guide (\`skills/shopify-order-operations/references/shipping-3pl-exceptions.md\`)
- Store Launch, Migration & Peak-Sale (BFCM) Readiness guide (\`skills/shopify-store-audit/references/launch-migration-bfcm.md\`)
- App Stack Hygiene & Product Review Moderation guide (\`skills/shopify-store-audit/references/app-stack-reviews.md\`)
- Subscriptions & Multi-Channel Sales Sync guide (\`skills/shopify-catalog-operations/references/subscriptions-multichannel.md\`)
- Cross-Skill Build, Launch & Marketing Sequence guide (\`skills/shopify-va/references/skill-sequence.md\`)
- Client Deliverable Templates: CSV QA, BFCM, Chargeback & Handover (\`skills/shopify-va/references/deliverable-templates.md\`)
- Official Meta Ads Experiments, Auction, Catalog & Compliance guide (\`skills/shopify-meta-ads/references/official-meta-methods.md\`)
- Official Google Ads Enhanced Conversions, Smart Bidding & Merchant Center guide (\`skills/shopify-google-ads/references/official-google-methods.md\`)
- Email Deliverability & TCPA/CTIA SMS Compliance guide (\`skills/shopify-email-marketing/references/deliverability-sms-compliance.md\`)
- Technical SEO, Product JSON-LD & Core Web Vitals Standards (\`skills/shopify-seo/references/technical-seo-standards.md\`)
- CRO Experiment Validity, SRM & Mobile Friction Standards (\`skills/shopify-cro/references/experiment-validity-friction.md\`)
- FTC Endorsement & Review Compliance guide (\`skills/shopify-creative-strategy/references/ftc-endorsement-compliance.md\`)
- Product Page Social Proof Compliance & Mobile UX Standards (\`skills/shopify-product-page/references/proof-compliance-mobile-ux.md\`)
- Shopify Analytics, GA4 & Consent Mode v2 Reconciliation guide (\`skills/shopify-analytics/references/shopify-analytics-ga4-consent.md\`)
- Theme Performance, Accessibility & App Extensions Standards (\`skills/shopify-theme-development/references/performance-accessibility-extensions.md\`)
- Shopify Product Taxonomy, GTIN, HS Code & EU GPSR Compliance guide (\`skills/shopify-product-listing/references/taxonomy-compliance.md\`)
- High-Variant Catalogs, productSet & Combined Listings guide (\`skills/shopify-catalog-operations/references/high-variant-combined-listings.md\`)
- Shopify Search & Discovery and Native Bundles guide (\`skills/shopify-merchandising/references/search-discovery-bundles.md\`)

## All ${SKILL_COUNT} Shopify skills

${skillLines}

## Parent library

- [Marketing Skills](${FAMILY_HOME}): 133 free marketing skills for AI agents
`;
}

export function renderAppHome(config: AppHomeConfig): string {
  const workflows = WORKFLOWS.map(workflow => `<details class="workflow"><summary>${escape(workflow.title)}</summary><p>${escape(workflow.purpose)}</p><p><strong>Have ready:</strong> ${escape(workflow.required_inputs.map(input => input.replaceAll('_', ' ')).join(', '))}.</p><ol>${workflow.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol><p><strong>Expected result:</strong> ${escape(workflow.output_sections.join(', '))}.</p><ul>${workflow.qa.map(item => `<li>${escape(item)}</li>`).join('')}</ul><p><a href="${sourceCandidateFile(`skills/${workflow.owner_skill}/${workflow.reference}`)}" target="_blank" rel="noopener noreferrer">Open the full guide and template</a></p></details>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="shopify-api-key" content="${escape(config.clientId)}"><title>MKT Skills VA Toolkit</title><script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script><script src="https://cdn.shopify.com/shopifycloud/polaris-1.1.js"></script><link rel="stylesheet" href="/assets/public.css"><script src="/assets/app-home.js" defer></script></head><body class="app-home"><a class="skip-link" href="#app-main">Skip to content</a><main id="app-main"><s-page heading="MKT Skills VA Toolkit"><s-section heading="Your store connection"><p id="session-status" role="status" aria-live="polite">Checking your Shopify session…</p><p>Free, read-only tools and task guides. Store changes, sent replies and refunds are not available through this connection.</p><div class="actions"><s-button id="retry-session">Check session again</s-button></div></s-section><div id="authenticated-content" hidden><s-section heading="Extra read permissions"><p>Sales reports, discounts, theme files and customer totals use four optional read permissions: <code>read_reports</code>, <code>read_discounts</code>, <code>read_themes</code> and <code>read_customers</code>. They stay off until the store owner grants them here. With them, the app still cannot change anything, and customer access returns totals only, never names or emails.</p><p id="optional-scopes-status" role="status"></p><s-button id="request-optional-scopes" disabled>Grant extra read permissions</s-button></s-section><s-section heading="Choose a VA job"><p>Use these instructions with your client's approved facts in ChatGPT or Claude. Client documents stay in that chat or project. The app does not run an AI task or certify expertise.</p>${workflows}</s-section><s-section heading="Check store information"><p>Read one page at a time. Check the store, retrieval time and coverage before using the result. These checks cannot change any store record.</p><form id="product-search" class="search-form"><label for="product-query">Product search <span class="muted">(optional)</span></label><input id="product-query" name="query" maxlength="500" autocomplete="off"><div class="actions"><s-button id="read-shop" type="button">Check store identity</s-button><s-button id="read-products" type="button">View products</s-button><s-button id="read-orders" type="button">View recent orders</s-button></div></form><p id="evidence-status" role="status" aria-live="polite">Choose a check to read current data.</p><div id="evidence-result" class="evidence-result"></div><s-button id="next-page" hidden>Read next page</s-button></s-section><s-section heading="Approve an AI connection"><p id="owner-guidance">The store owner must review and approve each connection.</p><form id="pairing-form"><label for="pairing-code">Connection request code</label><input id="pairing-code" name="pairing_code" maxlength="128" autocomplete="off" spellcheck="false" aria-describedby="pairing-help"><p id="pairing-help" class="muted">Copy this code from the original ChatGPT or Claude sign-in tab. Only approve a request you recognize.</p><s-button id="inspect-pairing" type="button" disabled>Review request</s-button></form><p id="pairing-status" role="status" aria-live="polite"></p><div id="pairing-review" hidden><dl id="pairing-facts"></dl><p>This authorizes supported read access to the displayed store. It does not grant store editing permission.</p><s-button id="approve-pairing" variant="primary" disabled>Approve this connection</s-button><s-button id="cancel-pairing">Cancel review</s-button></div></s-section><s-section heading="Approved AI connections"><p>Disconnecting stops this client's future access. It does not delete existing conversations in the AI service.</p><s-button id="refresh-connections">Refresh connections</s-button><p id="connections-status" role="status" aria-live="polite"></p><div id="connections-list"></div></s-section></div><s-section heading="Help"><p>First time using the guides? <a href="/help" target="_blank" rel="noopener noreferrer">Open the first-task walkthrough</a>. <a href="/privacy" target="_blank" rel="noopener noreferrer">Read the privacy notice</a>.</p><p>Missing facts, policies and stock thresholds need an owner decision. No background monitoring or scheduled work is enabled.</p></s-section></s-page></main></body></html>`;
}
