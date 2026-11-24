import { WORKFLOWS } from './workflows.js';
import { APP_HOME_SCRIPT } from './public-ui/app-home.js';
import { PUBLIC_STYLES } from './public-ui/styles.js';
import { THEME_SCRIPT } from './public-ui/theme.js';
import { HERO_SCRIPT } from './public-ui/hero-canvas.js';
import { SKILL_COUNT, SKILL_GROUPS } from './public-ui/skill-groups.js';
import { FAVICON_DATA_URI } from './public-ui/favicon.js';

export { APP_HOME_SCRIPT, HERO_SCRIPT, PUBLIC_STYLES, THEME_SCRIPT };

export type PublicPageConfig = {
  publicUrl?: string;
  appHandle?: string;
  basePath?: string;
  launchStage?: 'candidate' | 'public';
  /** Set only after the exact versioned GitHub release asset exists and was checked. */
  pluginDownloadUrl?: string;
};
export type PageConfig = PublicPageConfig;
export type AppHomeConfig = { clientId: string; publicUrl: string; appHandle?: string };

const REPOSITORY = 'https://github.com/vinceservidad/Shopify-Expert-AI-Skills';
const AUTHOR = 'https://www.vinceservidad.com/';
const SHOPIFY_AFFILIATE = 'https://shopify.pxf.io/c/2227499/2974326/13624';
const DEFAULT_MCP_URL = 'https://shopify-mcp.mktskills.com/mcp';
const DEFAULT_OPEN_MCP_URL = 'https://shopify-mcp.mktskills.com/mcp/shopify-skills';
const CLI_ADD_CMD = 'npx skills add vinceservidad/Shopify-Expert-AI-Skills';
const RELEASE_VERSION = 'v0.2.2';
const RELEASE_TAG_URL = `${REPOSITORY}/releases/tag/${RELEASE_VERSION}`;
const RELEASE_DOWNLOAD_BASE = `${REPOSITORY}/releases/download/${RELEASE_VERSION}`;
const STARTER_SKILL_ZIP_URL = `${RELEASE_DOWNLOAD_BASE}/shopify-va.zip`;
const PRODUCT_LISTING_ZIP_URL = `${RELEASE_DOWNLOAD_BASE}/shopify-product-listing.zip`;
const SOURCE_ZIP = `${REPOSITORY}/archive/refs/heads/main.zip`;
const CANDIDATE_ZIP = `${REPOSITORY}/archive/refs/heads/feat/cloudflare-hosted-mcp.zip`;
const SUPPORT = 'support@mktskills.com';
/** The parent MKT Skills site. Absolute, so the family links also work on the connector's own host. */
const FAMILY_HOME = 'https://mktskills.com/';
const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
const sourceFile = (path: string) => `${REPOSITORY}/blob/main/${path}`;
const sourceCandidateFile = (path: string) => `${REPOSITORY}/blob/feat/cloudflare-hosted-mcp/${path}`;
const firstRequest = `Use the attached listing guide and checklists.
Write one product title, a short description, and three bullets.
Use only these approved facts. Ask about missing facts. Do not save or publish anything.

Product name: [name]
Approved facts: [materials, size, features, and confirmed details]
Target customer: [buyer, if known]
Brand tone: [for example, warm and concise]

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

const ARROW = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
/** Hidden until the theme script runs, so a no-JavaScript visitor never sees a dead control. */
const THEME_TOGGLE = '<button type="button" class="theme-toggle" data-mkt-theme-toggle hidden aria-label="Switch to dark mode" title="Switch to dark mode"><svg class="icon-moon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><svg class="icon-sun" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg></button>';

/** The ShopifySkills mark (price tag with a check), inline SVG so it needs no image route. */
const MARK = '<svg class="mark" aria-hidden="true" focusable="false" viewBox="0 0 32 32"><path d="M9.2 7.5h15.3a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H9.2L2.6 16z" fill="currentColor"/><circle class="mark-hole" cx="8.6" cy="16" r="1.7"/><path class="mark-check" d="M13.4 15.6l3.3 3.6 6.4-6.6"/></svg>';
/** The family shell: identical dimensions and breakpoints to mktskills.com
 *  (marketing-skills apps/web/app/connect/setup.css), so switching products never moves the header. */
function layout(title: string, description: string, content: string, config: PublicPageConfig, hasHero = false): string {
  return `<!doctype html><html lang="en" class="site"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(description)}"><title>${escape(title)} | MKT Skills</title><link rel="icon" href="${FAVICON_DATA_URI}" type="image/png" sizes="32x32"><script src="${pagePath(config, '/assets/theme.js')}"></script><script src="${pagePath(config, '/assets/hero.js')}" defer></script><link rel="stylesheet" href="${pagePath(config, '/assets/public.css')}"></head><body${hasHero ? ' class="has-hero"' : ''}><a class="skip-link" href="#main">Skip to content</a><div class="top-bar"><header class="family-header shell"><a class="brand" href="${FAMILY_HOME}">MKT Skills</a><nav class="family-tabs" aria-label="MKT Skills products"><a href="${FAMILY_HOME}">marketing/</a><a href="${pagePath(config)}" aria-current="page">shopify-va/</a></nav><nav class="family-nav" aria-label="Site"><a href="${pagePath(config, '#skills')}">Skills</a><a href="${pagePath(config, '/help')}">Help</a><a href="${REPOSITORY}">GitHub</a></nav></header></div><main id="main">${content}</main><footer class="site-footer shell"><p>Independent toolkit by <a href="${AUTHOR}">Vince Servidad</a>. Not affiliated with Shopify.</p><nav aria-label="Footer navigation"><a href="${FAMILY_HOME}">MKT Skills home</a><a href="${SHOPIFY_AFFILIATE}" target="_blank" rel="sponsored noopener noreferrer">Start with Shopify (affiliate)</a><a href="${pagePath(config, '/help')}">Help and contact</a><a href="${pagePath(config, '/privacy')}">Privacy</a><a href="${REPOSITORY}/blob/main/LICENSE">MIT license</a>${THEME_TOGGLE}</nav></footer></body></html>`;
}

