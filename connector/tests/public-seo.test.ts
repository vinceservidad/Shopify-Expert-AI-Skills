import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { createApp } from '../src/http.js';
import { SecretStore } from '../src/store.js';
import { PUBLIC_PAGE_CSP, publicContent } from '../src/public-routes.js';
import { FAQ_ITEMS } from '../src/public-pages.js';
import { SKILL_CATALOG, SKILL_COUNT } from '../src/public-ui/skill-groups.js';
import { SKILL_DOCS, SKILL_DOCS_UPDATED } from '../src/public-ui/skill-docs.js';
import { WORKFLOWS } from '../src/workflows.js';
import { collectSkillDocs } from '../worker/build-skill-docs.js';

const config = { publicUrl: 'https://shopify-mcp.mktskills.com', openMcpUrl: 'https://mktskills.com/mcp/shopify-skills', basePath: '/shopify-va', launchStage: 'candidate' as const };
const html = (path: string) => publicContent(path, config)!.body as string;
const PAGES = [
  { path: '/shopify-va', canonical: 'https://mktskills.com/shopify-va', title: 'Shopify Skills for AI Agents | Marketing Skills',
    description: '19 free MIT-licensed Shopify skills for ChatGPT, Claude, and coding agents. Your AI app drafts the store work, and you approve every change in Shopify Admin.',
    crumbs: ['Marketing Skills', 'Shopify VA'] },
  { path: '/shopify-va/setup', canonical: 'https://mktskills.com/shopify-va/setup', title: 'Shopify Skills Setup for AI Agents | Marketing Skills',
    description: 'Add 19 free Shopify skills to ChatGPT, Claude, Claude Code, Codex, or Cursor in four steps. Install commands and fixes for common setup problems.',
    crumbs: ['Marketing Skills', 'Shopify VA', 'Setup'] },
  { path: '/shopify-va/privacy', canonical: 'https://mktskills.com/shopify-va/privacy', title: 'Shopify Skills Privacy Notice | Marketing Skills',
    description: 'What the read-only Shopify skills MCP server reads, what it stores, how long it keeps it, and how store owners remove access.',
    crumbs: ['Marketing Skills', 'Shopify VA', 'Privacy'] },
];
const decode = (value: string) => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const meta = (page: string, attr: string, name: string) => {
  const match = new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`).exec(page);
  return match ? decode(match[1]!) : undefined;
};
const graph = (page: string) => {
  const blocks = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1, 'exactly one JSON-LD block');
  const parsed = JSON.parse(blocks[0]![1]!) as { '@context': string; '@graph': Array<Record<string, any>> };
  assert.equal(parsed['@context'], 'https://schema.org');
  return parsed['@graph'];
};

test('every page pins its own title, description, canonical, language, theme colour and social tags', () => {
  const titles = new Set<string>(), descriptions = new Set<string>();
  for (const expected of PAGES) {
    const page = html(expected.path);
    assert.equal(decode(/<title>([^<]*)<\/title>/.exec(page)![1]!), expected.title, expected.path);
    assert.ok(expected.title.length < 60 && expected.description.length < 160, `${expected.path} length`);
    assert.equal(meta(page, 'name', 'description'), expected.description);
    assert.equal([...page.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map(m => m[1]).join(), expected.canonical);
    assert.match(page, /<html lang="en"/);
    assert.equal(meta(page, 'name', 'theme-color'), '#15191a');
    assert.equal(meta(page, 'property', 'og:title'), expected.title);
    assert.equal(meta(page, 'property', 'og:description'), expected.description);
    assert.equal(meta(page, 'property', 'og:url'), expected.canonical);
    assert.equal(meta(page, 'property', 'og:image'), 'https://mktskills.com/shopify-va/og-shopify-va.png');
    assert.equal(meta(page, 'property', 'og:image:width'), '1200');
    assert.equal(meta(page, 'property', 'og:image:height'), '630');
    assert.ok(meta(page, 'property', 'og:image:alt'));
    assert.equal(meta(page, 'name', 'twitter:card'), 'summary_large_image');
    assert.equal(meta(page, 'name', 'twitter:title'), expected.title);
    assert.equal(meta(page, 'name', 'twitter:description'), expected.description);
    assert.equal(meta(page, 'name', 'twitter:image'), 'https://mktskills.com/shopify-va/og-shopify-va.png');
    assert.match(meta(page, 'name', 'robots')!, /^index, follow/);
    titles.add(expected.title); descriptions.add(expected.description);
  }
  assert.equal(titles.size, 3); assert.equal(descriptions.size, 3);
  assert.ok(PAGES[0]!.title.toLowerCase().startsWith('shopify skills'), 'keyword first');
});

test('the Open Graph image is a 1200x630 PNG served with a 200 payload', () => {
  const image = publicContent('/shopify-va/og-shopify-va.png', config)!;
  const bytes = image.body as Uint8Array;
  const view = new DataView(bytes.buffer, bytes.byteOffset);
  assert.equal(image.contentType, 'image/png');
  assert.deepEqual([view.getUint32(16), view.getUint32(20)], [1200, 630]);
  assert.ok(bytes.length < 1024 * 1024);
});

test('each page has one h1, no skipped heading levels, and links to its siblings and the marketing site', () => {
  for (const expected of PAGES) {
    const page = html(expected.path);
    const levels = [...page.matchAll(/<h([1-6])[\s>]/g)].map(m => Number(m[1]));
    assert.equal(levels.filter(level => level === 1).length, 1, `${expected.path} h1 count`);
    levels.forEach((level, index) => assert.ok(index === 0 ? level === 1 : level <= levels[index - 1]! + 1, `${expected.path} heading jumps to h${level}`));
    assert.ok(page.includes('href="https://mktskills.com/"'), `${expected.path} links to the marketing site`);
    assert.ok(page.includes('href="/shopify-va"') && page.includes('href="/shopify-va/setup"') && page.includes('href="/shopify-va/privacy"'), `${expected.path} internal links`);
    assert.ok(!/<img\b(?![^>]*\balt=)/.test(page), 'every image needs alt text');
  }
});

test('JSON-LD parses, shares the marketing Organization @id, and has the required properties', () => {
  for (const expected of PAGES) {
    const nodes = graph(html(expected.path)), byType = (type: string) => nodes.filter(node => node['@type'] === type);
    const org = byType('Organization')[0]!;
    assert.equal(org['@id'], 'https://mktskills.com/#organization');
    assert.ok(org.name && org.url && org.logo);
    assert.equal(org.name, 'Marketing Skills');
    assert.equal(org.alternateName, 'MKT Skills');
    const webPage = byType('WebPage')[0]!;
    assert.equal(webPage.url, expected.canonical);
    assert.deepEqual(webPage.publisher, { '@id': org['@id'] });
    assert.deepEqual(webPage.isPartOf, { '@id': 'https://mktskills.com/#website' });
    const crumbs = byType('BreadcrumbList')[0]!;
    assert.equal(webPage.breadcrumb['@id'], crumbs['@id']);
    assert.deepEqual(crumbs.itemListElement.map((item: any) => item.name), expected.crumbs);
    assert.deepEqual(crumbs.itemListElement.map((item: any) => item.position), expected.crumbs.map((_, i) => i + 1));
    assert.equal(crumbs.itemListElement.at(-1).item, expected.canonical);
    assert.equal(byType('HowTo').length, 0, 'HowTo is deprecated');
    assert.ok(!JSON.stringify(nodes).match(/aggregateRating|"review"|ratingValue/), 'no invented ratings or reviews');
  }
  const app = graph(html('/shopify-va')).find(node => node['@type'] === 'SoftwareApplication')!;
  assert.equal(app.name, 'Shopify VA Skills');
  assert.deepEqual(app.offers, { '@type': 'Offer', price: '0', priceCurrency: 'USD' });
  assert.equal(app.applicationCategory, 'BusinessApplication');
  assert.ok(app.operatingSystem);
  assert.equal(app.isAccessibleForFree, true);
  assert.equal(app.license, 'https://opensource.org/licenses/MIT');
  assert.deepEqual(app.publisher, { '@id': 'https://mktskills.com/#organization' });
  assert.equal(app.featureList.length, SKILL_COUNT);
});

test('FAQPage JSON-LD matches the visible FAQ text exactly', () => {
  const page = html('/shopify-va');
  const faq = graph(page).find(node => node['@type'] === 'FAQPage')!;
  const visible = [...page.matchAll(/<details class="faq-item"[^>]*><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(m => [decode(m[1]!), decode(m[2]!)]);
  assert.equal(visible.length, FAQ_ITEMS.length);
  assert.deepEqual(faq.mainEntity.map((q: any) => [q.name, q.acceptedAnswer.text]), visible);
  for (const other of ['/shopify-va/setup', '/shopify-va/privacy']) assert.ok(!graph(html(other)).some(node => node['@type'] === 'FAQPage'), `${other} has no FAQ markup without a visible FAQ`);
});

test('JSON-LD cannot break out of its script tag and adds no executable script; the CSP only adds self-hosted fonts', () => {
  for (const { path } of PAGES) {
    const scripts = [...html(path).matchAll(/<script\b([^>]*)>/g)].map(m => m[1]!);
    for (const attributes of scripts) assert.ok(/type="application\/ld\+json"/.test(attributes) || /\bsrc="/.test(attributes), `inline script on ${path}: ${attributes}`);
  }
  assert.equal(PUBLIC_PAGE_CSP, `default-src 'none'; style-src 'self'; script-src 'self' https://static.cloudflareinsights.com/beacon.min.js https://static.cloudflareinsights.com/beacon.min.js/; connect-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`);
});

