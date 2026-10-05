import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';
import express, { type Express, type Request, type Response } from 'express';
import { z } from 'zod';
import type { RecordStore } from './record-store.js';
import { SHOPIFY_SCOPES, shopDomain, type Connection, type Fetch } from './shopify.js';

const TTL = 7 * 24 * 3600;
const PAIR_TTL = 600;
const token = () => Buffer.from(randomBytes(32)).toString('base64url');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const same = (a: string, b: string) => Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const pairingCode = z.string().max(80).transform(value => value.replace(/[\s-]/g, '').toUpperCase()).pipe(z.string().regex(/^[A-F0-9]{32}$/));
const recordId = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
const failure = (response: Response, error: string, status = 400) => response.status(status).json({ error });

export type McpPending = { clientId: string; redirectUri: string; state?: string; challenge: string; resource: string; browserHash: string; shop?: string };
export type PublicGrant = { shop: string; installationId: string; clientName: string; returnOrigin: string; createdAt: number; authorizationExpiresAt: number };
type Pairing = { pendingId: string; clientName: string; returnOrigin: string; expiresAt: number; processing?: string; approvedGrantId?: string; shop?: string };
type Review = { pairingKey: string; shop: string; subjectHash: string; generation: string; expiresAt: number };
type Installation = Connection & { id: string; generation: string; refreshToken: string; expiresAt: number; refreshExpiresAt: number; authorizationExpiresAt: number };
type Lifecycle = { generation: string; revokedBefore?: number };
type SessionClaims = { iss: string; dest: string; aud: string; exp: number; nbf: number; iat: number; sub: string };
export type AppAuthorization = { connection: Connection; isOwner: boolean; subjectHash: string; generation: string; sessionToken: string };
export type AppHomeConfig = { clientId: string; publicUrl: string; appHandle?: string };
export type PublicAuthOptions = { publicUrl: string; clientId: string; clientSecret: string; store: RecordStore; fetcher: Fetch;
  publicAppHandle?: string; publicInstallUrl?: string; renderAppHome?: (config: AppHomeConfig) => string };

/** Managed installation uses Shopify identity; MCP pairing stays bound to its original browser. */
export class PublicShopifyAuth {
  private offlineFlights = new Map<string, Promise<Installation | undefined>>();
  constructor(private options: PublicAuthOptions,
    private decodeSessionToken: (value: string) => Promise<unknown>,
    private finish: (pending: McpPending, grantId: string, response: Response) => void) {
    if (options.publicAppHandle && !/^[a-z0-9][a-z0-9-]{0,99}$/.test(options.publicAppHandle)) throw new Error('Invalid public app handle.');
    if (options.publicInstallUrl) {
      const url = new URL(options.publicInstallUrl);
      if (url.protocol !== 'https:' || url.username || url.password || url.hash
          || !['apps.shopify.com', 'admin.shopify.com'].includes(url.hostname)) throw new Error('Invalid Shopify install URL.');
    }
  }

