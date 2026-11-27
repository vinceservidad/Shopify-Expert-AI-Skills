import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { publicContent, PUBLIC_PAGE_CSP } from '../src/public-routes.js';
import { skillPagePaths } from '../src/public-pages.js';
import { renderMarkdown } from '../src/public-ui/markdown.js';
import { SKILL_CATALOG } from '../src/public-ui/skill-groups.js';
import { SKILL_REFERENCES } from '../src/public-ui/skill-docs.js';
import { collectSkillReferences } from '../worker/build-skill-docs.js';
import site from '../worker/site.js';

/* One page per skill (/shopify-va/skills/<slug>) and per reference file (/shopify-va/skills/<slug>/references/<file>),
   rendered on the server from the generated skill-docs.ts. */
const config = { publicUrl: 'https://shopify-mcp.mktskills.com', basePath: '/shopify-va', launchStage: 'candidate' as const };
const html = (path: string) => publicContent(path, config)?.body as string | undefined;
const { skills: SKILL_PATHS, references: REFERENCE_PATHS } = skillPagePaths();
const ALL = [...SKILL_PATHS, ...REFERENCE_PATHS];
/* copy-quality-check.md is the same file in ten skills: every copy points its canonical at the shopify-va copy. */
const SHARED = '/shopify-va/skills/shopify-va/references/copy-quality-check';
const canonicalOf = (path: string) => path.endsWith('/references/copy-quality-check') ? SHARED : path;
const decode = (value: string) => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const meta = (page: string, attr: string, name: string) => {
  const match = new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`).exec(page);
  return match ? decode(match[1]!) : undefined;
};
const title = (page: string) => decode(/<title>([^<]*)<\/title>/.exec(page)![1]!);
const graph = (page: string) => {
  const blocks = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1);
  return (JSON.parse(blocks[0]![1]!) as { '@graph': Array<Record<string, any>> })['@graph'];
};
/** The page without the rendered skill file: what the guide itself wrote around it. */
const guideCopy = (page: string) => page.replace(/<div class="md-body">[\s\S]*?<\/div>\s*<\/section>/, '</section>').replace(/<section id="reference" class="md-body">[\s\S]*?<\/section>/, '');
const visibleText = (markup: string) => decode(markup.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

test('every skill and every reference file has a page: 19 skills and all reference files', () => {
  assert.equal(SKILL_PATHS.length, 19);
  assert.deepEqual(SKILL_PATHS.map(path => path.split('/').pop()).sort(), SKILL_CATALOG.map(skill => skill.slug).sort());
  assert.equal(REFERENCE_PATHS.length, SKILL_REFERENCES.length);
  assert.ok(REFERENCE_PATHS.length >= 90, `found ${REFERENCE_PATHS.length} reference files`);
});

test('the committed reference text matches skills/*/references/*.md', async () => {
  assert.deepEqual(SKILL_REFERENCES, await collectSkillReferences(resolve('../skills')), 'run npm run public:docs in connector/');
});

test('every skill and reference page renders with a 200 through the guide Worker, with and without a trailing slash; unknown names are 404', async () => {
  const env = { PUBLIC_SITE_URL: 'https://mktskills.com', CONNECTOR_PUBLIC_URL: 'https://shopify-mcp.mktskills.com', PUBLIC_LAUNCH_STAGE: 'candidate', SHOPIFY_PUBLIC_APP_HANDLE: '', PLUGIN_DOWNLOAD_URL: '' };
  const get = (path: string) => site.fetch(new Request(`https://mktskills.com${path}`, { headers: { host: 'mktskills.com' } }), env);
  for (const path of [...ALL, ...ALL.map(path => `${path}/`)]) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8', path);
    assert.equal(response.headers.get('content-security-policy'), PUBLIC_PAGE_CSP, path);
    const body = await response.text();
    assert.match(body, /<h1(?: class="h1-long(?:er)?")?>[^<]+<\/h1>/, path);
  }
  for (const path of ['/shopify-va/skills/shopify-unknown', '/shopify-va/skills/Shopify-VA', '/shopify-va/skills/shopify-va/references/absent', '/shopify-va/skills/shopify-va/references/skill-sequence.md',
    '/shopify-va/skills/shopify-va/references/../SKILL', '/shopify-va/skills/shopify-va/SKILL.md', '/shopify-va/skills', '/shopify-va/skills/', '/shopify-va/skills/shopify-seo/references', '/shopify-va/skills/shopify-seo/references/skill-sequence']) {
    assert.equal((await get(path)).status, 404, path);
  }
});

