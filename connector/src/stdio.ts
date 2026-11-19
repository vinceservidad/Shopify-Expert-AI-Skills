import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { discoverSkillsRoot } from './catalog.js';
import { createServer } from './mcp.js';
import { SHOPIFY_SCOPES, shopDomain } from './shopify.js';
import { organizationConnection } from './client-credentials.js';

async function main() {
  const shop = process.env.SHOPIFY_SHOP;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const clientId = process.env.SHOPIFY_CLIENT_ID, clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (shop && !token && !(clientId && clientSecret) || token && !shop) {
    throw new Error('Set SHOPIFY_SHOP with an approved token or same-organization app credentials.');
  }
  const server = createServer({ skillsRoot: await discoverSkillsRoot(), connection: shop && token
    ? { shop: shopDomain.parse(shop), accessToken: token, scopes: (process.env.SHOPIFY_SCOPES ?? SHOPIFY_SCOPES.join(',')).split(',').map(value => value.trim()) }
    : shop && clientId && clientSecret ? organizationConnection(shop, clientId, clientSecret)
    : undefined });
  await server.connect(new StdioServerTransport());
  for (const event of ['SIGINT', 'SIGTERM'] as const) process.once(event, () => { void server.close().then(() => process.exit(0)); });
}
main().catch(() => { console.error('Connector startup failed. Check Node version, skills directory, and Shopify environment configuration.'); process.exit(1); });