  begin(id: string, pending: McpPending, clientName: string, response: Response): void {
    const code = Buffer.from(randomBytes(16)).toString('hex').toUpperCase();
    const pairingKey = `pairing:${hash(code)}`;
    const record: Pairing = { pendingId: id, clientName, returnOrigin: new URL(pending.redirectUri).origin, expiresAt: Date.now() + PAIR_TTL * 1000 };
    this.options.store.put(pairingKey, record, PAIR_TTL);
    this.options.store.put(`pairing-request:${id}`, { pairingKey }, PAIR_TTL);
    const nonce = token();
    const install = this.options.publicInstallUrl ?? (this.options.publicAppHandle ? `https://apps.shopify.com/${this.options.publicAppHandle}` : undefined);
    // Chromium applies form-action to the final redirect destination as well as the POST.
    response.set('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}'; connect-src 'self'; style-src 'nonce-${nonce}'; form-action 'self' ${record.returnOrigin}; base-uri 'none'; frame-ancestors 'none'`);
    // Navigate-mode POSTs need a same-origin referrer policy to retain their Origin header.
    response.set('Referrer-Policy', 'same-origin');
    response.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect MKT Skills VA Toolkit</title>
      <style nonce="${nonce}">body{font:18px system-ui;margin:3rem auto;padding:0 1.25rem;max-width:40rem;line-height:1.6}code{display:block;font-size:1.2rem;padding:1rem;background:#f4f4f5;overflow-wrap:anywhere}button{font:inherit;padding:.5rem 1rem}button:focus-visible,a:focus-visible{outline:3px solid #6558d3}</style></head><body><main>
      <h1>Connect your Shopify store</h1><p><strong>${escape(clientName)}</strong> requests read-only access. Its return address is <strong>${escape(record.returnOrigin)}</strong>.</p>
      <ol><li>Copy this connection code:<code id="pairing-code">${code.match(/.{1,4}/g)!.join('-')}</code><button id="copy" type="button">Copy code</button></li>
      <li>${install ? `<a href="${escape(install)}" target="_blank" rel="noopener noreferrer">Install or open the app in Shopify</a>` : 'Open MKT Skills VA Toolkit from your Shopify Apps list. Public installation is awaiting approval.'}</li>
      <li>The store owner enters the code in the app, checks the client and store, then approves.</li></ol>
      <p>Read permissions: products, inventory and order summaries. The connector cannot edit your store. Codes expire after 10 minutes.</p>
      <p id="status" role="status">Waiting for store owner approval. Keep this window open.</p>
      <form id="complete" method="post" action="/oauth/public/complete"><input type="hidden" name="request" value="${id}"><button id="continue" type="submit" hidden>Continue to ${escape(clientName)}</button></form>
      <p>Close this window to cancel. Never approve a code you did not request.</p></main>
      <script nonce="${nonce}">const requestId=${JSON.stringify(id)};const status=document.getElementById('status');document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(document.getElementById('pairing-code').textContent);status.textContent='Code copied. Enter it in the Shopify app.'}catch{status.textContent='Select and copy the displayed code.'}};
      const until=Date.now()+600000;let stopped=false;async function check(){if(stopped)return;if(Date.now()>until){status.textContent='This code expired. Restart the connection from your AI app.';return}try{const result=await fetch('/oauth/public/status?request='+encodeURIComponent(requestId),{credentials:'same-origin',cache:'no-store'});if(!result.ok){status.textContent='This request is no longer available. Restart the connection.';return}const data=await result.json();if(data.status==='approved'){stopped=true;status.textContent='Owner approved '+data.shop+'. Continue to finish connecting.';document.getElementById('continue').hidden=false;return}}catch{status.textContent='Connection check unavailable. Retrying shortly.'}setTimeout(check,3000)}check();</script></body></html>`);
  }

