import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderHelpPage, renderPrivacyPage, renderProductPage, type PublicPageConfig } from '../src/public-pages.js';
import { publicContent } from '../src/public-routes.js';

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
  /user names/,
  /Product\/variant\/stock/,
  /access\/refresh/,
  /Customer\/order/,
  /September 30, 2026/,
];

test('product page publishes v0.2.2 install paths and Remote MCP details in candidate mode', () => {
  const html = renderProductPage(candidateConfig);

  assert.ok(html.includes(`href="${RELEASE_PLUGIN_URL}"`));
  assert.ok(html.includes('href="https://github.com/vinceservidad/Shopify-Expert-AI-Skills/releases/tag/v0.2.2"'));

  assert.ok(html.includes('npx skills add vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('https://shopify-mcp.mktskills.com/mcp/shopify-skills'));
  assert.ok(html.includes('claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('/plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('shopify-va.zip'));
  assert.ok(html.includes('MKT Skills — Shopify VA'));
  assert.ok(html.includes('Project instructions'));
  assert.ok(html.includes('SKILL.md'));
  assert.ok(html.includes('references/'));
  assert.ok(html.includes('codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main'));
  assert.ok(html.includes('codex plugin add shopify-va-toolkit@shopify-skills'));

  assert.ok(html.includes('id="mcp"'));
  assert.ok(html.includes('Remote MCP'));
  assert.ok(html.includes('https://shopify-mcp.mktskills.com/mcp'));
  assert.ok(html.includes('OAuth 2.1'));
  assert.ok(html.includes('read_products'));
  assert.ok(html.includes('read_inventory'));
  assert.ok(html.includes('read_orders'));

  assert.ok(html.includes('Shopify App Store review pending'));
  assert.doesNotMatch(html, /https:\/\/apps\.shopify\.com\//);
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
    assert.ok(!html.includes('Download skills-only .plugin'));
    assert.ok(html.includes('Direct .plugin download is not configured on this deployment.'));
  }
});

test('help and privacy pages cover Claude, ChatGPT Projects, Codex, and Remote MCP accurately', () => {
  const helpHtml = renderHelpPage(candidateConfig);
  const privacyHtml = renderPrivacyPage(candidateConfig);

  assert.ok(helpHtml.includes('id="install-help"'));
  assert.ok(helpHtml.includes('npx skills add vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('https://shopify-mcp.mktskills.com/mcp/shopify-skills'));
  assert.ok(helpHtml.includes('claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(helpHtml.includes('shopify-va.zip'));
  assert.ok(helpHtml.includes('MKT Skills — Shopify VA'));
  assert.ok(helpHtml.includes('Project instructions'));
  assert.ok(helpHtml.includes('codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main'));
  assert.ok(helpHtml.includes(`href="${RELEASE_PLUGIN_URL}"`));
  assert.ok(helpHtml.includes('id="store-connection"'));
  assert.ok(helpHtml.includes('Remote MCP'));
  assert.ok(helpHtml.includes('https://shopify-mcp.mktskills.com/mcp'));
  assert.ok(helpHtml.includes('The public Shopify MCP connection is not open yet.'));
  assert.doesNotMatch(helpHtml, /https:\/\/apps\.shopify\.com\//);

  assert.ok(privacyHtml.includes('November 22, 2026'));
  assert.ok(privacyHtml.includes('Remote MCP server'));
  assert.ok(privacyHtml.includes('read_products'));
  assert.ok(privacyHtml.includes('read_inventory'));
  assert.ok(privacyHtml.includes('read_orders'));
});

test('public pages exclude stale copy, deprecated Custom GPT wording, and sloppy phrasing', () => {
  for (const html of [
    renderProductPage(candidateConfig),
    renderHelpPage(candidateConfig),
    renderPrivacyPage(candidateConfig),
  ]) {
    for (const pattern of STALE_OR_SLOP_PATTERNS) {
      assert.doesNotMatch(html, pattern, `Unexpected stale or sloppy phrase matching ${pattern}`);
    }
  }
});

test('public pages preserve strict CSP invariants with v0.2.2 config', () => {
  for (const path of ['/shopify-va', '/shopify-va/help', '/shopify-va/privacy']) {
    const content = publicContent(path, candidateConfig);
    assert.ok(content, path);
    for (const tag of content.body.match(/<script\b[^>]*>/g) ?? []) {
      assert.match(tag, /\ssrc="/, `${path}: inline script ${tag}`);
    }
    assert.doesNotMatch(content.body, /\sstyle="/, `${path}: inline style attribute`);
    assert.doesNotMatch(content.body, /\son[a-z]+="/, `${path}: inline event handler`);
    assert.doesNotMatch(content.body, /<style\b/, `${path}: inline style element`);
  }
});