function workflowAccordion(): string {
  return `<div class="job-list">${WORKFLOWS.map((workflow, index) => `<details class="job-option" name="va-job"${index === 0 ? ' open' : ''}><summary><span class="job-title">${escape(workflow.title)}</span><span class="job-file">${escape(workflow.reference.split('/').pop()!)}</span></summary><div class="job-body"><p>${escape(workflow.purpose)}</p><dl class="job-meta"><div><dt>skill</dt><dd>${escape(workflow.owner_skill)}</dd></div><div><dt>needs</dt><dd>${escape(workflow.required_inputs.map(input => input.replaceAll('_', ' ')).join(', '))}</dd></div><div><dt>returns</dt><dd>${escape(workflow.output_sections.join(', '))}</dd></div></dl><a href="${sourceCandidateFile(`skills/${workflow.owner_skill}/${workflow.reference}`)}">Open this job guide</a></div></details>`).join('')}</div>`;
}

function skillTree(): string {
  return `<div class="skill-tree">${SKILL_GROUPS.map(group => `<div class="skill-group"><h3><span class="skill-folder" aria-hidden="true"></span><span class="skill-title">${escape(group.title)}</span><span class="skill-count">${group.skills.length}</span></h3><ul>${group.skills.map(skill => `<li><a href="${sourceFile(`skills/${skill}/SKILL.md`)}">${escape(skill)}</a></li>`).join('')}</ul></div>`).join('')}</div>`;
}

function fileList(): string {
  return `<ul class="file-list"><li><a href="${sourceFile('skills/shopify-product-listing/SKILL.md')}">SKILL.md</a>: product listing rules.</li><li><a href="${sourceFile('skills/shopify-product-listing/references/listing-fields.md')}">listing-fields.md</a>: fields to verify.</li><li><a href="${sourceFile('skills/shopify-product-listing/references/qa-checklist.md')}">qa-checklist.md</a>: final review checklist.</li></ul>`;
}

