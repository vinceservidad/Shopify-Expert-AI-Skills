import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, createHmac, randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import express from 'express';
import { ShopifyOAuth } from '../src/auth.js';
import { SecretStore } from '../src/store.js';
import { SHOPIFY_SCOPES, type Fetch } from '../src/shopify.js';

const CLIENT_ID = 'synthetic-public-app', SECRET = 'synthetic-public-secret';
const shopA = 'synthetic-public-a.myshopify.com', shopB = 'synthetic-public-b.myshopify.com';
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
function jwt(shop = shopA, overrides: Record<string, unknown> = {}, secret = SECRET, algorithm = 'HS256') {
  const now = Math.floor(Date.now() / 1000);
  const head = Buffer.from(JSON.stringify({ alg: algorithm, typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ iss: `https://${shop}/admin`, dest: `https://${shop}`, aud: CLIENT_ID,
    sub: '12345', iat: now, nbf: now - 1, exp: now + 60, sid: 'synthetic-session', jti: randomBytes(16).toString('hex'), ...overrides })).toString('base64url');
  return `${head}.${payload}.${createHmac('sha256', secret).update(`${head}.${payload}`).digest('base64url')}`;
}
async function setup() {
  const store = new SecretStore(':memory:', randomBytes(32));
  const listener = createServer();
  await new Promise<void>(resolve => listener.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${(listener.address() as { port: number }).port}`;
  let owner = true, onlineScopes = [...SHOPIFY_SCOPES], returnedScopes = [...SHOPIFY_SCOPES], exchanges = 0;
  let exchangeHook: ((body: Record<string, string>, shop: string) => Promise<Response | undefined>) | undefined;
  const calls: { body: Record<string, string>; shop: string }[] = [];
  const auth = new ShopifyOAuth({ mode: 'public', publicUrl: base, clientId: CLIENT_ID, clientSecret: SECRET, store,
    publicInstallUrl: 'https://admin.shopify.com/oauth/install?client_id=synthetic-public-app',
    renderAppHome: config => `<html><title>${config.clientId}</title><main>No store data before authentication</main></html>`,
    fetcher: (async (url, init) => {
      assert.equal(init?.redirect, 'error'); assert.ok(init?.signal);
      const shop = new URL(String(url)).hostname;
      assert.ok([shopA, shopB].includes(shop));
      const body = JSON.parse(init?.body as string) as Record<string, string>;
      calls.push({ body, shop });
      const overridden = await exchangeHook?.(body, shop);
      if (overridden) return overridden;
      if (body.requested_token_type?.endsWith('online-access-token')) return json({ access_token: `synthetic-online-${shop}`, scope: returnedScopes.join(','),
        expires_in: 86400, associated_user_scope: onlineScopes.join(','), associated_user: { id: 12345, account_owner: owner, email: 'synthetic-identity-do-not-retain@example.test' } });
      exchanges++;
      if (body.grant_type !== 'refresh_token') assert.equal(body.expiring, '1');
      return json({ access_token: `synthetic-offline-${shop}-${exchanges}`, scope: returnedScopes.join(','), expires_in: 3600,
        refresh_token: `synthetic-upstream-refresh-${exchanges}`, refresh_token_expires_in: 7776000 });
    }) as Fetch });
  const app = express(); app.disable('x-powered-by'); auth.installWebhooks(app);
  app.use(express.json({ limit: '32kb' }), express.urlencoded({ extended: false })); auth.install(app);
  app.use((_error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => response.status(500).json({ error: 'request_failed' }));
  listener.on('request', app);
  const post = (path: string, body: unknown, bearer = jwt(), headers: Record<string, string> = {}) => fetch(`${base}${path}`, { method: 'POST', redirect: 'manual',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearer}`, Origin: base, ...headers }, body: JSON.stringify(body) });
  const webhook = (shop = shopA, topic = 'app/uninstalled', id = randomBytes(16).toString('hex'), body?: string, signature?: string) => {
    const raw = body ?? JSON.stringify(topic === 'app/uninstalled' ? { myshopify_domain: shop } : { shop_domain: shop });
    return fetch(`${base}/webhooks/shopify`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Shop-Domain': shop,
      'X-Shopify-Topic': topic, 'X-Shopify-Event-Id': id, 'X-Shopify-Hmac-SHA256': signature ?? createHmac('sha256', SECRET).update(raw).digest('base64') }, body: raw });
  };
  async function begin(name = 'Synthetic ChatGPT client') {
    const registration = await post('/register', { client_name: name, redirect_uris: ['https://synthetic-client.example/callback'] });
    assert.equal(registration.status, 201); const { client_id } = await registration.json() as { client_id: string };
    const verifier = randomBytes(32).toString('base64url');
    const query = new URLSearchParams({ client_id, redirect_uri: 'https://synthetic-client.example/callback', response_type: 'code', resource: `${base}/mcp`,
      state: 'synthetic-client-state', code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256' });
    const response = await fetch(`${base}/authorize?${query}`); assert.equal(response.status, 200);
    const cookie = response.headers.get('set-cookie')!.split(';')[0]!, html = await response.text();
    const id = /name="request" value="([^"]+)"/.exec(html)![1]!;
    const code = /id="pairing-code">([^<]+)</.exec(html)![1]!;
    assert.ok(!html.includes('name="shop"')); assert.ok(html.includes('https://admin.shopify.com/oauth/install?client_id=synthetic-public-app'));
    assert.match(response.headers.get('content-security-policy')!, /script-src 'nonce-/);
    assert.match(response.headers.get('content-security-policy')!, /form-action 'self' https:\/\/synthetic-client\.example;/);
    assert.ok(!response.headers.get('content-security-policy')!.includes('hostile.example'));
    assert.ok(!response.headers.get('content-security-policy')!.includes('form-action *'));
    assert.equal(response.headers.get('referrer-policy'), 'same-origin');
    return { id, code, cookie, verifier, clientId: client_id };
  }
  async function approve(pair: Awaited<ReturnType<typeof begin>>, shop = shopA) {
    const inspect = await post('/app/pairing/inspect', { pairing_code: pair.code }, jwt(shop));
    assert.equal(inspect.status, 200, await inspect.clone().text());
    const review = await inspect.json() as { review_token: string; shop: string; client_name: string; return_origin: string; permissions: string[] };
    assert.equal(review.shop, shop); assert.equal(review.return_origin, 'https://synthetic-client.example'); assert.deepEqual(review.permissions, SHOPIFY_SCOPES);
    const approval = await post('/app/pairing/approve', { pairing_code: pair.code, review_token: review.review_token }, jwt(shop));
    assert.equal(approval.status, 200, await approval.clone().text());
    return review;
  }
  async function complete(pair: Awaited<ReturnType<typeof begin>>) {
    const completion = await post('/oauth/public/complete', { request: pair.id }, jwt(), { Cookie: pair.cookie });
    assert.equal(completion.status, 302, await completion.clone().text());
    const location = new URL(completion.headers.get('location')!); assert.equal(location.searchParams.get('state'), 'synthetic-client-state');
    const body = { grant_type: 'authorization_code', client_id: pair.clientId, code: location.searchParams.get('code'), code_verifier: pair.verifier,
      redirect_uri: 'https://synthetic-client.example/callback', resource: `${base}/mcp` };
    const response = await post('/token', body); assert.equal(response.status, 200, await response.clone().text());
    return { tokens: await response.json() as { access_token: string; refresh_token: string }, body };
  }
  return { base, store, auth, calls, post, webhook, begin, approve, complete,
    owner: (value: boolean) => { owner = value; }, scopes: (values: string[]) => { returnedScopes = values; },
    staffScopes: (values: string[]) => { onlineScopes = values; }, hook: (value: typeof exchangeHook) => { exchangeHook = value; },
    close: async () => { listener.closeAllConnections(); await new Promise<void>(resolve => listener.close(() => resolve())); store.close(); } };
}