test('skill count is read from source: 19 skills in skills/, the catalog, the generated docs and every count in the copy', () => {
  const onDisk = readdirSync(resolve('../skills'), { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  assert.equal(onDisk.length, 19);
  assert.equal(SKILL_COUNT, onDisk.length);
  assert.deepEqual(SKILL_CATALOG.map(skill => skill.slug).sort(), onDisk);
  assert.deepEqual(SKILL_DOCS.map(doc => doc.slug), onDisk);
  for (const { path, description } of PAGES.map(page => ({ path: page.path, description: page.description }))) {
    for (const [, count] of description.matchAll(/\b(\d+) (?:free )?(?:MIT-licensed )?Shopify skills/g)) assert.equal(Number(count), SKILL_COUNT, path);
  }
});

test('the committed skill text for llms-full.txt matches skills/*/SKILL.md', async () => {
  assert.deepEqual(SKILL_DOCS, await collectSkillDocs(resolve('../skills')), 'run npm run public:docs in connector/');
  assert.match(SKILL_DOCS_UPDATED, /^\d{4}-\d{2}-\d{2}$/);
});

const headings = (text: string) => text.split('\n').filter(line => /^#{1,6} /.test(line));
test('llms.txt follows llmstxt.org: H1, blockquote, plain body, H2 link lists, Optional last', () => {
  for (const path of ['/llms.txt', '/shopify-va/llms.txt']) {
    const response = publicContent(path, config)!, text = response.body as string, lines = text.split('\n');
    assert.equal(response.contentType, 'text/plain; charset=utf-8');
    assert.equal(lines[0], '# Marketing Skills: Shopify VA Skills');
    assert.equal(lines[1], '');
    assert.match(lines[2]!, /^> 19 free MIT-licensed Shopify skills/);
    assert.equal(headings(text).filter(line => line.startsWith('# ')).length, 1, 'one H1');
    const h2 = headings(text);
    assert.deepEqual(h2.slice(1), ['## Guide pages', '## All 19 Shopify skills', '## Optional'], 'only H2 sections after the H1, Optional last');
    const firstH2 = lines.findIndex(line => line.startsWith('## '));
    assert.ok(lines.slice(3, firstH2).some(line => line.startsWith('Last updated: ')), 'body carries the last-updated date');
    assert.ok(text.includes(`Last updated: ${SKILL_DOCS_UPDATED}`));
    for (const line of lines.slice(firstH2).filter(line => line.startsWith('- '))) assert.match(line, /^- \[[^\]]+\]\(https:\/\/[^)\s]+\)(: .+)?$/, `list item must be [name](url): ${line}`);
    assert.equal(lines.slice(firstH2).filter(line => /^- \[[^\]]+\]\(https:\/\/github\.com\/[^)]*\/skills\/shopify-[a-z-]+\/SKILL\.md\)/.test(line)).length, 19);
    for (const needle of ['https://mktskills.com/mcp/shopify-skills', 'https://shopify-mcp.mktskills.com/mcp', 'npx skills add vinceservidad/Shopify-Expert-AI-Skills', 'claude plugin install shopify-va-toolkit', 'MIT', 'Read-only', 'llms-full.txt', `${WORKFLOWS.length} VA task workflows`]) assert.ok(text.includes(needle), needle);
    assert.doesNotMatch(text, /—|\s–\s/);
  }
});