function heroWorkbench(openMcpUrl: string, mcpUrl: string, install: string | undefined): string {
  return `<div class="workbench" id="install">
    <input class="wb-radio" type="radio" name="wb" id="wb-cli" checked>
    <input class="wb-radio" type="radio" name="wb" id="wb-open">
    <input class="wb-radio" type="radio" name="wb" id="wb-plugins">
    <input class="wb-radio" type="radio" name="wb" id="wb-store">
    <div class="wb-tabs" role="tablist" aria-label="Setup options">
      <label for="wb-cli">CLI</label>
      <label for="wb-open">No-login MCP</label>
      <label for="wb-plugins">Plugins</label>
      <label for="wb-store">Live store MCP</label>
    </div>
    <div class="wb-panels">
      <div class="wb-panel wb-cli">
        <p>Install all ${SKILL_COUNT} Shopify skills in Claude Code, Codex, Cursor, or any Agent Skills tool.</p>
        <pre class="wb-code" tabindex="0"><code>${CLI_ADD_CMD}</code></pre>
        <p class="wb-note">Preview the full list first: <code>${CLI_ADD_CMD} --list</code></p>
      </div>
      <div class="wb-panel wb-open">
        <p>Add this URL in Claude, ChatGPT, or Cursor as a custom MCP server. No sign-in required.</p>
        <pre class="wb-code" tabindex="0"><code>${escape(openMcpUrl)}</code></pre>
        <p class="wb-note">Serves all ${SKILL_COUNT} skills, reference files, and 8 VA task guides read-only.</p>
      </div>
      <div class="wb-panel wb-plugins">
        <p>Install straight from GitHub in Claude Code or Codex.</p>
        <pre class="wb-code" tabindex="0"><code>claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills\n/plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills</code></pre>
        <pre class="wb-code" tabindex="0"><code>codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main\ncodex plugin add shopify-va-toolkit@shopify-skills</code></pre>
        <p class="wb-note">Verify in Claude Code with <code>claude plugin details shopify-va-toolkit</code>.</p>
      </div>
      <div class="wb-panel wb-store">
        <p>Read live store products, variants, inventory, and limited order fields after owner approval.</p>
        <pre class="wb-code" tabindex="0"><code>${escape(mcpUrl)}</code></pre>
        <p class="wb-note">${install ? `Requires the <a href="${install}">MKT Skills VA Toolkit</a> Shopify app. Read-only OAuth 2.1 with PKCE.` : 'Status: Shopify App Store review pending. Read-only OAuth 2.1 with PKCE.'}</p>
      </div>
    </div>
  </div>`;
}