test('public pairing verifies owner, browser, client, PKCE, one-use code and one authoritative installation', async () => {
  const f = await setup();
  try {
    const pair = await f.begin();
    const status = `${f.base}/oauth/public/status?request=${pair.id}`;
    assert.equal((await fetch(status)).status, 401);
    assert.deepEqual(await (await fetch(status, { headers: { Cookie: pair.cookie } })).json(), { status: 'waiting' });
    f.owner(false); assert.equal((await f.post('/app/pairing/inspect', { pairing_code: pair.code })).status, 403);
    assert.equal(f.calls.filter(c => c.body.requested_token_type?.endsWith('offline-access-token')).length, 0);
    f.owner(true); const review = await f.approve(pair);
    assert.equal((await f.post('/oauth/public/complete', { request: pair.id })).status, 400);
    assert.equal((await f.post('/oauth/public/complete', { request: pair.id }, jwt(), { Cookie: pair.cookie, Origin: 'https://hostile.example' })).status, 403);
    const first = await f.complete(pair);
    assert.equal((await f.post('/token', first.body)).status, 400);
    assert.equal((await f.post('/oauth/public/complete', { request: pair.id }, jwt(), { Cookie: pair.cookie })).status, 400);
    assert.equal((await f.post('/app/pairing/approve', { pairing_code: pair.code, review_token: review.review_token })).status, 400);
    assert.equal((await f.auth.connection(first.tokens.access_token))?.shop, shopA);
    const secondPair = await f.begin('Synthetic Claude client'); await f.approve(secondPair); const second = await f.complete(secondPair);
    assert.equal((await f.auth.connection(second.tokens.access_token))?.shop, shopA);
    assert.equal(f.calls.filter(c => c.body.requested_token_type?.endsWith('offline-access-token')).length, 1);
    const grants = f.store.listByShop<{ installationId: string }>(shopA, 'grant:');
    assert.equal(grants.length, 2); assert.equal(grants[0]!.value.installationId, grants[1]!.value.installationId);
    assert.ok(!JSON.stringify(grants).includes('synthetic-offline'));
    const list = await fetch(`${f.base}/app/connections`, { headers: { Authorization: `Bearer ${jwt()}` } });
    const result = await list.json() as { connections: { id: string; client_name: string }[] };
    assert.equal(result.connections.length, 2); assert.ok(!JSON.stringify(result).includes('synthetic-identity'));
    const firstConnection = result.connections.find(value => value.client_name === 'Synthetic ChatGPT client')!;
    assert.equal((await f.post('/app/disconnect', { connection_id: firstConnection.id }, jwt(shopB))).status, 404);
    assert.equal((await f.post('/app/disconnect', { connection_id: firstConnection.id })).status, 200);
    assert.equal(await f.auth.connection(first.tokens.access_token), undefined);
    assert.equal((await f.auth.connection(second.tokens.access_token))?.shop, shopA);
  } finally { await f.close(); }
});

