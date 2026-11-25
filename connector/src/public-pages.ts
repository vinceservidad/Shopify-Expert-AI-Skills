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
const RELEASE_VERSION = 'v0.2.2';
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
  '19 free, open-source Shopify skills for ChatGPT, Claude, Claude Code, Codex, and Cursor. Your AI drafts the work, and you approve anything that changes the store.';
const HELP_TITLE = 'How to Set Up | Shopify VA Skills | Marketing Skills';
const HELP_DESCRIPTION =
  'How to add the 19 Shopify VA skills to ChatGPT, Claude, Claude Code, Codex, Cursor, Windsurf, GitHub Copilot, or Antigravity, plus fixes for common setup issues.';
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
    prompt: 'Check my Shopify product sheet for missing prices, blank stock, and messy tags. Give me a safe fix plan before I import it.',
  },
  {
    problem: 'Shoppers view products but don\'t buy',
    fixFirst: 'Product Pages',
    checkNext: 'Conversion Rate (CRO), Store Audit',
    prompt: 'Review this Shopify product page on mobile. List the top three things stopping buyers and draft clearer copy.',
  },
  {
    problem: 'Split shipments, shipping errors, or stuck 3PL orders',
    fixFirst: 'Order Operations',
    checkNext: 'Shopify Flow, Customer Support',
    prompt: 'Check our Shopify shipping profiles, Markets routing, and stuck 3PL orders. Show why orders split or fail checkout and write a safe fix plan.',
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
    prompt: 'Audit our installed Shopify apps, product review spam rules, and SKU sync for TikTok Shop and the Shop app. List the lowest-risk fixes first.',
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
    prompt: 'Check our Meta Advantage+ campaigns, Conversions API event match quality, and creative mix. Tell me what to fix before we raise the budget.',
  },
];