export function renderProductPage(config: PublicPageConfig = {}): string {
  const install = config.launchStage === 'public' ? appLink(config) : undefined;
  const plugin = releaseLink(config);
  const mcpUrl = mcpEndpoint(config);
  const openMcpUrl = openMcpEndpoint(config);
  const archiveBlock = plugin
    ? `<p><a class="button" href="${escape(plugin)}">Download skills-only .plugin (${RELEASE_VERSION}) ${ARROW}</a></p><p class="muted"><a href="${RELEASE_TAG_URL}">All ${SKILL_COUNT} skill ZIPs and SHA256SUMS</a> · <a href="${sourceFile('docs/ai-agent-setup.md')}">Full setup guide</a></p>`
    : `<p class="muted">Direct .plugin download is not configured on this deployment. Browse <a href="${RELEASE_TAG_URL}">${RELEASE_VERSION} release files</a> or the <a href="${SOURCE_ZIP}">source ZIP</a> on GitHub.</p>`;
  return layout('Shopify VA Toolkit', '19 read-only Shopify skills, one-command CLI, no-login MCP link, and a read-only Shopify store MCP server for Claude, ChatGPT, and Codex.', `
    <section class="hero stage"><canvas class="hero-canvas" data-hero-canvas aria-hidden="true"></canvas><div class="shell hero-inner"><h1 class="hero-h1">${MARK}Shopify skills for AI agents</h1><p class="hero-sub">19 read-only playbooks for Claude, ChatGPT, Cursor, and Codex. Give client facts; review every output.</p><a class="hero-cta" href="#install">Connect or install ${ARROW}</a>${heroWorkbench(openMcpUrl, mcpUrl, install)}</div></section>
    <div class="page-body shell">
      <section id="mcp" aria-labelledby="mcp-heading"><div class="split"><div><h2 id="mcp-heading">Live store reads without write risk</h2><p>Start with the no-login MCP link to load every skill and reference file right away. Add the signed-in Shopify MCP server later when you want live catalog, stock, and limited order reads.</p><p>The signed-in server uses <strong>OAuth 2.1 with PKCE</strong> and three scopes: <code>read_products</code>, <code>read_inventory</code>, and <code>read_orders</code>. It excludes buyer PII and payment data, and never edits stores, sends replies, or issues refunds.</p>${install ? `<p><a class="button" href="${install}">Install on Shopify ${ARROW}</a></p>` : `<p><strong>Signed-in store MCP status: Shopify App Store review pending.</strong> The Remote MCP server is live on <code>shopify-mcp.mktskills.com</code> while public store installs and live merchant OAuth tests remain open.</p>`}<p class="muted"><a href="${pagePath(config, '/help#store-connection')}">Read the MCP setup steps</a> · <a href="${sourceFile('docs/plugin-and-connector.md')}">Plugin and MCP docs</a></p></div><div class="endpoint-list"><div class="endpoint-row"><h3>No-login skills MCP</h3><p>Serves all ${SKILL_COUNT} Shopify skills and references in Claude, ChatGPT, or Cursor with zero sign-in.</p><pre class="command" tabindex="0"><code>${escape(openMcpUrl)}</code></pre></div><div class="endpoint-row"><h3>Signed-in Shopify store MCP</h3><p>Reads live store details, products, variants, stock, and limited order fields after owner approval.</p><pre class="command" tabindex="0"><code>${escape(mcpUrl)}</code></pre><p class="muted">Need store edits? Use a separate approved write tool and verify every saved change in Shopify.</p></div></div></div></section>
      <section id="jobs" aria-labelledby="jobs-heading"><h2 id="jobs-heading">Run a real Shopify VA job today</h2><p>Keep client briefs and approved rules inside your chat or project. Every playbook runs on demand and never monitors stores in the background.</p>${workflowAccordion()}<p class="muted">Want all eight VA job guides as Markdown files? <a href="${CANDIDATE_ZIP}">Download the preview source ZIP on GitHub</a>.</p></section>
      <section id="skills" aria-labelledby="skills-heading"><h2 id="skills-heading">One coordinator routes ${SKILL_COUNT} specialist skills</h2><p><code>shopify-va</code> plans mixed tasks and picks the right specialist skill. Each specialist owns its checklist and final output.</p>${skillTree()}</section>
      <section id="first-task" aria-labelledby="start-heading"><div class="split"><div><h2 id="start-heading">Draft your first product listing in five minutes</h2><p>You need Claude or ChatGPT, client product facts, and three files. No live store access is required.</p><ol class="steps"><li>Download and unzip <a href="${PRODUCT_LISTING_ZIP_URL}"><code>shopify-product-listing.zip</code></a> from ${RELEASE_VERSION} (or the <a href="${SOURCE_ZIP}">source ZIP</a>).</li><li>Start a chat in <strong>Claude</strong> or <strong>ChatGPT</strong> and attach these three files:${fileList()}</li><li>Paste the prompt below and replace the brackets with approved product facts.</li><li>Check every claim against your source. Ask the owner to approve final copy.</li></ol><pre class="request" tabindex="0"><code>${escape(firstRequest)}</code></pre><p>You get a draft, missing facts, and a review checklist. Nothing saves to Shopify.</p></div><div class="endpoint-list"><div class="endpoint-row"><h3>Claude Skills ZIP</h3><p>Download <a href="${STARTER_SKILL_ZIP_URL}"><code>shopify-va.zip</code></a> or <a href="${PRODUCT_LISTING_ZIP_URL}"><code>shopify-product-listing.zip</code></a> and upload the ZIP as-is under <strong>Customize → Skills</strong>.</p><p class="muted">The Anthropic Plugin Directory listing (<code>MKT Skills — Shopify VA</code>) is under review.</p></div><div class="endpoint-row"><h3>ChatGPT Projects</h3><p>Unzip a skill ZIP and open <code>SKILL.md</code>. Copy the text below the top <code>---</code> block into <strong>Project instructions</strong>, then upload <code>references/</code> into <strong>Project files</strong>.</p><p class="muted">Use <code>.txt</code> copies or paste plain text if an app blocks <code>.md</code> files.</p></div><div class="endpoint-row"><h3>Portable plugin archive</h3>${archiveBlock}</div><div class="endpoint-row"><h3>Need a Shopify store?</h3><p>Opening a new store or client sandbox? <a href="${SHOPIFY_AFFILIATE}" target="_blank" rel="sponsored noopener noreferrer">Start with Shopify</a>.</p><p class="muted">Affiliate link. This toolkit is independent and not affiliated with Shopify.</p></div><div class="endpoint-row"><h3>Verify every output</h3><ul class="plain-list"><li>Use approved product specs, active rules, and dated reports.</li><li>Check which pages your AI read. One page is not a full audit.</li><li>Keep missing facts marked unknown. A draft is never a live store edit.</li></ul><p class="muted">${config.launchStage === 'public' ? `Review our <a href="${sourceCandidateFile('docs/public-release.md')}">verification record</a>.` : `Dev-store sample reads pass in testing. Shopify App Store approval and live merchant OAuth checks remain open. <a href="${sourceCandidateFile('docs/public-release.md')}">Read the release checklist</a>.`}</p></div></div></div></section>
    </div>`, config, true);
}