test('public session validates exact Shopify identity and time before exchanging; staff reads keep their scopes', async () => {
  const f = await setup();
  try {
    const now = Math.floor(Date.now() / 1000);
    const badClaims = [{ aud: 'wrong-app' }, { dest: 'https://evil.example' }, { dest: `http://${shopA}` }, { iss: `https://${shopB}/admin` },
      { iss: `https://${shopA}/admin?x=1` }, { dest: `https://${shopA}/` }, { dest: `https://${shopA}:444`, iss: `https://${shopA}:444/admin` },
      { exp: now - 1 }, { nbf: now + 1 }, { iat: now + 1 }, { exp: now + 1000 }];
    for (const claims of badClaims) {
      const response = await f.post('/app/session', {}, jwt(shopA, claims));
      assert.equal(response.status, 401); assert.equal(response.headers.get('X-Shopify-Retry-Invalid-Session-Request'), '1');
    }
    assert.equal((await f.post('/app/session', {}, jwt(shopA, {}, 'wrong-secret'))).status, 401);
    assert.equal((await f.post('/app/session', {}, jwt(shopA, {}, SECRET, 'HS512'))).status, 401);
    assert.equal(f.calls.length, 0);
    f.owner(false); f.staffScopes(['read_products']);
    const result = await (await f.post('/app/session', {})).json() as { is_owner: boolean; permissions: string[] };
    assert.equal(result.is_owner, false); assert.deepEqual(result.permissions, ['read_products']);
    assert.equal(f.store.listByShop(shopA, '').length, 0, 'Online tokens and identities are never retained');
    f.scopes(['read_products']); assert.equal((await f.post('/app/session', {})).status, 403);
    const frame = await fetch(`${f.base}/app?shop=${shopA}`);
    assert.match(frame.headers.get('content-security-policy')!, new RegExp(`frame-ancestors https://admin.shopify.com https://${shopA}`));
    assert.ok(!frame.headers.get('content-security-policy')!.includes('frame-ancestors https://*.myshopify.com'));
  } finally { await f.close(); }
});

