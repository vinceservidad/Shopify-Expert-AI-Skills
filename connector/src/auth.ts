import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion, LogSeverity } from '@shopify/shopify-api';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import express, { type Express, type Request, type Response } from 'express';
import { z } from 'zod';
import { SecretStore } from './store.js';
import { Connection, Fetch, SHOPIFY_SCOPES, shopDomain } from './shopify.js';

const token = () => randomBytes(32).toString('base64url');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const equal = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const MCP_SCOPE = 'shopify:read';
const TTL = 7 * 24 * 3600;
type Client = { client_id: string; client_name: string; redirect_uris: string[] };
type Pending = { clientId: string; redirectUri: string; state?: string; challenge: string; resource: string; browserHash: string; shop?: string };
type Grant = Connection & { refreshToken?: string; expiresAt?: number; authorizationExpiresAt?: number };
type AuthorizationCode = { clientId: string; redirectUri: string; challenge: string; grantId: string; resource: string };
type Credential = { clientId: string; grantId: string; resource: string; kind: 'access' | 'refresh' };
export type AuthOptions = { publicUrl: string; clientId: string; clientSecret: string; store: SecretStore; fetcher?: Fetch };

function redirectUri(value: string): boolean {
  try {
    const url = new URL(value);
    return !url.username && !url.password && !url.hash && (url.protocol === 'https:'
      || (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)));
  } catch { return false; }
}
const registration = z.object({
  redirect_uris: z.array(z.string().max(2048).refine(redirectUri)).min(1).max(10),
  client_name: z.string().min(1).max(100).default('MCP client'),
  token_endpoint_auth_method: z.literal('none').default('none'),
  grant_types: z.array(z.enum(['authorization_code', 'refresh_token'])).default(['authorization_code', 'refresh_token']),
  response_types: z.array(z.literal('code')).default(['code']),
});