export function renderHelpPage(config: PublicPageConfig = {}): string {
  const install = config.launchStage === 'public' ? appLink(config) : undefined;
  const plugin = releaseLink(config);
  const connectionUrl = mcpEndpoint(config);
  const openMcpUrl = openMcpEndpoint(config);
  return layout('Help', 'Install Shopify VA skills v0.2.2 via CLI, no-login MCP, Claude Code, ChatGPT, Cursor, or Codex.', `
    <div class="page-body shell">
      <div class="doc-head"><h1>Setup and troubleshooting</h1><p>Connect with no sign-in via CLI or Remote MCP, or link a live Shopify store when ready.</p></div>
      <section id="install-help"><h2>Easy ways to connect</h2><dl><dt>One-command CLI (all ${SKILL_COUNT} skills)</dt><dd><p>Run <code>${CLI_ADD_CMD}</code>. Preview all ${SKILL_COUNT} skills first with <code>${CLI_ADD_CMD} --list</code>.</p></dd><dt>No-login MCP (Claude, ChatGPT, Cursor)</dt><dd><p>Add <code>${escape(openMcpUrl)}</code> as a custom MCP server URL. It serves all ${SKILL_COUNT} skills and reference files with no login.</p></dd><dt>Claude Code plugin</dt><dd><p>Run <code>claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills</code> in your shell. Or run <code>/plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills</code> inside a session. Check <code>${SKILL_COUNT}</code> loaded skills with <code>claude plugin details shopify-va-toolkit</code>.</p></dd><dt>Codex plugin and .plugin file</dt><dd><p>Run <code>codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main</code>. Then run <code>codex plugin add shopify-va-toolkit@shopify-skills</code>. ${plugin ? `Or download <a href="${escape(plugin)}"><code>shopify-va-toolkit-skills-only.plugin</code></a>.` : `Or browse <a href="${RELEASE_TAG_URL}">Release ${RELEASE_VERSION}</a>.`}</p></dd><dt>Claude web or desktop (Skills ZIP)</dt><dd><p>Download <a href="${STARTER_SKILL_ZIP_URL}"><code>shopify-va.zip</code></a> or <a href="${PRODUCT_LISTING_ZIP_URL}"><code>shopify-product-listing.zip</code></a> from <a href="${RELEASE_TAG_URL}">Release ${RELEASE_VERSION}</a>. Upload the ZIP as-is under <strong>Customize → Skills</strong> and turn it on. The Anthropic Plugin Directory listing (<code>MKT Skills — Shopify VA</code>) is under review.</p></dd><dt>ChatGPT (Projects or chats)</dt><dd><p>Download and unzip a skill ZIP from <a href="${RELEASE_TAG_URL}">${RELEASE_VERSION}</a>. Open <code>SKILL.md</code> and copy the body below the top YAML block into <strong>Project instructions</strong>. Upload files from <code>references/</code> as Project files.</p></dd></dl><p><a href="${sourceFile('docs/ai-agent-setup.md')}">Full agent setup guide</a> · <a href="${RELEASE_TAG_URL}">All ${RELEASE_VERSION} downloads</a></p></section>
      <section><h2>What to upload first</h2><ol class="steps"><li><a href="${PRODUCT_LISTING_ZIP_URL}">Download and unzip <code>shopify-product-listing.zip</code></a> (or the <a href="${SOURCE_ZIP}">source ZIP</a>).</li><li>Attach these three files in a new Claude or ChatGPT chat:${fileList()}</li><li>Add product name, specs, buyer type, and brand tone. Write <strong>unknown</strong> for missing facts.</li><li><a href="${pagePath(config, '#first-task')}">Copy the first-task prompt</a>. Check every line before saving anything.</li></ol><p>Never put passwords, API keys, card details, or extra customer PII in chats.</p></section>
      <section><h2>What to ask next</h2><p>Try <strong>“Plan today&#39;s work”</strong> with a task list, or <strong>“Prepare my handover”</strong> with your shift log.</p><p>Read the <a href="${sourceCandidateFile('docs/va-workflows.md')}">eight-job guide</a> and <a href="${sourceCandidateFile('docs/prompt-library.md#practical-va-jobs')}">sample prompts</a>. Owners set client rules and stock limits.</p></section>
      <section id="store-connection"><h2>Connect live store data via Remote MCP</h2>${install ? `<ol class="steps"><li>The owner installs <a href="${install}">MKT Skills VA Toolkit</a> from Shopify on the right store.</li><li>In Claude (<strong>Customize → Connectors</strong>) or ChatGPT (<strong>Developer mode → Connectors</strong>), enter <code>${escape(connectionUrl)}</code>.</li><li>For CLI apps, run <code>claude mcp add --transport http shopify-va ${escape(connectionUrl)}</code> or <code>codex mcp add shopify-va --url ${escape(connectionUrl)}</code>.</li><li>Sign in and paste the pairing code inside <strong>MKT Skills VA Toolkit</strong> in Shopify Admin.</li><li>The owner checks the store, app name, return URL, and read scopes, then approves.</li><li>Finish sign-in in your browser tab. Ask your AI to print the store name first.</li></ol>` : `<p>The public Shopify MCP connection is not open yet. Shopify App Store review and live merchant OAuth tests remain open. Add this Streamable HTTP endpoint after approval (or in dev-store tests):</p><pre class="command" tabindex="0"><code>${escape(connectionUrl)}</code></pre><p>Our preview connector never reaches unrelated merchant stores.</p>`}<p>The toolkit is free. Some AI plans or org admins block custom MCP servers. <a href="https://help.openai.com/en/articles/11487775-connectors-in-chatgpt">ChatGPT connector docs</a> · <a href="https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp">Claude MCP docs</a></p><p><strong>The Remote MCP server is read-only.</strong> Product, variant, stock, and order views load in pages and hide restricted fields. It never sends emails, edits products, takes payments, or refunds orders.</p></section>
      <section><h2>How to disconnect</h2><p>Store owners can revoke any AI grant inside the Shopify app. Remove the Remote MCP server in Claude, ChatGPT, or Codex too. Uninstalling the Shopify app clears all grants for that store. Revoking access leaves past chat history in your AI app intact.</p></section>
      <section><h2>Fix common issues</h2><dl><dt>Upload blocks Markdown (.md) files</dt><dd>Rename copies to <code>.txt</code> or paste the text. Check your plan&#39;s file upload limits.</dd><dt>Sign-in code expired</dt><dd>Start a fresh OAuth sign-in request. Never reuse an old or used code.</dd><dt>Owner approval is pending</dt><dd>Ask the store owner to approve the code in Shopify Admin. Staff cannot approve AI grants.</dd><dt>Product or order is missing</dt><dd>Check the store name, record ID, approved scopes, and date range.</dd><dt>Results cover only one page</dt><dd>Ask for the next page or report what scope you read. Never claim a full audit.</dd></dl></section>
      <section><h2>Help and contact</h2><p>Email <a href="mailto:${SUPPORT}">${SUPPORT}</a> for support, or open <a href="${REPOSITORY}/issues">GitHub issues</a> for public questions.</p><p>Never post store keys, customer data, pairing codes, or client briefs in a public issue. Add the page URL, error text, and goal. Replies are best-effort.</p><p><a href="${pagePath(config, '/privacy')}">Privacy notice</a> · <a href="${sourceCandidateFile('docs/public-release.md')}">Release checklist</a></p></section>
    </div>`, config);
}

