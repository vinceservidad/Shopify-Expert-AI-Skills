import { DurableObject } from 'cloudflare:workers';
import { handleAsNodeRequest } from 'cloudflare:node';
import { createServer as createHttpServer } from 'node:http';
import express from 'express';
import { hostHeaderValidation, originValidation } from '@modelcontextprotocol/express';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/server';
import { ShopifyOAuth } from '../src/auth.js';
import { createServer, type SkillCatalog } from '../src/mcp.js';
import { ConnectorError, type Fetch } from '../src/shopify.js';
import { installAppChecks } from '../src/app-checks.js';
import { renderAppHome, type PublicPageConfig } from '../src/public-pages.js';
import { publicContent, SECURITY_HEADERS } from '../src/public-routes.js';

// Workers has no redirect:error mode. Manual redirects are explicitly rejected
// before credentials can be forwarded to a different endpoint.
const upstreamFetch: Fetch = async (input, init) => {
  const response = await fetch(input, { ...init, redirect: 'manual' });
  if (response.status >= 300 && response.status < 400) throw new Error('Upstream redirect rejected.');
  return response;
};
import { DurableSecretStore } from './store.js';
import bundled from './generated/catalog.json' with { type: 'json' };

const catalog: SkillCatalog = {
  async list() { return bundled.skills; },
  async read(name, resource = 'SKILL.md') {
    if (!/^shopify-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)
        || !(resource === 'SKILL.md' || /^references\/[a-z0-9][a-z0-9_/-]*\.md$/i.test(resource))
        || resource.split('/').includes('..')) throw new ConnectorError('INVALID_SKILL_PATH', 'Choose a listed skill and its Markdown reference.');
    const documents: Record<string, string> = bundled.documents;
    const text = Object.hasOwn(documents, `${name}/${resource}`) ? documents[`${name}/${resource}`] : undefined;
    if (!text) throw new ConnectorError('SKILL_NOT_FOUND', 'This skill or reference is unavailable.');
    return text;
  },
};

function authMode(value: string | undefined): 'custom' | 'public' {
  if (!value || value === 'custom') return 'custom';
  if (value === 'public') return 'public';
  throw new Error('Invalid Shopify authorization mode.');
}
function pageConfig(env: Env): PublicPageConfig {
  return { publicUrl: env.PUBLIC_URL, appHandle: env.SHOPIFY_PUBLIC_APP_HANDLE || undefined,
    pluginDownloadUrl: env.PLUGIN_DOWNLOAD_URL || undefined, basePath: '/shopify-va',
    launchStage: String(env.PUBLIC_LAUNCH_STAGE) === 'public' ? 'public' : 'candidate' };
}

// The issuer coordinates credentials and merchant approval. MCP store reads run in the outer Worker.
export class OAuthIssuer extends DurableObject<Env> {
  private auth: ShopifyOAuth;
  private app: express.Express;
  private store: DurableSecretStore;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.store = new DurableSecretStore(this.ctx.storage, Buffer.from(this.env.CONNECTOR_STORAGE_KEY, 'base64'));
    this.auth = new ShopifyOAuth({ publicUrl: this.env.PUBLIC_URL, clientId: this.env.SHOPIFY_CLIENT_ID,
      clientSecret: this.env.SHOPIFY_CLIENT_SECRET, store: this.store, fetcher: upstreamFetch,
      mode: authMode(this.env.SHOPIFY_AUTH_MODE), publicAppHandle: this.env.SHOPIFY_PUBLIC_APP_HANDLE || undefined,
      publicInstallUrl: this.env.SHOPIFY_PUBLIC_INSTALL_URL || undefined, renderAppHome,
      rateLimitKey: request => request.get('cf-connecting-ip') ?? 'local' });
    const host = new URL(this.env.PUBLIC_URL).hostname;
    this.app = express();
    this.app.use(hostHeaderValidation([host]), originValidation([host]));
    this.app.disable('x-powered-by');
    // The outer Worker uses Cloudflare's rate limiter with the trusted incoming IP.
    this.app.set('trust proxy', false);
    this.auth.installWebhooks(this.app);
    this.app.use(express.json({ limit: '32kb' }), express.urlencoded({ extended: false, limit: '8kb' }));
    this.auth.install(this.app);
    if (authMode(this.env.SHOPIFY_AUTH_MODE) === 'public') installAppChecks(this.app, this.auth, upstreamFetch);
    this.app.use((_error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
      if (!response.headersSent) response.status(_error instanceof SyntaxError ? 400 : 503).json({ error: _error instanceof SyntaxError ? 'invalid_request' : 'request_failed' });
    });
  }
  async resolveConnection(bearer: string) { return this.auth.connection(bearer); }
  async fetch(request: Request): Promise<Response> {
    if (await this.ctx.storage.getAlarm() === null) await this.ctx.storage.setAlarm(Date.now() + 3600000);
    const server = createHttpServer(this.app);
    try {
      server.listen(0);
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Node HTTP bridge unavailable.');
      const response = await handleAsNodeRequest(address.port, request);
      // OAuth responses are small and body-limited. Finish the bridge before closing it.
      return new Response(await response.arrayBuffer(), response);
    } finally { server.close(); }
  }
  async alarm(): Promise<void> {
    this.store.cleanup();
    await this.ctx.storage.setAlarm(Date.now() + 3600000);
  }
}