  install(app: Express): void {
    app.get('/app', (request, response) => {
      if (!this.options.renderAppHome) { failure(response, 'app_home_unavailable', 503); return; }
      const shop = shopDomain.safeParse(request.query.shop);
      response.set('Content-Security-Policy', "default-src 'none'; script-src 'self' https://cdn.shopify.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.shopify.com https://*.myshopify.com; img-src 'self' data: https://cdn.shopify.com; base-uri 'none'; frame-ancestors https://admin.shopify.com" + (shop.success ? ` https://${shop.data}` : ''));
      response.type('html').send(this.options.renderAppHome({ clientId: this.options.clientId, publicUrl: this.options.publicUrl, appHandle: this.options.publicAppHandle }));
    });
    app.post('/app/session', this.appHandler(async (authorization, _request, response) => {
      const connections = this.grants(authorization.connection.shop);
      response.json({ shop: authorization.connection.shop, is_owner: authorization.isOwner, permissions: authorization.connection.scopes,
        connected: connections.length > 0, connections: connections.length });
    }));
    app.get('/app/connections', this.appHandler(async (authorization, _request, response) => {
      response.json({ shop: authorization.connection.shop, is_owner: authorization.isOwner, connections: this.grants(authorization.connection.shop)
        .map(({ key, value }) => ({ id: key.slice(6), client_name: value.clientName, return_origin: value.returnOrigin, created_at: value.createdAt, expires_at: value.authorizationExpiresAt })) });
    }));
    app.post('/app/pairing/inspect', this.appHandler(async (authorization, request, response) => {
      if (!authorization.isOwner) { failure(response, 'owner_approval_required', 403); return; }
      const parsed = z.object({ pairing_code: pairingCode }).strict().safeParse(request.body);
      if (!parsed.success) { failure(response, 'invalid_request'); return; }
      const key = `pairing:${hash(parsed.data.pairing_code)}`, pair = this.options.store.get<Pairing>(key);
      if (!pair || pair.processing || pair.approvedGrantId || !this.options.store.get<McpPending>(`pending:${pair.pendingId}`)) { failure(response, 'pairing_unavailable'); return; }
      const review = token();
      this.options.store.put(`pairing-review:${hash(review)}`, { pairingKey: key, shop: authorization.connection.shop,
        subjectHash: authorization.subjectHash, generation: authorization.generation, expiresAt: Date.now() + 120000 } satisfies Review, 120, authorization.connection.shop);
      response.json({ shop: authorization.connection.shop, client_name: pair.clientName, return_origin: pair.returnOrigin,
        permissions: SHOPIFY_SCOPES, expires_at: pair.expiresAt, review_token: review });
    }));
    app.post('/app/pairing/approve', this.appHandler(async (authorization, request, response) => {
      if (!authorization.isOwner) { failure(response, 'owner_approval_required', 403); return; }
      const parsed = z.object({ pairing_code: pairingCode, review_token: recordId }).strict().safeParse(request.body);
      if (!parsed.success) { failure(response, 'invalid_request'); return; }
      const shop = authorization.connection.shop, key = `pairing:${hash(parsed.data.pairing_code)}`;
      const review = this.options.store.get<Review>(`pairing-review:${hash(parsed.data.review_token)}`);
      if (!review || review.pairingKey !== key || review.shop !== shop || review.subjectHash !== authorization.subjectHash
          || review.generation !== authorization.generation) { failure(response, 'approval_review_required'); return; }
      const pair = this.options.store.get<Pairing>(key), pending = pair && this.options.store.get<McpPending>(`pending:${pair.pendingId}`);
      if (!pair || !pending || pair.processing || pair.approvedGrantId) { failure(response, 'pairing_unavailable'); return; }
      const claim = token();
      this.options.store.remove(`pairing-review:${hash(parsed.data.review_token)}`);
      this.options.store.put(key, { ...pair, processing: claim, shop }, Math.max(0, (pair.expiresAt - Date.now()) / 1000), shop);
      this.options.store.put(`pending:${pair.pendingId}`, pending, Math.max(0, (pair.expiresAt - Date.now()) / 1000), shop);
      this.options.store.put(`pairing-request:${pair.pendingId}`, { pairingKey: key }, Math.max(0, (pair.expiresAt - Date.now()) / 1000), shop);
      let installation: Installation | undefined;
      try { installation = await this.offline(shop, authorization.generation, authorization.sessionToken); }
      catch (error) {
        if (this.options.store.get<Pairing>(key)?.processing === claim && this.lifecycle(shop).generation === authorization.generation) {
          this.options.store.put(key, { ...pair, shop }, Math.max(0, (pair.expiresAt - Date.now()) / 1000), shop);
          // App Bridge replays this exact request once with a fresh ID token. Keep its still-valid owner review.
          if (error instanceof PublicAuthError && error.code === 'invalid_session' && review.expiresAt > Date.now()) {
            this.options.store.put(`pairing-review:${hash(parsed.data.review_token)}`, review, (review.expiresAt - Date.now()) / 1000, shop);
          }
        }
        throw error;
      }
      const current = this.options.store.get<Pairing>(key);
      if (!installation || !current || current.processing !== claim || !this.options.store.get<McpPending>(`pending:${pair.pendingId}`)
          || this.lifecycle(shop).generation !== authorization.generation) { failure(response, 'pairing_unavailable'); return; }
      const grantId = token();
      this.options.store.put(`grant:${grantId}`, { shop, installationId: installation.id, clientName: pair.clientName, returnOrigin: pair.returnOrigin,
        createdAt: Date.now(), authorizationExpiresAt: Date.now() + TTL * 1000 } satisfies PublicGrant, TTL, shop);
      this.options.store.put(key, { ...pair, shop, approvedGrantId: grantId }, Math.max(0, (pair.expiresAt - Date.now()) / 1000), shop);
      response.json({ approved: true, shop, client_name: pair.clientName });
    }));
    app.post('/app/disconnect', this.appHandler(async (authorization, request, response) => {
      if (!authorization.isOwner) { failure(response, 'owner_approval_required', 403); return; }
      const parsed = z.object({ connection_id: recordId }).strict().safeParse(request.body);
      if (!parsed.success) { failure(response, 'invalid_request'); return; }
      const grant = this.options.store.get<PublicGrant>(`grant:${parsed.data.connection_id}`);
      if (grant && grant.shop !== authorization.connection.shop) { failure(response, 'connection_unavailable', 404); return; }
      this.removeGrant(authorization.connection.shop, parsed.data.connection_id);
      response.json({ disconnected: true, shop: authorization.connection.shop });
    }));
    app.get('/oauth/public/status', (request, response) => {
      const parsed = recordId.safeParse(request.query.request);
      const pending = parsed.success && this.options.store.get<McpPending>(`pending:${parsed.data}`);
      if (!pending || !this.browserMatches(request, pending)) { failure(response, 'invalid_state', 401); return; }
      const pair = this.findPair(parsed.data);
      if (!pair) { failure(response, 'pairing_unavailable'); return; }
      response.json(pair.approvedGrantId ? { status: 'approved', shop: pair.shop } : { status: 'waiting' });
    });
    app.post('/oauth/public/complete', (request, response) => {
      if (request.get('origin') !== this.options.publicUrl) { failure(response, 'origin_not_allowed', 403); return; }
      const parsed = z.object({ request: recordId }).strict().safeParse(request.body);
      const pending = parsed.success && this.options.store.get<McpPending>(`pending:${parsed.data.request}`);
      if (!pending || !this.browserMatches(request, pending)) { failure(response, 'invalid_state'); return; }
      const id = parsed.data.request, link = this.options.store.get<{ pairingKey: string }>(`pairing-request:${id}`);
      const pair = link && this.options.store.get<Pairing>(link.pairingKey);
      const grant = pair?.approvedGrantId && this.options.store.get<PublicGrant>(`grant:${pair.approvedGrantId}`);
      if (!pair || !grant || !pair.approvedGrantId || !this.options.store.get<Installation>(`installation:${grant.shop}`)) { failure(response, 'pairing_unavailable'); return; }
      this.options.store.remove(`pending:${id}`); this.options.store.remove(`pairing-request:${id}`); this.options.store.remove(link!.pairingKey);
      this.finish(pending, pair.approvedGrantId, response);
    });
  }