export function renderPrivacyPage(config: PublicPageConfig = {}): string {
  return layout('Privacy', 'What the MKT Skills Shopify MCP server reads, stores, and deletes.', `
    <div class="page-body shell">
      <div class="doc-head"><h1>Privacy notice</h1><p>${config.launchStage === 'public' ? 'This notice covers the live read-only Shopify MCP server.' : 'This notice covers the candidate Shopify MCP server awaiting Shopify App Store review.'}</p><p class="muted">Updated November 22, 2026. Operator: Vince Servidad.</p></div>
      <section><h2>What the MCP server reads</h2><p>After owner approval, the Remote MCP server runs fixed read-only Shopify queries. It requests three scopes: <code>read_products</code>, <code>read_inventory</code>, and <code>read_orders</code>.</p><p>Order queries exclude buyer names, addresses, emails, phones, and card details. Shopify still marks order records as protected customer data. Queries return limited pages and may skip older records.</p></section>
      <section><h2>What we store and for how long</h2><p>We store encrypted OAuth and Shopify token records to keep your link active. Each record holds your shop domain, approved scopes, tokens, client name, return URL, and expiry.</p><ul class="retention-list"><li>MCP access tokens: 1 hour.</li><li>Store grants and rotating MCP refresh tokens: up to 7 days.</li><li>Encrypted Shopify tokens: up to 7 days from owner approval (or earlier upstream expiry). Token refresh never extends this limit.</li><li>OAuth client entries: 28 days.</li><li>Pending owner approvals: 10 minutes.</li><li>Review codes and auth codes: 2 minutes.</li><li>Hashed lifecycle markers: 28 days (no shop domain, buyer PII, or tokens).</li><li>Hashed webhook receipts: 7 days (no shop domain, buyer PII, or tokens).</li></ul><p>An hourly job deletes expired records. We never save client briefs, uploaded files, messages, or query results. We check owner status at sign-in and never save usernames or emails.</p></section>
      <section><h2>Where your data goes</h2><p>Shopify sends store records. Cloudflare hosts the Remote MCP server and encrypted token store. Your AI app (Claude or ChatGPT) receives the query results. That app&#39;s own privacy policy covers your chats and files.</p><p>All requests use HTTPS. We turn off request payload logs, strip query strings, and keep tokens out of logs. Platform routing and rate limits still see basic web metadata.</p></section>
      <section><h2>Your controls</h2><p>Store owners check and approve every MCP grant in Shopify Admin. Owners can revoke any grant inside the app or uninstall to clear all grants. We handle Shopify data-request and redaction webhooks.</p><p>This server stores no customer or order files. Removing store access leaves past chats inside your AI app. Delete those chats inside that AI app itself.</p></section>
      <section><h2>Privacy requests and contact</h2><p>Email <a href="mailto:${SUPPORT}">${SUPPORT}</a> for privacy requests, or open <a href="${REPOSITORY}/issues">GitHub issues</a> for public questions. Never post secrets, customer data, or private store files in public issues.</p><p>Share only the facts needed for help. This service is free, takes no payments, runs no ad trackers, and sells no data.</p></section>
    </div>`, config);
}