const headers = SECURITY_HEADERS;
const json = (data: unknown, status = 200, extra: Record<string, string> = {}) => Response.json(data, { status, headers: { ...headers, ...extra } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url), origin = new URL(env.PUBLIC_URL).origin;
      if (url.origin !== origin || request.headers.get('host') !== new URL(origin).host) return json({ error: 'host_not_allowed' }, 403);
      const suppliedOrigin = request.headers.get('origin');
      if (suppliedOrigin && suppliedOrigin !== origin) return json({ error: 'origin_not_allowed' }, 403);
      if (url.pathname === '/health' && request.method === 'GET') return json({ status: 'ok', name: 'shopify-va-toolkit', mode: 'read-only', runtime: 'cloudflare-workers', version: '0.2.0', authMode: authMode(env.SHOPIFY_AUTH_MODE), tools: 12, skills: 19 });
      if (request.method === 'GET') {
        const content = publicContent(url.pathname, pageConfig(env));
        if (content) return new Response(content.body, { headers: { ...headers, 'Content-Type': content.contentType } });
      }
      const issuer = env.OAUTH_ISSUER.getByName(origin);
      if (url.pathname === '/mcp') {
        const bearer = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(request.headers.get('authorization') ?? '')?.[1];
        if (!bearer) return json({ error: 'invalid_token' }, 401, { 'WWW-Authenticate': `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/mcp", scope="shopify:read"` });
        if (!(await env.MCP_RATE_LIMITER.limit({ key: bearer })).success) return json({ error: 'rate_limit_exceeded' }, 429);
        const connection = await issuer.resolveConnection(bearer);
        if (!connection) return json({ error: 'invalid_token' }, 401, { 'WWW-Authenticate': `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/mcp", scope="shopify:read"` });
        if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' });
        const server = createServer({ skillsRoot: '', catalog, connection, fetcher: upstreamFetch });
        const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true, maxRequestBodySize: 32768 });
        try {
          await server.connect(transport);
          const response = await transport.handleRequest(request);
          const output = new Response(response.body, response);
          for (const [name, value] of Object.entries(headers)) output.headers.set(name, value);
          return output;
        } finally { await server.close(); }
      }
      const publicRoute = authMode(env.SHOPIFY_AUTH_MODE) === 'public' && ['/app', '/app/session', '/app/checks', '/app/pairing/inspect', '/app/pairing/approve', '/app/connections', '/app/disconnect',
        '/oauth/public/status', '/oauth/public/complete', '/webhooks/shopify'].includes(url.pathname);
      if (!publicRoute && !['/authorize', '/register', '/token', '/revoke', '/oauth/shopify', '/oauth/shopify/callback',
        '/.well-known/oauth-protected-resource/mcp', '/.well-known/oauth-authorization-server'].includes(url.pathname)) return json({ error: 'not_found' }, 404);
      if (!(await env.AUTH_RATE_LIMITER.limit({ key: request.headers.get('cf-connecting-ip') ?? 'local' })).success) return json({ error: 'rate_limit_exceeded' }, 429);
      const response = await issuer.fetch(request);
      const output = new Response(response.body, response);
      for (const [name, value] of Object.entries(headers)) if (!output.headers.has(name)) output.headers.set(name, value);
      return output;
    } catch { return json({ error: 'request_failed' }, 500); }
  },
} satisfies ExportedHandler<Env>;