test('llms-full.txt carries the setup text and all 19 skills in full', () => {
  for (const path of ['/llms-full.txt', '/shopify-va/llms-full.txt']) {
    const response = publicContent(path, config)!, text = response.body as string;
    assert.equal(response.contentType, 'text/plain; charset=utf-8');
    assert.ok(text.startsWith('# Marketing Skills: Shopify VA Skills\n\n> 19 free MIT-licensed Shopify skills'));
    assert.equal(headings(text).filter(line => line.startsWith('# ')).length, 1);
    assert.equal(headings(text).filter(line => line.startsWith('## Skill: ')).length, 19);
    for (const doc of SKILL_DOCS) {
      assert.ok(text.includes(`(${doc.slug})`) && text.includes(doc.description), doc.slug);
      const firstLine = doc.body.split('\n').find(line => line.trim())!;
      assert.ok(text.includes(firstLine.replace(/^# /, '### ')), `${doc.slug} body present`);
    }
    for (const needle of ['## Setup', '## FAQ', 'npx skills add vinceservidad/Shopify-Expert-AI-Skills', 'https://mktskills.com/mcp/shopify-skills', 'Last updated: ']) assert.ok(text.includes(needle), needle);
    for (const item of FAQ_ITEMS) assert.ok(text.includes(item.answer));
  }
});

test('the Express app serves llms.txt and llms-full.txt (root and /shopify-va paths) as plain text with the page CSP', async () => {
  const store = new SecretStore(':memory:', randomBytes(32)), listener = createHttpServer();
  await new Promise<void>(done => listener.listen(0, '127.0.0.1', done));
  const base = `http://127.0.0.1:${(listener.address() as { port: number }).port}`;
  const { app } = createApp({ store, publicUrl: base, clientId: 'synthetic-app', clientSecret: 'synthetic-app-secret', skillsRoot: resolve('../skills'), openMcpUrl: config.openMcpUrl });
  listener.on('request', app);
  try {
    for (const path of ['/llms.txt', '/shopify-va/llms.txt', '/llms-full.txt', '/shopify-va/llms-full.txt']) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8', path);
      assert.equal(response.headers.get('content-security-policy'), PUBLIC_PAGE_CSP);
      assert.equal(await response.text(), publicContent(path, { ...config, publicUrl: base })!.body);
    }
  } finally {
    listener.closeAllConnections(); await new Promise<void>(done => listener.close(() => done())); store.close();
  }
});