test('review binds the exact code, store and owner session; expired input and public legacy install are rejected', async () => {
  const f = await setup();
  try {
    const first = await f.begin(), second = await f.begin();
    const review = await (await f.post('/app/pairing/inspect', { pairing_code: first.code })).json() as { review_token: string };
    for (const [code, bearer] of [[second.code, jwt()], [first.code, jwt(shopB)], [first.code, jwt(shopA, { sub: 'different-user' })]])
      assert.equal((await f.post('/app/pairing/approve', { pairing_code: code, review_token: review.review_token }, bearer)).status, 400);
    assert.equal((await f.post('/app/pairing/approve', { pairing_code: first.code, review_token: 'a'.repeat(43) })).status, 400);
    f.store.remove(`pending:${first.id}`);
    assert.equal((await f.post('/app/pairing/inspect', { pairing_code: first.code })).status, 400);
    assert.equal((await f.post('/oauth/shopify', { request: second.id, shop: shopA })).status, 400);
    assert.equal((await fetch(`${f.base}/oauth/shopify/callback`)).status, 400);
    assert.equal(f.calls.filter(c => c.body.requested_token_type?.endsWith('offline-access-token')).length, 0);
  } finally { await f.close(); }
});

test('webhooks verify raw bytes first, enforce shop/topic, handle duplicates and never retain customer payloads', async () => {
  const f = await setup();
  try {
    assert.equal((await f.webhook(shopA, 'shop/redact', 'bad', 'not-json', 'A'.repeat(43) + '=')).status, 401);
    assert.equal((await f.webhook(shopA, 'shop/redact', 'malformed', 'not-json')).status, 400);
    assert.equal((await f.webhook(shopA, 'orders/create')).status, 400);
    assert.equal((await f.webhook(shopA, 'shop/redact', 'wrong-shop', JSON.stringify({ shop_domain: shopB }))).status, 400);
    const raw = ` { "shop_domain": "${shopA}", "customer": {"id":123,"email":"synthetic-private@example.test"}, "orders_requested":[1] } `;
    for (const topic of ['customers/data_request', 'customers/redact']) {
      assert.equal((await f.webhook(shopA, topic, topic, raw)).status, 200);
      assert.equal((await f.webhook(shopA, topic, topic, raw)).status, 200);
    }
    assert.deepEqual(f.store.listByShop(shopA, ''), []);
    const a = await f.begin(); await f.approve(a); const ta = await f.complete(a);
    const b = await f.begin(); await f.approve(b, shopB); const tb = await f.complete(b);
    assert.equal((await f.webhook(shopA, 'app/uninstalled', 'same-event')).status, 200);
    assert.equal((await f.webhook(shopA, 'app/uninstalled', 'same-event')).status, 200);
    assert.deepEqual(f.store.listByShop(shopA, ''), []);
    assert.equal(await f.auth.connection(ta.tokens.access_token), undefined);
    assert.equal((await f.auth.connection(tb.tokens.access_token))?.shop, shopB);
    assert.equal((await f.post('/token', { client_id: a.clientId, grant_type: 'refresh_token', refresh_token: ta.tokens.refresh_token, resource: `${f.base}/mcp` })).status, 400);
  } finally { await f.close(); }
});

test('uninstall during owner exchange cannot restore installation, pairing, grant or credentials', async () => {
  const f = await setup();
  try {
    const pair = await f.begin();
    const review = await (await f.post('/app/pairing/inspect', { pairing_code: pair.code })).json() as { review_token: string };
    let entered!: () => void, release!: () => void;
    const entering = new Promise<void>(resolve => { entered = resolve; }), waiting = new Promise<void>(resolve => { release = resolve; });
    f.hook(async body => { if (body.requested_token_type?.endsWith('offline-access-token')) { entered(); await waiting; } return undefined; });
    const approving = f.post('/app/pairing/approve', { pairing_code: pair.code, review_token: review.review_token });
    await entering; assert.equal((await f.webhook()).status, 200); release();
    assert.equal((await approving).status, 400);
    assert.deepEqual(f.store.listByShop(shopA, ''), []);
    assert.equal((await f.post('/oauth/public/complete', { request: pair.id }, jwt(), { Cookie: pair.cookie })).status, 400);
  } finally { await f.close(); }
});