  installWebhooks(app: Express): void {
    app.post('/webhooks/shopify', express.raw({ type: '*/*', limit: '256kb' }), (request, response) => {
      const raw: unknown = request.body, signature = request.get('x-shopify-hmac-sha256');
      if (!(raw instanceof Uint8Array) || !Buffer.isBuffer(raw)) { failure(response, 'invalid_hmac', 401); return; }
      const bytes = Buffer.from(raw);
      if (!signature || !/^[A-Za-z0-9+/]{43}=$/.test(signature)
          || !same(createHmac('sha256', this.options.clientSecret).update(bytes).digest('base64'), signature)) { failure(response, 'invalid_hmac', 401); return; }
      const topic = request.get('x-shopify-topic');
      const shop = shopDomain.safeParse(request.get('x-shopify-shop-domain'));
      if (!topic || !['app/uninstalled', 'customers/data_request', 'customers/redact', 'shop/redact'].includes(topic) || !shop.success) { failure(response, 'invalid_webhook'); return; }
      let body: Record<string, unknown>;
      try {
        const payload: unknown = JSON.parse(bytes.toString('utf8'));
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error();
        body = payload as Record<string, unknown>;
      } catch { failure(response, 'invalid_webhook'); return; }
      const payloadShop = topic === 'app/uninstalled' ? body.myshopify_domain : body.shop_domain;
      if (payloadShop !== shop.data) { failure(response, 'invalid_webhook'); return; }
      const deliveryId = request.get('x-shopify-event-id') ?? request.get('x-shopify-webhook-id') ?? createHash('sha256').update(bytes).digest('hex');
      if (deliveryId.length > 200) { failure(response, 'invalid_webhook'); return; }
      const receipt = `webhook:${hash(`${shop.data}:${topic}:${deliveryId}`)}`;
      try {
        if (this.options.store.get(receipt)) { response.status(200).json({ received: true }); return; }
        if (topic === 'app/uninstalled' || topic === 'shop/redact') {
          const lifecycle = this.options.store.get<Lifecycle>(this.lifecycleKey(shop.data));
          const installation = this.options.store.get<Installation>(`installation:${shop.data}`);
          // shop/redact follows an uninstall. A newly verified reinstall owns new records.
          if (topic === 'shop/redact' && lifecycle?.revokedBefore && installation) {
            this.options.store.put(receipt, { received: true }, TTL);
            response.status(200).json({ received: true }); return;
          }
          // Persist the barrier before deleting credentials; suspended exchanges must never recreate access.
          this.options.store.put(this.lifecycleKey(shop.data), { generation: token(), revokedBefore: Date.now() / 1000 } satisfies Lifecycle, TTL * 4);
          this.options.store.removeByShop(shop.data);
        }
        // These fixed tools never retain customer/order payloads. No customer ID or webhook body is persisted.
        this.options.store.put(receipt, { received: true }, TTL);
        response.status(200).json({ received: true });
      } catch { failure(response, 'webhook_processing_failed', 503); }
    });
  }

