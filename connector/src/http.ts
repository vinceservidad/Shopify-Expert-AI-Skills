import express, { type Request } from 'express';
import { createMcpExpressApp } from '@modelcontextprotocol/express';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ShopifyOAuth, type AuthOptions } from './auth.js';
import { discoverSkillsRoot } from './catalog.js';
import { createServer } from './mcp.js';
import { SecretStore } from './store.js';
import type { Fetch } from './shopify.js';

export function createApp(options: AuthOptions & { skillsRoot: string; upstreamFetcher?: Fetch }) {
  const host = new URL(options.publicUrl).hostname;
  const app = createMcpExpressApp({ host: '127.0.0.1', allowedHosts: [host], allowedOrigins: [host], jsonLimit: '32kb' });
  app.disable('x-powered-by');
  app.use((request, response, next) => {
    response.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" });
    const origin = request.get('origin');
    if (origin && origin !== new URL(options.publicUrl).origin) { response.status(403).json({ error: 'origin_not_allowed' }); return; }
    next();
  });
  app.use(express.json({ limit: '32kb' }), express.urlencoded({ extended: false, limit: '8kb' }));
  const auth = new ShopifyOAuth(options);
  auth.install(app);
  app.get('/health', (_request, response) => response.json({ status: 'ok', name: 'shopify-va-toolkit', mode: 'read-only' }));
  app.get('/', (_request, response) => response.type('html').send('<!doctype html><html lang="en"><meta charset="utf-8"><title>Shopify VA Toolkit</title><main><h1>Shopify VA Toolkit</h1><p>Independent, read-only Shopify tools and expert workflow skills. Not affiliated with Shopify.</p><p>Connect an MCP client to /mcp. Store access uses OAuth and requires merchant approval.</p></main></html>'));
  app.all('/mcp', async (request: Request, response) => {
    const match = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(request.get('authorization') ?? '');
    const connection = match?.[1] ? await auth.connection(match[1]) : undefined;
    if (!connection) {
      response.set('WWW-Authenticate', `Bearer resource_metadata="${options.publicUrl}/.well-known/oauth-protected-resource/mcp", scope="shopify:read"`);
      response.status(401).json({ error: 'invalid_token' }); return;
    }
    if (request.method !== 'POST') { response.set('Allow', 'POST').status(405).end(); return; }
    // Each request gets a server tied to its own authenticated grant. No shared store token.
    const server = createServer({ skillsRoot: options.skillsRoot, connection, fetcher: options.upstreamFetcher });
    const transport = new NodeStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    response.on('close', () => { void server.close(); });
    await server.connect(transport);
    await transport.handleRequest(request, response, request.body);
  });
  app.use((_error: unknown, _request: Request, response: express.Response, _next: express.NextFunction) => {
    const status = _error instanceof SyntaxError ? 400 : 500;
    if (!response.headersSent) response.status(status).json({ error: status === 400 ? 'invalid_request' : 'request_failed' });
  });
  return { app, auth };
}

async function main() {
  const clientId = process.env.SHOPIFY_CLIENT_ID, clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  const key = process.env.CONNECTOR_STORAGE_KEY, publicUrl = process.env.PUBLIC_URL;
  if (!clientId || !clientSecret || !key || !publicUrl) throw new Error('Missing OAuth environment configuration.');
  const store = new SecretStore(process.env.CONNECTOR_DATABASE ?? resolve('data/connector.sqlite'), Buffer.from(key, 'base64'));
  const { app } = createApp({ clientId, clientSecret, publicUrl, store, skillsRoot: await discoverSkillsRoot() });
  const port = Number(process.env.PORT ?? '8788');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT.');
  const listener = app.listen(port, process.env.HOST ?? '127.0.0.1', () => console.error(`Shopify VA Toolkit listening on port ${port}; read-only OAuth MCP.`));
  for (const event of ['SIGINT', 'SIGTERM'] as const) process.once(event, () => listener.close(() => { store.close(); process.exit(0); }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(() => { console.error('HTTP connector startup failed. Check OAuth credentials, PUBLIC_URL, storage key and database permissions.'); process.exit(1); });
}