export class ShopifyOAuth {
  readonly resource: string;
  private fetcher: Fetch;
  private shopify;
  private refreshing = new Map<string, Promise<Grant | undefined>>();
  constructor(private options: AuthOptions) {
    const base = new URL(options.publicUrl);
    if (base.pathname !== '/' || base.search || base.hash || base.username || base.password
        || !(base.protocol === 'https:' || (base.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)))) {
      throw new Error('PUBLIC_URL must be an HTTPS origin, or loopback HTTP for development.');
    }
    options.publicUrl = base.origin;
    this.resource = `${base.origin}/mcp`;
    this.fetcher = options.fetcher ?? fetch;
    this.shopify = shopifyApi({ apiKey: options.clientId, apiSecretKey: options.clientSecret,
      hostName: base.host, hostScheme: base.protocol === 'https:' ? 'https' : 'http',
      scopes: SHOPIFY_SCOPES, apiVersion: ApiVersion.July26, isEmbeddedApp: false,
      logger: { level: LogSeverity.Error, log: () => {} } });
  }
  install(app: Express): void {
    const base = this.options.publicUrl;
    const store = this.options.store;
    const failures = (response: Response, error: string, status = 400) => response.status(status).json({ error });
    // Bounded, process-local abuse control; deploy behind a platform/WAF rate limit too.
    const rates = new Map<string, { until: number; count: number }>();
    const limit = (request: Request, response: Response, next: () => void) => {
      const now = Date.now();
      for (const [key, value] of rates) if (value.until < now) rates.delete(key);
      const key = request.ip ?? 'unknown';
      const entry = rates.get(key) ?? { until: now + 60000, count: 0 };
      if (rates.size >= 10000 || ++entry.count > 30) { failures(response, 'rate_limit_exceeded', 429); return; }
      rates.set(key, entry); next();
    };
    app.use(['/oauth', '/authorize', '/register', '/token', '/revoke'], limit);
    app.get('/.well-known/oauth-protected-resource/mcp', (_request, response) => response.json({
      resource: this.resource, authorization_servers: [base], scopes_supported: [MCP_SCOPE],
      bearer_methods_supported: ['header'], resource_name: 'Shopify VA Toolkit',
    }));
    app.get('/.well-known/oauth-authorization-server', (_request, response) => response.json({
      issuer: base, authorization_endpoint: `${base}/authorize`, token_endpoint: `${base}/token`,
      registration_endpoint: `${base}/register`, revocation_endpoint: `${base}/revoke`,
      response_types_supported: ['code'], grant_types_supported: ['authorization_code', 'refresh_token'],
      code_challenge_methods_supported: ['S256'], token_endpoint_auth_methods_supported: ['none'],
      scopes_supported: [MCP_SCOPE],
    }));
    app.post('/register', (request, response) => {
      const parsed = registration.safeParse(request.body);
      if (!parsed.success) { failures(response, 'invalid_client_metadata'); return; }
      const client: Client = { ...parsed.data, client_id: token() };
      store.put(`client:${client.client_id}`, client, TTL * 4);
      response.status(201).json({ ...parsed.data, client_id: client.client_id, client_id_issued_at: Math.floor(Date.now() / 1000) });
    });
    app.get('/authorize', (request, response) => {
      const query = z.object({ client_id: z.string(), redirect_uri: z.string(), response_type: z.literal('code'),
        code_challenge: z.string().regex(/^[A-Za-z0-9_-]{43}$/), code_challenge_method: z.literal('S256'),
        state: z.string().max(1024).optional(), resource: z.string(), scope: z.literal(MCP_SCOPE).default(MCP_SCOPE),
      }).safeParse(request.query);
      if (!query.success) { failures(response, 'invalid_request'); return; }
      const q = query.data;
      const client = store.get<Client>(`client:${q.client_id}`);
      if (!client || !client.redirect_uris.includes(q.redirect_uri) || q.resource !== this.resource) {
        failures(response, 'invalid_client'); return;
      }
      const id = token(), browser = token();
      store.put(`pending:${id}`, { clientId: q.client_id, redirectUri: q.redirect_uri, state: q.state,
        challenge: q.code_challenge, resource: q.resource, browserHash: hash(browser) } satisfies Pending, 600);
      response.cookie('toolkit_oauth', browser, { httpOnly: true, secure: base.startsWith('https:'), sameSite: 'lax', maxAge: 600000, path: '/oauth' });
      // no-referrer makes navigate-mode form POSTs send Origin: null.
      // Preserve the same-origin POST without leaking the authorization URL across origins.
      response.set('Referrer-Policy', 'same-origin');
      // Chrome applies form-action to redirect chains, including already-approved installs.
      const callbackOrigin = new URL(q.redirect_uri).origin;
      response.set('Content-Security-Policy', "default-src 'none'; form-action 'self' https://*.myshopify.com https://admin.shopify.com https://accounts.shopify.com "
        + callbackOrigin + "; base-uri 'none'; frame-ancestors 'none'");
      response.type('html').send(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect Shopify VA Toolkit</title>
        <main><h1>Connect Shopify VA Toolkit</h1><p>Independent toolkit by Vince Servidad.</p>
        <p><strong>${escape(client.client_name)}</strong> requests read-only Shopify access. Return destination: ${escape(new URL(q.redirect_uri).origin)}.</p>
        <p>Permissions: products, inventory, and order summaries. No write tools. Order tools omit customer details.</p>
        <form method="post" action="/oauth/shopify"><input type="hidden" name="request" value="${id}">
        <label>Your shop domain <input name="shop" placeholder="your-store.myshopify.com" required autocomplete="off"></label>
        <button type="submit">Continue to Shopify approval</button></form><p>Close this page to cancel.</p></main></html>`);
    });
    app.post('/oauth/shopify', (request, response) => {
      const parsed = z.object({ request: z.string(), shop: shopDomain }).safeParse(request.body);
      if (!parsed.success) { failures(response, 'invalid_request'); return; }
      const pending = store.get<Pending>(`pending:${parsed.data.request}`);
      if (!pending || !this.browserMatches(request, pending)) { failures(response, 'invalid_state'); return; }
      store.remove(`pending:${parsed.data.request}`);
      const state = token();
      store.put(`shopify-state:${state}`, { ...pending, shop: parsed.data.shop }, 600);
      const url = new URL(`https://${parsed.data.shop}/admin/oauth/authorize`);
      url.search = new URLSearchParams({ client_id: this.options.clientId, scope: SHOPIFY_SCOPES.join(','),
        redirect_uri: `${base}/oauth/shopify/callback`, state }).toString();
      response.redirect(url.href);
    });
    app.get('/oauth/shopify/callback', async (request, response) => {
      const query = z.object({ state: z.string(), shop: shopDomain, code: z.string(), hmac: z.string(), timestamp: z.string() }).safeParse(request.query);
      if (!query.success) { failures(response, 'invalid_request'); return; }
      const q = query.data;
      const pending = store.get<Pending>(`shopify-state:${q.state}`);
      if (!pending || pending.shop !== q.shop || !this.browserMatches(request, pending)) { failures(response, 'invalid_state'); return; }
      try {
        const signedQuery = new URLSearchParams(new URL(request.originalUrl, base).search);
        if (![...signedQuery.keys()].every(key => signedQuery.getAll(key).length === 1)
            || !await this.shopify.utils.validateHmac(signedQuery)) { failures(response, 'invalid_hmac'); return; }
        store.remove(`shopify-state:${q.state}`);
        const grant = await this.exchangeShopify(q.shop, { code: q.code });
        const grantId = token();
        store.put(`grant:${grantId}`, { ...grant, authorizationExpiresAt: Date.now() + TTL * 1000 }, TTL);
        const code = token();
        store.put(`code:${hash(code)}`, { clientId: pending.clientId, redirectUri: pending.redirectUri,
          challenge: pending.challenge, grantId, resource: pending.resource } satisfies AuthorizationCode, 120);
        response.clearCookie('toolkit_oauth', { path: '/oauth' });
        const destination = new URL(pending.redirectUri);
        destination.searchParams.set('code', code);
        if (pending.state) destination.searchParams.set('state', pending.state);
        response.redirect(destination.href);
      } catch { failures(response, 'shopify_authorization_failed'); }
    });
    app.post('/token', (request, response) => {
      response.set('Cache-Control', 'no-store');
      const body = (request.body && typeof request.body === 'object' && !Array.isArray(request.body) ? request.body : {}) as Record<string, unknown>;
      if (typeof body.client_id !== 'string' || body.resource !== this.resource) { failures(response, 'invalid_request'); return; }
      if (body.grant_type === 'authorization_code') {
        if (typeof body.code !== 'string' || typeof body.code_verifier !== 'string'
            || !/^[A-Za-z0-9._~-]{43,128}$/.test(body.code_verifier)) { failures(response, 'invalid_grant'); return; }
        const code = store.get<AuthorizationCode>(`code:${hash(body.code)}`);
        const challenge = createHash('sha256').update(body.code_verifier).digest('base64url');
        if (!code || code.clientId !== body.client_id || code.redirectUri !== body.redirect_uri
            || code.resource !== body.resource || !equal(challenge, code.challenge)
            || !store.get<Grant>(`grant:${code.grantId}`)) { failures(response, 'invalid_grant'); return; }
        store.remove(`code:${hash(body.code)}`);
        response.json(this.issue(code));
      } else if (body.grant_type === 'refresh_token') {
        if (typeof body.refresh_token !== 'string' || (body.scope !== undefined && body.scope !== MCP_SCOPE)) { failures(response, 'invalid_grant'); return; }
        const key = `refresh:${hash(body.refresh_token)}`;
        const refresh = store.get<Credential>(key);
        if (!refresh || refresh.clientId !== body.client_id || refresh.resource !== body.resource
            || !store.get<Grant>(`grant:${refresh.grantId}`)) { failures(response, 'invalid_grant'); return; }
        store.remove(key);
        response.json(this.issue(refresh));
      } else { failures(response, 'unsupported_grant_type'); }
    });
    app.post('/revoke', (request, response) => {
      const body = (request.body && typeof request.body === 'object' && !Array.isArray(request.body) ? request.body : {}) as Record<string, unknown>;
      if (typeof body.token === 'string' && typeof body.client_id === 'string') {
        for (const kind of ['access', 'refresh']) {
          const key = `${kind}:${hash(body.token)}`;
          const credential = store.get<Credential>(key);
          if (credential?.clientId === body.client_id) { store.remove(`grant:${credential.grantId}`); store.remove(key); }
        }
      }
      response.status(200).json({});
    });
  }
  private browserMatches(request: Request, pending: Pending): boolean {
    const cookie = request.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith('toolkit_oauth='))?.slice(14);
    return !!cookie && equal(hash(cookie), pending.browserHash);
  }
  private issue(record: { clientId: string; grantId: string; resource: string }) {
    const access = token(), refresh = token();
    this.options.store.put(`access:${hash(access)}`, { ...record, kind: 'access' } satisfies Credential, 3600);
    this.options.store.put(`refresh:${hash(refresh)}`, { ...record, kind: 'refresh' } satisfies Credential, TTL);
    return { access_token: access, refresh_token: refresh, token_type: 'Bearer', expires_in: 3600, scope: MCP_SCOPE };
  }
  async connection(bearer: string): Promise<Connection | undefined> {
    const credential = this.options.store.get<Credential>(`access:${hash(bearer)}`);
    if (!credential || credential.resource !== this.resource || credential.kind !== 'access') return undefined;
    let grant = this.options.store.get<Grant>(`grant:${credential.grantId}`);
    if (!grant) return undefined;
    if (grant.expiresAt && grant.expiresAt < Date.now() + 30000) {
      if (!grant.refreshToken) return undefined;
      let pending = this.refreshing.get(credential.grantId);
      if (!pending) {
        pending = this.exchangeShopify(grant.shop, { grant_type: 'refresh_token', refresh_token: grant.refreshToken })
          .then(refreshed => {
            // A concurrent revocation must not be undone by a completed refresh.
            const current = this.options.store.get<Grant>(`grant:${credential.grantId}`);
            if (!current) return undefined;
            const authorizationExpiresAt = current.authorizationExpiresAt ?? Date.now() + TTL * 1000;
            const updated = { ...refreshed, authorizationExpiresAt };
            this.options.store.put(`grant:${credential.grantId}`, updated, Math.max(0, (authorizationExpiresAt - Date.now()) / 1000));
            return updated;
          }).catch(() => undefined).finally(() => this.refreshing.delete(credential.grantId));
        this.refreshing.set(credential.grantId, pending);
      }
      return pending;
    }
    return grant;
  }
  private async exchangeShopify(shop: string, values: Record<string, string>): Promise<Grant> {
    const response = await this.fetcher(`https://${shopDomain.parse(shop)}/admin/oauth/access_token`, {
      method: 'POST', redirect: 'error', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: this.options.clientId, client_secret: this.options.clientSecret, ...values }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Token exchange failed');
    const data = z.object({ access_token: z.string().min(1), scope: z.string(),
      expires_in: z.number().positive().optional(), refresh_token: z.string().optional() }).parse(await response.json());
    const scopes = data.scope.split(',');
    if (!SHOPIFY_SCOPES.every(scope => scopes.includes(scope))) throw new Error('Missing approved scope');
    return { shop, accessToken: data.access_token, scopes, refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined };
  }
}