test('store-wide refresh is single-flight and a concurrent uninstall wins over refresh', async () => {
  for (const uninstall of [false, true]) {
    const f = await setup();
    try {
      const a = await f.begin(); await f.approve(a); const ta = await f.complete(a);
      const b = await f.begin(); await f.approve(b); const tb = await f.complete(b);
      const key = `installation:${shopA}`, installation = f.store.get<Record<string, unknown>>(key)!;
      f.store.put(key, { ...installation, expiresAt: Date.now() - 1 }, 3600, shopA);
      let refreshes = 0;
      f.hook(async body => { if (body.grant_type === 'refresh_token') { refreshes++; await new Promise(resolve => setTimeout(resolve, 10)); if (uninstall) await f.webhook(); } return undefined; });
      const [first, second] = await Promise.all([f.auth.connection(ta.tokens.access_token), f.auth.connection(tb.tokens.access_token)]);
      assert.equal(refreshes, 1); assert.equal(first?.accessToken, second?.accessToken);
      if (uninstall) { assert.equal(first, undefined); assert.equal(f.store.get(key), undefined); }
      else { assert.equal(first?.shop, shopA); assert.notEqual(first?.accessToken, installation.accessToken); }
    } finally { await f.close(); }
  }
});

test('exchange errors are sanitized and a failed approval can be reviewed and retried', async () => {
  const f = await setup();
  try {
    const pair = await f.begin();
    const review = await (await f.post('/app/pairing/inspect', { pairing_code: pair.code })).json() as { review_token: string };
    f.hook(async body => body.requested_token_type?.endsWith('offline-access-token') ? new Response('synthetic-sensitive-response', { status: 302, headers: { Location: 'https://hostile.example' } }) : undefined);
    const failed = await f.post('/app/pairing/approve', { pairing_code: pair.code, review_token: review.review_token });
    assert.equal(failed.status, 502); assert.deepEqual(await failed.json(), { error: 'shopify_authorization_failed' });
    assert.equal(f.store.get(`installation:${shopA}`), undefined);
    f.hook(undefined); await f.approve(pair); const tokens = await f.complete(pair);
    assert.equal((await f.auth.connection(tokens.tokens.access_token))?.shop, shopA);
  } finally { await f.close(); }
});

test('webhook persistence failure returns retryable failure instead of a false successful receipt', async () => {
  const f = await setup();
  try {
    const remove = f.store.removeByShop.bind(f.store);
    f.store.removeByShop = () => { throw new Error('synthetic-sensitive-store-error'); };
    const response = await f.webhook(shopA, 'app/uninstalled', 'retry-event');
    assert.equal(response.status, 503); assert.deepEqual(await response.json(), { error: 'webhook_processing_failed' });
    f.store.removeByShop = remove;
    assert.equal((await f.webhook(shopA, 'app/uninstalled', 'retry-event')).status, 200);
  } finally { await f.close(); }
});

test('fresh reinstall survives duplicate uninstall and delayed redaction for the prior installation', async () => {
  const f = await setup();
  try {
    const first = await f.begin(); await f.approve(first); await f.complete(first);
    assert.equal((await f.webhook(shopA, 'app/uninstalled', 'prior-uninstall')).status, 200);
    // A new verified Shopify session must be issued after the uninstall barrier.
    await new Promise(resolve => setTimeout(resolve, 1100));
    const second = await f.begin(); await f.approve(second); const current = await f.complete(second);
    assert.equal((await f.webhook(shopA, 'app/uninstalled', 'prior-uninstall')).status, 200);
    assert.equal((await f.webhook(shopA, 'shop/redact', 'prior-redaction')).status, 200);
    assert.equal((await f.auth.connection(current.tokens.access_token))?.shop, shopA);
    assert.equal((await f.webhook(shopA, 'app/uninstalled', 'new-uninstall')).status, 200);
    assert.equal(await f.auth.connection(current.tokens.access_token), undefined);
  } finally { await f.close(); }
});

test('upstream refresh preserves the seven-day retention deadline and expired installation records disappear', async () => {
  const f = await setup();
  const actualNow = Date.now;
  try {
    const pair = await f.begin(); await f.approve(pair); const current = await f.complete(pair);
    const key = `installation:${shopA}`;
    const original = f.store.get<{ authorizationExpiresAt: number; expiresAt: number; refreshExpiresAt: number }>(key)!;
    assert.ok(original.authorizationExpiresAt <= actualNow() + 7 * 86400000);
    assert.ok(original.refreshExpiresAt > original.authorizationExpiresAt, 'Upstream 90-day lifetime does not become our retention period');
    // Trigger upstream renewal while the MCP access credential is still valid.
    Date.now = () => original.expiresAt - 10000;
    assert.equal((await f.auth.connection(current.tokens.access_token))?.shop, shopA);
    assert.equal(f.store.get<{ authorizationExpiresAt: number }>(key)?.authorizationExpiresAt, original.authorizationExpiresAt);
    Date.now = () => original.authorizationExpiresAt + 1;
    assert.equal(f.store.get(key), undefined);
    assert.equal(await f.auth.connection(current.tokens.access_token), undefined);
  } finally { Date.now = actualNow; await f.close(); }
});