  async appConnection(request: Request): Promise<AppAuthorization> {
    const bearer = /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/.exec(request.get('authorization') ?? '')?.[1];
    if (!bearer || bearer.length > 8192) throw new PublicAuthError('invalid_session', 401);
    let claims: SessionClaims;
    try {
      claims = z.object({ iss: z.string(), dest: z.string(), aud: z.literal(this.options.clientId), exp: z.number().int(),
        nbf: z.number().int(), iat: z.number().int(), sub: z.string().min(1).max(100) }).parse(await this.decodeSessionToken(bearer));
      const now = Date.now() / 1000, dest = new URL(claims.dest), issuer = new URL(claims.iss);
      if (claims.exp <= now || claims.nbf > now || claims.iat > now || claims.exp - claims.iat > 90 || claims.exp <= claims.iat
          || claims.nbf > claims.exp || dest.protocol !== 'https:' || dest.port || dest.origin !== claims.dest || dest.username || dest.password
          || !shopDomain.safeParse(dest.hostname).success || issuer.href !== `${dest.origin}/admin`) throw new Error();
    } catch { throw new PublicAuthError('invalid_session', 401); }
    const shop = new URL(claims.dest).hostname;
    const lifecycle = this.lifecycle(shop);
    if (lifecycle.revokedBefore && claims.iat <= lifecycle.revokedBefore) throw new PublicAuthError('invalid_session', 401);
    const data = await this.exchange(shop, { grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange', subject_token: bearer,
      subject_token_type: 'urn:ietf:params:oauth:token-type:id_token', requested_token_type: 'urn:shopify:params:oauth:token-type:online-access-token' });
    const online = z.object({ access_token: z.string().min(1), scope: z.string(), expires_in: z.number().positive(),
      associated_user_scope: z.string(), associated_user: z.object({ account_owner: z.boolean() }) }).safeParse(data);
    if (!online.success) throw new PublicAuthError('shopify_authorization_failed', 502);
    const scopes = online.data.associated_user_scope.split(',').map(value => value.trim()).filter(value => SHOPIFY_SCOPES.includes(value));
    if (!scopes.length || !SHOPIFY_SCOPES.every(scope => online.data.scope.split(',').map(value => value.trim()).includes(scope))) throw new PublicAuthError('missing_approved_scope', 403);
    if (this.lifecycle(shop).generation !== lifecycle.generation) throw new PublicAuthError('invalid_session', 401);
    return { connection: { shop, accessToken: online.data.access_token, scopes }, isOwner: online.data.associated_user.account_owner,
      subjectHash: hash(claims.sub), generation: lifecycle.generation, sessionToken: bearer };
  }

