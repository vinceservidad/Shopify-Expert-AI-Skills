import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderHelpPage, renderProductPage, type PublicPageConfig } from '../src/public-pages.js';
import { publicContent } from '../src/public-routes.js';

const RELEASE_PLUGIN_URL =
  'https://github.com/vinceservidad/Shopify-Expert-AI-Skills/releases/download/v0.2.2/shopify-va-toolkit-skills-only.plugin';

const candidateConfig: PublicPageConfig = {
  publicUrl: 'https://shopify-mcp.mktskills.com',
  basePath: '/shopify-va',
  launchStage: 'candidate',
  pluginDownloadUrl: RELEASE_PLUGIN_URL,
};

test('product page publishes v0.2.2 install paths for Claude, ChatGPT, and Codex in candidate mode', () => {
  const html = renderProductPage(candidateConfig);

  assert.ok(html.includes(`href="${RELEASE_PLUGIN_URL}"`));
  assert.ok(html.includes('href="https://github.com/vinceservidad/Shopify-Expert-AI-Skills/releases/tag/v0.2.2"'));
  assert.doesNotMatch(html, /A public plugin download has not been released/);

  assert.ok(html.includes('claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('/plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('shopify-va.zip'));
  assert.ok(html.includes('MKT Skills — Shopify VA'));
  assert.ok(html.includes('SKILL.md'));
  assert.ok(html.includes('references/'));
  assert.ok(html.includes('codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main'));
  assert.ok(html.includes('codex plugin add shopify-va-toolkit@shopify-skills'));

  assert.ok(html.includes('Public store connection is being prepared.'));
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

test('help page documents Claude, ChatGPT, and Codex setup while preserving candidate store boundary', () => {
  const html = renderHelpPage(candidateConfig);

  assert.ok(html.includes('id="install-help"'));
  assert.ok(html.includes('claude plugin install shopify-va-toolkit --marketplace vinceservidad/Shopify-Expert-AI-Skills'));
  assert.ok(html.includes('shopify-va.zip'));
  assert.ok(html.includes('MKT Skills — Shopify VA'));
  assert.ok(html.includes('Project instructions'));
  assert.ok(html.includes('codex plugin marketplace add vinceservidad/Shopify-Expert-AI-Skills --ref main'));
  assert.ok(html.includes(`href="${RELEASE_PLUGIN_URL}"`));
  assert.ok(html.includes('The public connection is not available yet.'));
  assert.doesNotMatch(html, /https:\/\/apps\.shopify\.com\//);
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