test('rejected ID tokens ask App Bridge for a fresh token; upstream configuration failures never request that retry', async () => {
  const f = await setup();
  try {
    for (const [status, code, expected] of [[400, 'invalid_subject_token', 401], [400, 'invalid_requested_token_type', 502], [403, 'invalid_client', 502]] as const) {
      f.hook(async () => json({ error: code, error_description: 'synthetic-private-description' }, status));
      const result = await f.post('/app/session', {});
      assert.equal(result.status, expected);
      assert.equal(result.headers.get('X-Shopify-Retry-Invalid-Session-Request'), expected === 401 ? '1' : null);
      assert.deepEqual(await result.json(), { error: expected === 401 ? 'invalid_session' : 'shopify_authorization_failed' });
    }
    f.hook(undefined);
    assert.equal((await f.post('/app/session', {})).status, 200, 'A fresh ID request can recover without retained online-token state');
  } finally { await f.close(); }
});

test('terminal upstream refresh revocation removes affected credentials and avoids retry loops or store crossover', async () => {
  const f = await setup();
  try {
    const first = await f.begin(); await f.approve(first); const firstTokens = await f.complete(first);
    const other = await f.begin(); await f.approve(other, shopB); const otherTokens = await f.complete(other);
    const key = `installation:${shopA}`, installation = f.store.get<Record<string, unknown>>(key)!;
    f.store.put(key, { ...installation, expiresAt: Date.now() - 1 }, 3600, shopA);
    let refreshes = 0;
    f.hook(async body => { if (body.grant_type === 'refresh_token') { refreshes++; return json({ error: 'invalid_request', error_description: 'synthetic-private-expired-refresh' }, 401); } return undefined; });
    assert.equal(await f.auth.connection(firstTokens.tokens.access_token), undefined);
    assert.equal(await f.auth.connection(firstTokens.tokens.access_token), undefined);
    assert.equal(refreshes, 1); assert.equal(f.store.get(key), undefined); assert.equal(f.store.listByShop(shopA, 'grant:').length, 0);
    assert.equal((await f.auth.connection(otherTokens.tokens.access_token))?.shop, shopB);
    const localRefresh = await f.post('/token', { client_id: first.clientId, grant_type: 'refresh_token', refresh_token: firstTokens.tokens.refresh_token, resource: `${f.base}/mcp` });
    assert.equal(localRefresh.status, 400); assert.equal(localRefresh.headers.get('X-Shopify-Retry-Invalid-Session-Request'), null);
    assert.equal((await f.post('/app/session', {})).status, 200, 'App view can still use a verified online token');
    f.hook(undefined); const newPair = await f.begin(); await f.approve(newPair); const restored = await f.complete(newPair);
    assert.equal((await f.auth.connection(restored.tokens.access_token))?.shop, shopA);
    assert.equal(await f.auth.connection(firstTokens.tokens.access_token), undefined, 'Fresh owner approval never resurrects the old client grant');
  } finally { await f.close(); }
});

test('App Bridge can replay an owner approval once after an offline exchange rejects its expired ID token', async () => {
  const f = await setup();
  try {
    const pair = await f.begin();
    const review = await (await f.post('/app/pairing/inspect', { pairing_code: pair.code })).json() as { review_token: string };
    const body = { pairing_code: pair.code, review_token: review.review_token };
    f.hook(async values => values.requested_token_type?.endsWith('offline-access-token') ? json({ error: 'invalid_subject_token' }, 400) : undefined);
    const rejected = await f.post('/app/pairing/approve', body);
    assert.equal(rejected.status, 401); assert.equal(rejected.headers.get('X-Shopify-Retry-Invalid-Session-Request'), '1');
    f.hook(undefined);
    assert.equal((await f.post('/app/pairing/approve', body)).status, 200, 'The original review remains valid for the documented single request replay');
    const approved = await f.complete(pair);
    assert.equal((await f.auth.connection(approved.tokens.access_token))?.shop, shopA);
    assert.equal((await f.post('/app/pairing/approve', body)).status, 400, 'A successful approval still consumes the review');
  } finally { await f.close(); }
});