test('the Markdown renderer escapes all HTML, passes no raw HTML through and drops unsafe link targets', () => {
  const out = renderMarkdown([
    '# Title <b>bold</b>',
    '<script>alert(1)</script>',
    '<img src=x onerror="alert(1)"> and <div class="x">text</div>',
    '- item <iframe src="https://evil.test"></iframe>',
    '`<code>` and **<em>bold</em>** and [click](javascript:alert(1)) and [data](data:text/html,<b>) and [proto](//evil.test/x)',
    '[quote](https://example.com/"onmouseover="alert(1)) and <https://example.com/?a=1&b=2>',
    '| <th> | b |', '|---|---|', '| <td onclick=x> | `|` |',
    '```html', '<style>body{}</style>', '```',
  ].join('\n'), { resolveLink: href => href });
  assert.doesNotMatch(out.replace(/<div class="table-wrap md-table">/g, ''), /<(?:script|img|iframe|div|style|b|em|th onclick|td onclick)\b/i);
  assert.doesNotMatch(out, /href="(?:javascript|data):|href="\/\//i);
  assert.doesNotMatch(out, /onmouseover="|onerror="/);
  for (const text of ['&lt;script&gt;alert(1)&lt;/script&gt;', '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;', '&lt;iframe', '<code>&lt;code&gt;</code>', '<strong>&lt;em&gt;bold&lt;/em&gt;</strong>', 'click', '&lt;style&gt;body{}&lt;/style&gt;', '<a href="https://example.com/?a=1&amp;b=2">']) assert.ok(out.includes(text), text);
  assert.match(out, /<h2 id="title-b-bold-b">Title &lt;b&gt;bold&lt;\/b&gt;<\/h2>/, 'a level-1 heading is kept unless dropTitle is set');
  assert.match(out, /<td>&lt;td onclick=x&gt;<\/td><td><code>\|<\/code><\/td>/);
});

test('the Markdown renderer covers the subset the skill files use', () => {
  const out = renderMarkdown(['# Dropped', '', 'Intro with `code`, **bold**, *emphasis* and a [link spanning', 'two lines](references/a.md).', '', '## Section', '', '1. One', '   - nested', '2. Two', '', '| A | B |', '|:--|--:|', '| 1 | 2 |', '', '> quoted', '', '---', '', '#### Deep'].join('\n'),
    { dropTitle: true, resolveLink: href => `/x/${href}` });
  assert.doesNotMatch(out, /Dropped/);
  assert.match(out, /<p>Intro with <code>code<\/code>, <strong>bold<\/strong>, <em>emphasis<\/em> and a <a href="\/x\/references\/a\.md">link spanning two lines<\/a>\.<\/p>/);
  assert.match(out, /<h2 id="section">Section<\/h2>/);
  assert.match(out, /<ol><li>One\n?<ul><li>nested<\/li><\/ul><\/li><li>Two<\/li><\/ol>/);
  assert.match(out, /<table><thead><tr><th scope="col">A<\/th><th scope="col">B<\/th><\/tr><\/thead><tbody><tr><td>1<\/td><td>2<\/td><\/tr><\/tbody><\/table>/);
  assert.match(out, /<blockquote><p>quoted<\/p><\/blockquote>/);
  assert.match(out, /<hr>/);
  assert.match(out, /<h3 id="deep">Deep<\/h3>/, 'a #### after a ## renders one level down, never skipping');
});

test('each skill page: breadcrumb, h1, category, summary, starter prompt with Copy prompt, full body without its own h1, related skills, one GitHub link', () => {
  for (const skill of SKILL_CATALOG) {
    const path = `/shopify-va/skills/${skill.slug}`, page = html(path)!;
    const crumbs = /<nav class="crumbs" aria-label="Breadcrumb"><ol>([\s\S]*?)<\/ol><\/nav>/.exec(page)![1]!;
    assert.deepEqual([...crumbs.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(m => visibleText(m[1]!).trim()), ['Marketing Skills', 'Shopify VA', 'Skills', skill.name], path);
    assert.match(crumbs, /<a href="\/shopify-va#skills">Skills<\/a>/);
    assert.ok(page.includes(`<h1>${skill.name.replace(/&/g, '&amp;')}</h1>`), path);
    assert.ok(page.includes(`Category: ${skill.category.replace(/&/g, '&amp;')}`), path);
    assert.ok(decode(page).includes(skill.summary), path);
    assert.ok(decode(page).includes(`data-copy="${skill.prompt}" hidden>Copy prompt</button>`), `${path} copy button`);
    assert.equal((page.match(/<h1[\s>]/g) ?? []).length, 1, `${path}: the body's own h1 is dropped`);
    const body = /<div class="md-body">([\s\S]*?)<\/div>\s*<\/section>/.exec(page)![1]!;
    assert.ok(body.length > 1500, `${path} renders the SKILL.md body`);
    const github = [...page.matchAll(/href="https:\/\/github\.com[^"]*"/g)].map(m => m[0]);
    assert.deepEqual(github, [`href="https://github.com/vinceservidad/Shopify-Expert-AI-Skills/blob/main/skills/${skill.slug}/SKILL.md"`], `${path}: exactly one GitHub link`);
    assert.match(page, /<p class="doc-source"><a href="https:\/\/github\.com\/[^"]+">Source on GitHub<\/a><\/p>\s*<\/div><\/main>/, `${path}: the GitHub link is the last thing on the page`);
    const related = SKILL_CATALOG.filter(other => other.category === skill.category && other.slug !== skill.slug);
    for (const other of related) assert.ok(page.includes(`<a href="/shopify-va/skills/${other.slug}">`), `${path} links related ${other.slug}`);
  }
});

test('links inside skill files go to on-site reference pages, and every on-site link on a generated page resolves', () => {
  let referenceLinks = 0;
  for (const path of ALL) {
    const page = html(path)!;
    assert.doesNotMatch(page, /href="(?!https:\/\/github\.com\/)[^"]*references\/[a-z0-9-]+\.md/, `${path}: a reference link still points at a .md file`);
    for (const [, href] of page.matchAll(/href="(\/shopify-va[^"#]*)(?:#[^"]*)?"/g)) {
      if (href!.includes('/references/')) referenceLinks++;
      assert.ok(publicContent(href!, config), `${path} links to ${href}, which is not served`);
    }
  }
  assert.ok(referenceLinks > 200, `found ${referenceLinks} on-site reference links`);
});

test('unique titles under 60 characters where the heading allows, meta descriptions, canonicals, Open Graph tags and BreadcrumbList JSON-LD', () => {
  const titles = new Set<string>(), descriptions = new Set<string>(), canonicals = new Set<string>();
  const guideTitles = ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy'].map(path => title(html(path)!));
  for (const path of ALL) {
    const page = html(path)!, pageTitle = title(page), description = meta(page, 'name', 'description')!;
    const canonical = `https://mktskills.com${canonicalOf(path)}`;
    if (SKILL_PATHS.includes(path)) {
      assert.ok(pageTitle.length < 60, `${path}: "${pageTitle}" is ${pageTitle.length} characters`);
      assert.match(pageTitle, /^.+: Shopify skill(?: for AI agents)? \| Marketing Skills$/);
    } else {
      const heading = decode(/<h1(?: class="h1-long(?:er)?")?>([^<]*)<\/h1>/.exec(page)![1]!);
      if (heading.length + ' | Marketing Skills'.length < 60) assert.equal(pageTitle, `${heading} | Marketing Skills`, path);
      else assert.equal(pageTitle, heading, `${path}: a long heading is the title on its own`);
    }
    assert.ok(description.length >= 50 && description.length < 160, `${path}: description length ${description.length}`);
    assert.doesNotMatch(description, /—/);
    assert.deepEqual([...page.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map(m => m[1]), [canonical], path);
    assert.equal(meta(page, 'property', 'og:title'), pageTitle);
    assert.equal(meta(page, 'property', 'og:description'), description);
    assert.equal(meta(page, 'property', 'og:url'), canonical);
    assert.equal(meta(page, 'property', 'og:image'), 'https://mktskills.com/shopify-va/og-shopify-va.png');
    assert.equal(meta(page, 'name', 'twitter:title'), pageTitle);
    assert.match(meta(page, 'name', 'robots')!, /^index, follow/);
    const nodes = graph(page), webPage = nodes.find(node => node['@type'] === 'WebPage')!, crumbs = nodes.find(node => node['@type'] === 'BreadcrumbList')!;
    assert.equal(webPage.url, `https://mktskills.com${path}`);
    assert.equal(webPage.name, pageTitle);
    assert.equal(webPage.description, description);
    assert.deepEqual(webPage.breadcrumb, { '@id': crumbs['@id'] });
    const names = crumbs.itemListElement.map((item: any) => item.name);
    assert.deepEqual(names.slice(0, 3), ['Marketing Skills', 'Shopify VA', 'Skills']);
    assert.equal(names.length, SKILL_PATHS.includes(path) ? 4 : 5, path);
    assert.deepEqual(crumbs.itemListElement.map((item: any) => item.position), names.map((_: unknown, i: number) => i + 1));
    assert.equal(crumbs.itemListElement.at(-1).item, `https://mktskills.com${path}`);
    const visibleCrumbs = [...(/<nav class="crumbs"[\s\S]*?<\/nav>/.exec(page)![0]).matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(m => visibleText(m[1]!).trim());
    assert.deepEqual(visibleCrumbs, names, `${path}: the visible trail matches the JSON-LD`);
    titles.add(pageTitle); descriptions.add(description); canonicals.add(canonical);
  }
  assert.equal(titles.size, ALL.length, 'every title is unique');
  assert.equal(descriptions.size, ALL.length, 'every description is unique');
  assert.equal(canonicals.size, ALL.length - 9, 'nine copies of the shared file point at one canonical');
  for (const guideTitle of guideTitles) assert.ok(!titles.has(guideTitle));
});

test('one h1 and no skipped heading levels on every generated page', () => {
  for (const path of ALL) {
    const levels = [...html(path)!.matchAll(/<h([1-6])[\s>]/g)].map(m => Number(m[1]));
    assert.equal(levels.filter(level => level === 1).length, 1, path);
    levels.forEach((level, index) => assert.ok(index === 0 ? level === 1 : level <= levels[index - 1]! + 1, `${path}: h${levels[index - 1]} then h${level}`));
  }
});

test('the guide sitemap lists the three guide pages and every skill and reference page, each served and self-canonical', () => {
  const response = publicContent('/shopify-va/sitemap.xml', config)!;
  assert.equal(response.contentType, 'application/xml; charset=utf-8');
  const xml = response.body as string;
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]!);
  const listed = ALL.filter(path => canonicalOf(path) === path);
  assert.equal(listed.length, ALL.length - 9);
  assert.deepEqual(locs, ['/shopify-va', '/shopify-va/setup', '/shopify-va/privacy', ...listed].map(path => `https://mktskills.com${path}`));
  assert.equal(new Set(locs).size, locs.length);
  for (const loc of locs) {
    const path = loc.replace('https://mktskills.com', ''), page = html(path)!;
    assert.ok(page.includes(`<link rel="canonical" href="${loc}">`), loc);
  }
  assert.equal((xml.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) ?? []).length, listed.length, 'skill pages carry the skill files date; guide pages carry none rather than a guessed one');
  const llms = publicContent('/shopify-va/llms.txt', config)!.body as string;
  assert.ok(llms.includes('(https://mktskills.com/shopify-va/sitemap.xml)'));
});

test('llms.txt links every skill and listed reference file to its page here, and keeps the GitHub source', () => {
  const llms = publicContent('/shopify-va/llms.txt', config)!.body as string;
  for (const skill of SKILL_CATALOG) assert.ok(llms.includes(`- [${skill.name}](https://mktskills.com/shopify-va/skills/${skill.slug}): `), skill.slug);
  const references = [...llms.matchAll(/^- \[[^\]]+\]\((https:\/\/mktskills\.com\/shopify-va\/skills\/[a-z0-9-]+\/references\/[a-z0-9-]+)\): Source: (https:\/\/github\.com\/\S+\.md)$/gm)];
  assert.ok(references.length >= 20, `found ${references.length}`);
  for (const [, url, source] of references) {
    assert.ok(publicContent(url!.replace('https://mktskills.com', ''), config), url);
    assert.ok(source!.endsWith(`${url!.split('/skills/')[1]}.md`), `${url} keeps its own source`);
  }
  const full = publicContent('/shopify-va/llms-full.txt', config)!.body as string;
  for (const skill of SKILL_CATALOG) assert.ok(full.includes(`Page: https://mktskills.com/shopify-va/skills/${skill.slug}\nSource: `), skill.slug);
});

test('guide copy on generated pages follows the copy rules: no banned words, em dashes or arrows; no inline script or style', () => {
  const banned = /\b(?:elevat|unlock|seamless|supercharg|transform|empower|unleash|leverag|delv|robust|streamlin|harness|crucial)\w*|\bgame[\s-]?changer/i;
  for (const path of ALL) {
    const page = html(path)!, copy = guideCopy(page);
    assert.doesNotMatch(visibleText(copy), banned, path);
    assert.doesNotMatch(copy, /—|&mdash;/, path);
    for (const m of copy.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/g)) assert.doesNotMatch(m[2]!.replace(/<[^>]+>/g, ''), /[→↗↓↘›»⟶➜➔]/, `${path}: ${m[0]}`);
    assert.doesNotMatch(page, /\sstyle="|<style\b/i, `${path}: inline style`);
    for (const [, attributes] of page.matchAll(/<script\b([^>]*)>/g)) assert.ok(/type="application\/ld\+json"/.test(attributes!) || /\bsrc="/.test(attributes!), `${path}: inline script`);
    assert.doesNotMatch(page, /class="[^"]*\bcard\b/);
  }
});