export function renderAppHome(config: AppHomeConfig): string {
  const workflows = WORKFLOWS.map(workflow => `<details class="workflow"><summary>${escape(workflow.title)}</summary><p>${escape(workflow.purpose)}</p><p><strong>Have ready:</strong> ${escape(workflow.required_inputs.map(input => input.replaceAll('_', ' ')).join(', '))}.</p><ol>${workflow.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol><p><strong>Expected result:</strong> ${escape(workflow.output_sections.join(', '))}.</p><ul>${workflow.qa.map(item => `<li>${escape(item)}</li>`).join('')}</ul><p><a href="${sourceCandidateFile(`skills/${workflow.owner_skill}/${workflow.reference}`)}" target="_blank" rel="noopener noreferrer">Open the full guide and template</a></p></details>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="shopify-api-key" content="${escape(config.clientId)}"><title>MKT Skills VA Toolkit</title><script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script><script src="https://cdn.shopify.com/shopifycloud/polaris-1.1.js"></script><link rel="stylesheet" href="/assets/public.css"><script src="/assets/app-home.js" defer></script></head><body class="app-home"><a class="skip-link" href="#app-main">Skip to content</a><main id="app-main"><s-page heading="MKT Skills VA Toolkit"><s-section heading="Your store connection"><p id="session-status" role="status" aria-live="polite">Checking your Shopify session…</p><p>Free, read-only tools and task guides. Store changes, sent replies and refunds are not available through this connection.</p><div class="actions"><s-button id="retry-session">Check session again</s-button></div></s-section><div id="authenticated-content" hidden><s-section heading="Choose a VA job"><p>Use these instructions with your client's approved facts in ChatGPT or Claude. Client documents stay in that chat or project. The app does not run an AI task or certify expertise.</p>${workflows}</s-section><s-section heading="Check store information"><p>Read one page at a time. Check the store, retrieval time and coverage before using the result. These checks cannot change any store record.</p><form id="product-search" class="search-form"><label for="product-query">Product search <span class="muted">(optional)</span></label><input id="product-query" name="query" maxlength="500" autocomplete="off"><div class="actions"><s-button id="read-shop" type="button">Check store identity</s-button><s-button id="read-products" type="button">View products</s-button><s-button id="read-orders" type="button">View recent orders</s-button></div></form><p id="evidence-status" role="status" aria-live="polite">Choose a check to read current data.</p><div id="evidence-result" class="evidence-result"></div><s-button id="next-page" hidden>Read next page</s-button></s-section><s-section heading="Approve an AI connection"><p id="owner-guidance">The store owner must review and approve each connection.</p><form id="pairing-form"><label for="pairing-code">Connection request code</label><input id="pairing-code" name="pairing_code" maxlength="128" autocomplete="off" spellcheck="false" aria-describedby="pairing-help"><p id="pairing-help" class="muted">Copy this code from the original ChatGPT or Claude sign-in tab. Only approve a request you recognize.</p><s-button id="inspect-pairing" type="button" disabled>Review request</s-button></form><p id="pairing-status" role="status" aria-live="polite"></p><div id="pairing-review" hidden><dl id="pairing-facts"></dl><p>This authorizes supported read access to the displayed store. It does not grant store editing permission.</p><s-button id="approve-pairing" variant="primary" disabled>Approve this connection</s-button><s-button id="cancel-pairing">Cancel review</s-button></div></s-section><s-section heading="Approved AI connections"><p>Disconnecting stops this client's future access. It does not delete existing conversations in the AI service.</p><s-button id="refresh-connections">Refresh connections</s-button><p id="connections-status" role="status" aria-live="polite"></p><div id="connections-list"></div></s-section></div><s-section heading="Help"><p>First time using the guides? <a href="/help" target="_blank" rel="noopener noreferrer">Open the first-task walkthrough</a>. <a href="/privacy" target="_blank" rel="noopener noreferrer">Read the privacy notice</a>.</p><p>Missing facts, policies and stock thresholds need an owner decision. No background monitoring or scheduled work is enabled.</p></s-section></s-page></main></body></html>`;
}