  async connection(grantId: string, grant: PublicGrant): Promise<Connection | undefined> {
    if (grant.authorizationExpiresAt <= Date.now()) return undefined;
    const lifecycle = this.lifecycle(grant.shop);
    const installation = this.options.store.get<Installation>(`installation:${grant.shop}`);
    if (!installation || installation.id !== grant.installationId || installation.generation !== lifecycle.generation) return undefined;
    const current = await this.offline(grant.shop, lifecycle.generation);
    const stillGranted = this.options.store.get<PublicGrant>(`grant:${grantId}`);
    if (!current || !stillGranted || stillGranted.installationId !== current.id) return undefined;
    return { shop: current.shop, accessToken: current.accessToken, scopes: current.scopes };
  }

  private grants(shop: string) { return this.options.store.listByShop<PublicGrant>(shop, 'grant:').filter(({ value }) => typeof value.installationId === 'string'); }
  private removeGrant(shop: string, grantId: string): void {
    for (const { key, value } of this.options.store.listByShop<{ grantId?: string }>(shop, '')) if (value.grantId === grantId) this.options.store.remove(key);
    this.options.store.remove(`grant:${grantId}`);
  }
  private findPair(id: string): Pairing | undefined {
    const link = this.options.store.get<{ pairingKey: string }>(`pairing-request:${id}`);
    return link ? this.options.store.get<Pairing>(link.pairingKey) : undefined;
  }
  private browserMatches(request: Request, pending: McpPending): boolean {
    const cookie = request.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith('toolkit_oauth='))?.slice(14);
    return !!cookie && same(hash(cookie), pending.browserHash);
  }
  private lifecycleKey(shop: string) { return `shop-lifecycle:${hash(shop)}`; }
  private lifecycle(shop: string): Lifecycle {
    const key = this.lifecycleKey(shop), record = this.options.store.get<Lifecycle>(key);
    if (record) return record;
    const installation = this.options.store.get<Installation>(`installation:${shop}`);
    const created = { generation: installation?.generation ?? token() };
    this.options.store.put(key, created, TTL * 4);
    return created;
  }
  private appHandler(handler: (authorization: AppAuthorization, request: Request, response: Response) => Promise<void>) {
    return async (request: Request, response: Response) => {
      try { await handler(await this.appConnection(request), request, response); }
      catch (error) {
        if (error instanceof PublicAuthError && error.code === 'invalid_session') response.set('X-Shopify-Retry-Invalid-Session-Request', '1');
        failure(response, error instanceof PublicAuthError ? error.code : 'request_failed', error instanceof PublicAuthError ? error.status : 503);
      }
    };
  }
  private async exchange(shop: string, values: Record<string, string>): Promise<unknown> {
    try {
      const response = await this.options.fetcher(`https://${shopDomain.parse(shop)}/admin/oauth/access_token`, { method: 'POST', redirect: 'error',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: this.options.clientId, client_secret: this.options.clientSecret, ...values }), signal: AbortSignal.timeout(10000) });
      if (!response.ok || response.redirected) {
        if (!response.redirected && ((response.status === 400 && values.subject_token_type === 'urn:ietf:params:oauth:token-type:id_token')
            || (response.status === 401 && values.grant_type === 'refresh_token'))) {
          const body = z.object({ error: z.string() }).safeParse(await response.json().catch(() => undefined));
          if (response.status === 400 && body.success && body.data.error === 'invalid_subject_token') throw new PublicAuthError('invalid_session', 401);
          if (response.status === 401 && body.success && body.data.error === 'invalid_request') throw new PublicAuthError('connection_reauthorization_required', 401);
        }
        throw new Error();
      }
      return await response.json();
    } catch (error) {
      if (error instanceof PublicAuthError) throw error;
      throw new PublicAuthError('shopify_authorization_failed', 502);
    }
  }
  private async offline(shop: string, generation: string, sessionToken?: string): Promise<Installation | undefined> {
    let flight = this.offlineFlights.get(shop);
    if (!flight) {
      flight = this.obtainOffline(shop, generation, sessionToken).finally(() => this.offlineFlights.delete(shop));
      this.offlineFlights.set(shop, flight);
    }
    const installation = await flight;
    if (!installation || !sessionToken) return installation;
    // Only a fresh owner pairing approval extends retained installation credentials.
    const current = this.options.store.get<Installation>(`installation:${shop}`);
    if (!current || current.id !== installation.id || this.lifecycle(shop).generation !== generation) return undefined;
    const renewed = { ...current, authorizationExpiresAt: Date.now() + TTL * 1000 };
    this.options.store.put(`installation:${shop}`, renewed, Math.min(TTL, (renewed.refreshExpiresAt - Date.now()) / 1000), shop);
    return renewed;
  }
  private async obtainOffline(shop: string, generation: string, sessionToken?: string): Promise<Installation | undefined> {
    const key = `installation:${shop}`, current = this.options.store.get<Installation>(key);
    if (this.lifecycle(shop).generation !== generation) return undefined;
    if (current && current.authorizationExpiresAt <= Date.now() && !sessionToken) return undefined;
    if (current && current.generation === generation && current.expiresAt > Date.now() + 30000) return current;
    if (!sessionToken && (!current || current.refreshExpiresAt <= Date.now())) return undefined;
    const values: Record<string, string> | undefined = current && current.refreshExpiresAt > Date.now()
      ? { grant_type: 'refresh_token', refresh_token: current.refreshToken }
      : sessionToken ? { grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange', subject_token: sessionToken,
        subject_token_type: 'urn:ietf:params:oauth:token-type:id_token', requested_token_type: 'urn:shopify:params:oauth:token-type:offline-access-token', expiring: '1' } : undefined;
    if (!values) return undefined;
    let exchanged: unknown;
    try { exchanged = await this.exchange(shop, values); }
    catch (error) {
      if (error instanceof PublicAuthError && error.code === 'connection_reauthorization_required' && current
          && this.lifecycle(shop).generation === generation && this.options.store.get<Installation>(key)?.id === current.id) {
        for (const { key: grantKey, value } of this.grants(shop)) if (value.installationId === current.id) this.removeGrant(shop, grantKey.slice(6));
        this.options.store.remove(key);
      }
      throw error;
    }
    const data = z.object({ access_token: z.string().min(1), scope: z.string(), expires_in: z.number().positive(), refresh_token: z.string().min(1), refresh_token_expires_in: z.number().positive() })
      .safeParse(exchanged);
    if (!data.success) throw new PublicAuthError('shopify_authorization_failed', 502);
    const scopes = data.data.scope.split(',').map(value => value.trim());
    if (!SHOPIFY_SCOPES.every(scope => scopes.includes(scope))) throw new PublicAuthError('missing_approved_scope', 403);
    if (this.lifecycle(shop).generation !== generation || (current && this.options.store.get<Installation>(key)?.id !== current.id)) return undefined;
    const updated: Installation = { shop, id: current?.id ?? token(), generation, accessToken: data.data.access_token, scopes,
      refreshToken: data.data.refresh_token, expiresAt: Date.now() + data.data.expires_in * 1000, refreshExpiresAt: Date.now() + data.data.refresh_token_expires_in * 1000,
      authorizationExpiresAt: current?.authorizationExpiresAt ?? Date.now() + TTL * 1000 };
    this.options.store.put(key, updated, Math.min(data.data.refresh_token_expires_in, Math.max(0, (updated.authorizationExpiresAt - Date.now()) / 1000)), shop);
    return updated;
  }
}

export class PublicAuthError extends Error {
  constructor(readonly code: string, readonly status: number) {
    const messages: Record<string, string> = {
      invalid_session: 'Open the app inside Shopify and retry with a fresh sign-in token.',
      missing_approved_scope: 'The required read permissions are unavailable. Ask the store owner to review the app installation.',
      shopify_authorization_failed: 'Shopify could not confirm access. Reopen the app in Shopify and try again.',
      connection_reauthorization_required: 'The store connection has expired or was revoked. Ask the owner to approve a new connection inside Shopify.',
    };
    super(messages[code] ?? 'The connection could not be verified. Reopen the app in Shopify and try again.');
  }
}