const SIDEKICK_ROWS: readonly { job: string; ours: string; sidekick: string }[] = [
  // ours: what the playbooks plan and draft in your AI app. sidekick: where the approved change is made.
  {
    job: 'Google, Meta, and email marketing',
    ours: 'Audit Merchant Center feeds, Performance Max, the Conversions API, and email flows.',
    sidekick: 'Fix the product data and settings the audit flags, in Shopify admin or the ad platform.',
  },
  {
    job: 'Theme code and web pixels',
    ours: 'Plan Liquid edits, checkout UI extension limits, and pixel checks, with a rollback step.',
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
    sidekick: 'Submit the evidence and update settings in Shopify admin or the channel app.',
  },
  {
    job: 'Several clients or a store not live yet',
    ours: 'Work from exports and notes in ChatGPT, Claude, Cursor, or Codex. No store login needed.',
    sidekick: 'Sign in to each store\'s admin when a change is approved.',
  },
  {
    job: 'Quick edits inside the admin',
    ours: 'The skills don\'t make store changes.',
    sidekick: 'Use Shopify admin, or Shopify Sidekick, the AI assistant built into it.',
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

export const FAQ_ITEMS: readonly { question: string; answer: string }[] = [
  {
    question: 'What are Shopify skills for AI agents?',
    answer:
      'Shopify skills are instruction files, with reference docs, that your AI loads when you ask for store work. Each skill tells the AI which facts to ask for, which Shopify rules apply, and what to check before it writes a draft. The 19 skills cover product listings, inventory, orders, chargebacks, support, ads, SEO, and theme code.',
  },
  {
    question: 'Are these Shopify skills free?',
    answer:
      'Yes. All 19 skills are open source under the MIT license, and you can read each one on GitHub before you install it. You don\'t need an account or a credit card.',
  },
  {
    question: 'Which AI apps work with Shopify VA Skills?',
    answer:
      'In ChatGPT and Claude, you add one link as a custom connector. Claude Code, OpenAI Codex, Cursor, Windsurf, GitHub Copilot, and Antigravity install all 19 skills with one command.',
  },
  {
    question: 'Do I need to connect my live Shopify store?',
    answer:
      'No. Paste product specs, CSV exports, support tickets, or ad reports into the chat, and the skills work from those. A read-only connection to your live store is optional.',
  },
  {
    question: 'Can these skills change my store, prices or orders?',
    answer:
      'No. The skills and the store connection can only read data and write drafts. Your AI gives you drafts, plans, and review checklists. You make any change yourself in Shopify admin.',
  },
  {
    question: 'How do I know which skill to use first?',
    answer:
      'You don\'t need to know the skill names. Describe the problem in plain words, like "our stock counts are wrong" or "new products take too long to list." Your AI picks the matching skill.',
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
    <input class="wb-radio" type="radio" name="wb" id="wb-open" checked>
    <input class="wb-radio" type="radio" name="wb" id="wb-cli">
    <div class="wb-tabs" role="tablist" aria-label="Quick setup">
      <label for="wb-open">ChatGPT &amp; Claude</label>
      <label for="wb-cli">Coding agents</label>
    </div>
    <div class="wb-panels">
      <div class="wb-panel wb-open">
        <div class="wb-row"><code>${escape(openMcpUrl)}</code><button type="button" class="copy-btn" data-copy="${escape(openMcpUrl)}" hidden>Copy link</button></div>
        <p class="wb-note">Add this link as a custom connector in Claude or ChatGPT. <a href="${guideUrl}">Setup guide</a> · <a href="#setup">See all 8 apps</a></p>
      </div>
      <div class="wb-panel wb-cli">
        <div class="wb-row"><code>${CLI_ADD_CMD}</code><button type="button" class="copy-btn" data-copy="${CLI_ADD_CMD}" hidden>Copy command</button></div>
        <p class="wb-note">Installs all ${SKILL_COUNT} skills in Claude Code, Codex, Cursor, Windsurf, Copilot, and Antigravity.</p>
      </div>
    </div>
  </div>`;
}

function bottleneckTable(): string {
  const rows = BOTTLENECKS.map(
    row => `<tr><td class="bn-problem">${escape(row.problem)}</td><td class="bn-first">${escape(row.fixFirst)}</td><td class="bn-next">${escape(row.checkNext)}</td><td class="bn-action"><button type="button" class="copy-btn copy-btn-line" data-copy="${escape(row.prompt)}">Copy prompt</button></td></tr>`,
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
        <p class="hero-sub">19 free skills for the daily work of a Shopify virtual assistant (VA): listings, inventory, orders, support, ads, and theme code. They work in ChatGPT, Claude, and coding agents. Your AI drafts the work, and you approve anything that changes the store.</p>
        ${heroWorkbench(openMcpUrl, pagePath(config, '/setup'))}
      </div>
    </section>

    <section id="how-it-works" class="band" aria-labelledby="how-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="how-heading">How it works</h2>
          <p>Each skill tells your AI which facts to collect and what to check before it hands you a draft.</p>
        </div>
        <div class="steps-grid">
          <div class="step-item">
            <span class="step-num">01</span>
            <h3>Connect</h3>
            <p>Add one link in ChatGPT or Claude, or run one command for your coding agent.</p>
          </div>
          <div class="step-item">
            <span class="step-num">02</span>
            <h3>Ask</h3>
            <p>Describe the task in plain words, like a product listing, a stock check, or a reply to a late-order email.</p>
          </div>
          <div class="step-item">
            <span class="step-num">03</span>
            <h3>Review</h3>
            <p>Your AI asks for missing facts, then writes the draft. You decide what goes live in Shopify.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="bottlenecks" class="band band-mist" aria-labelledby="bottlenecks-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="bottlenecks-heading">Common store problems</h2>
          <p>Each row lists a problem, the skill to start with, what to check next, and a prompt you can copy.</p>
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
          <p>The skills plan and draft in your AI app. Someone with the right permissions still makes the approved change in Shopify admin or the ad platform.</p>
        </div>
        ${sidekickComparisonTable()}
      </div>
    </section>

    <section id="setup" class="band band-mist" aria-labelledby="setup-heading">
      <div class="shell" data-reveal>
        <div class="section-head">
          <h2 id="setup-heading">Setup</h2>
          <p>Use the link in ChatGPT or Claude, or install the skills for your coding agent. Step-by-step instructions are in the <a href="${pagePath(config, '/setup')}">setup guide</a>.</p>
        </div>
        ${supportedAppsMatrix()}
        <div class="cmd-list">
          <div class="cmd-item">
            <div class="cmd-label"><strong>ChatGPT and Claude</strong><span>Custom connector, no sign-in</span></div>
            <code class="cmd-code">${escape(openMcpUrl)}</code>
            <button type="button" class="copy-btn copy-btn-line" data-copy="${escape(openMcpUrl)}" hidden>Copy</button>
          </div>
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
        <p class="setup-foot">${releaseNote} · Opening a new store? <a href="${SHOPIFY_AFFILIATE}" target="_blank" rel="sponsored noopener noreferrer">Start a free Shopify trial</a>.</p>
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
        <p><strong>Claude:</strong> open Settings → Connectors → Add custom connector, paste this link, and save.</p>
        <pre class="command" tabindex="0"><code>${escape(openMcpUrl)}</code></pre>
        <p><strong>ChatGPT:</strong> open Settings → Apps &amp; Connectors and create a custom connector with the same link. Some plans need Developer mode turned on first.</p>
        <p><strong>Coding agents</strong> (Claude Code, Codex, Cursor, and others): run <code>${CLI_ADD_CMD}</code> once.</p>
        <h3>2. Try one product listing</h3>
        <p>Open a new chat and paste this prompt. Fill in the brackets with facts the store owner has confirmed. The AI asks about anything missing, then writes the draft.</p>
        <pre class="request" tabindex="0"><code>${escape(firstRequest)}</code></pre>
        <h3>3. Use it for daily tasks</h3>
        <p>Describe the problem in plain words, and the AI picks the right skill. For example:</p>
        <ul>
          <li>"Check this product CSV for missing prices and duplicate SKUs."</li>
          <li>"Draft a reply to this late-order email using our shipping policy."</li>
          <li>"Build a chargeback evidence packet from these order details."</li>
          <li>"Our Merchant Center feed has disapproved products. What should I fix first?"</li>
        </ul>
        <h3>4. Follow three rules</h3>
        <ol class="steps">
          <li><strong>Paste only what the task needs.</strong> Never paste passwords, API keys, card details, or extra customer data.</li>
          <li><strong>Treat every answer as a draft.</strong> Check it against the facts the store owner gave you before you use it.</li>
          <li><strong>Get approval before any store change.</strong> The AI only reads and drafts. You or the owner make the change in Shopify admin.</li>
        </ol>
        <p>Each skill is listed on the <a href="${pagePath(config, '#skills')}">main page</a> with a starter prompt you can copy. Other ways to connect are below.</p>
      </section>
      <section id="install-help">
        <h2>All ways to connect</h2>
        <dl>
          <dt>ChatGPT and Claude (custom connector)</dt>
          <dd><p>Add <code>${escape(openMcpUrl)}</code> as a custom connector (remote MCP server). It gives your AI all ${SKILL_COUNT} skills and 8 task guides.</p></dd>
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
          <dd><p>Download <a href="${STARTER_SKILL_ZIP_URL}"><code>shopify-va.zip</code></a> or <a href="${PRODUCT_LISTING_ZIP_URL}"><code>shopify-product-listing.zip</code></a> from <a href="${RELEASE_TAG_URL}">Release ${RELEASE_VERSION}</a>. Upload the ZIP without unzipping it under Customize → Skills, then turn it on. The Anthropic Plugin Directory listing (<code>MKT Skills — Shopify VA</code>) is under review.</p></dd>
          <dt>ChatGPT Projects (manual setup)</dt>
          <dd><p>Download and unzip a skill ZIP from <a href="${RELEASE_TAG_URL}">${RELEASE_VERSION}</a>. Paste the text of <code>SKILL.md</code> into Project instructions. Upload the files in <code>references/</code> as project files.</p></dd>
        </dl>
        <p><a href="${sourceFile('docs/ai-agent-setup.md')}">Full agent setup guide</a> · <a href="${RELEASE_TAG_URL}">All ${RELEASE_VERSION} downloads</a> · <a href="${SOURCE_ZIP}">Full source ZIP</a></p>
      </section>
      <section id="store-connection">
        <h2>Read live store data (optional)</h2>
        ${
          install
            ? `<ol class="steps"><li>The store owner installs <a href="${install}">MKT Skills VA Toolkit</a> on the target Shopify store.</li><li>In Claude or ChatGPT connectors, enter <code>${escape(connectionUrl)}</code>.</li><li>Sign in, then paste the pairing code in Shopify admin so the store owner can approve read access.</li><li>Ask your AI to show the store name first, so you know it's the right store.</li></ol>`
            : `<p>The live store connection is waiting for Shopify App Store review. Until then, use the link or CLI above. After approval, or on a development store, add this remote MCP server URL:</p><pre class="command" tabindex="0"><code>${escape(connectionUrl)}</code></pre>`
        }
        <p>The connection is read-only. It requests only <code>read_products</code>, <code>read_inventory</code>, and <code>read_orders</code> access, through OAuth 2.1 with PKCE. It can't edit products, send emails, take payments, or refund orders.</p>
        <p><a href="https://help.openai.com/en/articles/11487775-connectors-in-chatgpt">ChatGPT connector docs</a> · <a href="https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp">Claude MCP docs</a></p>
      </section>
      <section>
        <h2>Fix common issues</h2>
        <dl>
          <dt>My chat app won't accept Markdown (.md) files</dt>
          <dd>Use the connector link instead, or rename copies of the files to <code>.txt</code>.</dd>
          <dt>Sign-in code expired</dt>
          <dd>Start a new sign-in. Old codes can't be reused.</dd>
          <dt>Owner approval is pending</dt>
          <dd>Ask the store owner to approve the code in Shopify admin. Staff accounts can't approve AI connections.</dd>
          <dt>Results show only one page</dt>
          <dd>Ask your AI to read the next page, or to tell you which records it checked.</dd>
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
        <p>The no-sign-in link serves only the public skills and stores no user data. The optional live store connection runs only after the store owner approves it. It runs fixed, read-only Shopify queries with three access scopes: <code>read_products</code>, <code>read_inventory</code>, and <code>read_orders</code>.</p>
        <p>Order queries leave out buyer names, addresses, emails, phone numbers, and card details. Shopify still treats order records as protected customer data.</p>
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
        <p>Store owners approve every live store connection in Shopify admin. They can remove access or uninstall the app at any time. We respond to Shopify's customer data request and data deletion webhooks.</p>
        <p>Email <a href="mailto:${SUPPORT}">${SUPPORT}</a> for privacy requests, or open <a href="${REPOSITORY}/issues">GitHub issues</a>. This project is free. It takes no payments, runs no ad trackers, and sells no data.</p>
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

> 19 free, open-source (MIT) Shopify skills for ChatGPT, Claude, Claude Code, Codex, Cursor, Windsurf, GitHub Copilot, and Antigravity. The AI reads and drafts; a person approves every store change. Built by Vince Servidad.

## Connect or install

- [Live guide](${SITE_ORIGIN}/shopify-va): Problem finder, a searchable list of all 19 skills, where each step happens, and an FAQ
- [How to set up](${SITE_ORIGIN}/shopify-va/setup): Four-step setup guide, all install options, and troubleshooting
- [No-login Remote MCP server](${openMcpUrl}): Streamable HTTP, no account or sign-in. Serves all ${SKILL_COUNT} Shopify skills, official playbooks, and 8 VA task guides read-only
- [Optional signed-in Remote MCP server](${mcpUrl}): Streamable HTTP with OAuth 2.1 + PKCE for read-only Shopify Admin checks (pending Shopify App Store review)
- Agent Skills CLI: \`${CLI_ADD_CMD}\`
- Context7 CLI: \`${CTX7_ADD_CMD}\`
- Claude Code plugin: \`${CLAUDE_PLUGIN_CMD}\`
- Cursor plugin: \`${CURSOR_PLUGIN_CMD}\`
- Antigravity plugin: \`${AGY_PLUGIN_CMD}\`
- OpenAI Codex plugin: \`${CODEX_MARKETPLACE_CMD}\` then \`${CODEX_PLUGIN_CMD}\`
- [GitHub repository](${REPOSITORY})

## Official & end-to-end VA playbooks included

- Google Merchant Center Next & Performance Max Feed Playbook (\`skills/shopify-google-ads/references/merchant-center-next-pmax.md\`)
- Meta Advantage+ Shopping & Conversions API (CAPI) Playbook (\`skills/shopify-meta-ads/references/advantage-plus-capi.md\`)
- Checkout Extensibility, Web Pixels & Shopify Functions Playbook (\`skills/shopify-theme-development/references/checkout-extensibility-pixels.md\`)
- Shopify Markets & Multi-Location Order Routing Playbook (\`skills/shopify-order-operations/references/multi-location-routing-markets.md\`)
- Official Shopify Flow Operational Recipes (\`skills/shopify-flow-automation/references/official-flow-recipes.md\`)
- Chargeback & Payment Dispute Evidence Playbook (\`skills/shopify-order-operations/references/chargeback-evidence.md\`)
- Shipping Profiles, Carrier Rates & 3PL Exceptions Playbook (\`skills/shopify-order-operations/references/shipping-3pl-exceptions.md\`)
- Store Launch, Migration & Peak-Sale (BFCM) Readiness Playbook (\`skills/shopify-store-audit/references/launch-migration-bfcm.md\`)
- App Stack Hygiene & Product Review Moderation Playbook (\`skills/shopify-store-audit/references/app-stack-reviews.md\`)
- Subscriptions & Multi-Channel Sales Sync Playbook (\`skills/shopify-catalog-operations/references/subscriptions-multichannel.md\`)

## All ${SKILL_COUNT} Shopify skills

${skillLines}

## Parent library

- [Marketing Skills](${FAMILY_HOME}): 133 free marketing playbooks for AI agents
`;
}

export function renderAppHome(config: AppHomeConfig): string {
  const workflows = WORKFLOWS.map(workflow => `<details class="workflow"><summary>${escape(workflow.title)}</summary><p>${escape(workflow.purpose)}</p><p><strong>Have ready:</strong> ${escape(workflow.required_inputs.map(input => input.replaceAll('_', ' ')).join(', '))}.</p><ol>${workflow.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol><p><strong>Expected result:</strong> ${escape(workflow.output_sections.join(', '))}.</p><ul>${workflow.qa.map(item => `<li>${escape(item)}</li>`).join('')}</ul><p><a href="${sourceCandidateFile(`skills/${workflow.owner_skill}/${workflow.reference}`)}" target="_blank" rel="noopener noreferrer">Open the full guide and template</a></p></details>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="shopify-api-key" content="${escape(config.clientId)}"><title>MKT Skills VA Toolkit</title><script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script><script src="https://cdn.shopify.com/shopifycloud/polaris-1.1.js"></script><link rel="stylesheet" href="/assets/public.css"><script src="/assets/app-home.js" defer></script></head><body class="app-home"><a class="skip-link" href="#app-main">Skip to content</a><main id="app-main"><s-page heading="MKT Skills VA Toolkit"><s-section heading="Your store connection"><p id="session-status" role="status" aria-live="polite">Checking your Shopify session…</p><p>Free, read-only tools and task guides. Store changes, sent replies and refunds are not available through this connection.</p><div class="actions"><s-button id="retry-session">Check session again</s-button></div></s-section><div id="authenticated-content" hidden><s-section heading="Choose a VA job"><p>Use these instructions with your client's approved facts in ChatGPT or Claude. Client documents stay in that chat or project. The app does not run an AI task or certify expertise.</p>${workflows}</s-section><s-section heading="Check store information"><p>Read one page at a time. Check the store, retrieval time and coverage before using the result. These checks cannot change any store record.</p><form id="product-search" class="search-form"><label for="product-query">Product search <span class="muted">(optional)</span></label><input id="product-query" name="query" maxlength="500" autocomplete="off"><div class="actions"><s-button id="read-shop" type="button">Check store identity</s-button><s-button id="read-products" type="button">View products</s-button><s-button id="read-orders" type="button">View recent orders</s-button></div></form><p id="evidence-status" role="status" aria-live="polite">Choose a check to read current data.</p><div id="evidence-result" class="evidence-result"></div><s-button id="next-page" hidden>Read next page</s-button></s-section><s-section heading="Approve an AI connection"><p id="owner-guidance">The store owner must review and approve each connection.</p><form id="pairing-form"><label for="pairing-code">Connection request code</label><input id="pairing-code" name="pairing_code" maxlength="128" autocomplete="off" spellcheck="false" aria-describedby="pairing-help"><p id="pairing-help" class="muted">Copy this code from the original ChatGPT or Claude sign-in tab. Only approve a request you recognize.</p><s-button id="inspect-pairing" type="button" disabled>Review request</s-button></form><p id="pairing-status" role="status" aria-live="polite"></p><div id="pairing-review" hidden><dl id="pairing-facts"></dl><p>This authorizes supported read access to the displayed store. It does not grant store editing permission.</p><s-button id="approve-pairing" variant="primary" disabled>Approve this connection</s-button><s-button id="cancel-pairing">Cancel review</s-button></div></s-section><s-section heading="Approved AI connections"><p>Disconnecting stops this client's future access. It does not delete existing conversations in the AI service.</p><s-button id="refresh-connections">Refresh connections</s-button><p id="connections-status" role="status" aria-live="polite"></p><div id="connections-list"></div></s-section></div><s-section heading="Help"><p>First time using the guides? <a href="/help" target="_blank" rel="noopener noreferrer">Open the first-task walkthrough</a>. <a href="/privacy" target="_blank" rel="noopener noreferrer">Read the privacy notice</a>.</p><p>Missing facts, policies and stock thresholds need an owner decision. No background monitoring or scheduled work is enabled.</p></s-section></s-page></main></body></html>`;
}
