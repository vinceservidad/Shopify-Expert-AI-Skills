import assert from 'node:assert/strict';
import { randomBytes, createHash, createHmac } from 'node:crypto';
import { mkdtemp, rm, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
const origin = 'https://shopify-va-toolkit.vinceluxxe.workers.dev';
const persist = await mkdtemp(join(tmpdir(), 'toolkit-workers-'));
const key = randomBytes(32).toString('base64');
let upstreamRedirect = false;
const options = {
  upstream: origin, modules: true, scriptPath: 'build/worker/index.js', compatibilityDate: '2026-09-30', compatibilityFlags: ['nodejs_compat'],
  bindings: { PUBLIC_URL: origin, SHOPIFY_CLIENT_ID: 'synthetic-app', SHOPIFY_CLIENT_SECRET: 'synthetic-app-secret', CONNECTOR_STORAGE_KEY: key },
  durableObjects: { OAUTH_ISSUER: { className: 'OAuthIssuer', useSQLite: true } }, resourcePersistencePath: persist,
  ratelimits: { AUTH_RATE_LIMITER: { namespace_id: '7142001', simple: { limit: 30, period: 60 } }, MCP_RATE_LIMITER: { namespace_id: '7142002', simple: { limit: 120, period: 60 } } },
  outboundService: async request => {
    const url = new URL(request.url);
    assert.match(url.hostname, /^synthetic-[ab]\.myshopify\.com$/);
    if (url.pathname === '/admin/oauth/access_token') return Response.json({ access_token: `upstream-${url.hostname}`, scope: 'read_products,read_inventory,read_orders' });
    if (upstreamRedirect) return new Response(null, { status: 302, headers: { Location: 'https://foreign.invalid/credentials' } });
    assert.equal(request.headers.get('x-shopify-access-token'), `upstream-${url.hostname}`);
    return Response.json({ data: { shop: { id: 'gid://shopify/Shop/1', name: url.hostname } } }, { headers: { 'x-shopify-api-version': '2026-07' } });
  },
};
let mf = new Miniflare(convertV4MiniflareOptions(options));
async function send(path, init = {}) { return mf.dispatchFetch(origin + path, { redirect: 'manual', ...init, headers: { host: new URL(origin).host, ...init.headers } }); }
const post = (path, body, headers = {}) => send(path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
async function authorize(shop) {
  const registration = await post('/register', { client_name: 'Workers runtime test', redirect_uris: ['http://localhost:9999/callback'] });
  assert.equal(registration.status, 201, await registration.clone().text());
  const { client_id } = await registration.json();
  const verifier = randomBytes(32).toString('base64url');
  const parameters = new URLSearchParams({ client_id, redirect_uri: 'http://localhost:9999/callback', response_type: 'code', resource: origin + '/mcp', scope: 'shopify:read', state: 'synthetic-state', code_challenge_method: 'S256', code_challenge: createHash('sha256').update(verifier).digest('base64url') });
  const consent = await send('/authorize?' + parameters);
  assert.equal(consent.status, 200, await consent.clone().text());
  assert.equal(consent.headers.get('referrer-policy'), 'same-origin');
  const cookie = consent.headers.get('set-cookie').split(';')[0];
  assert.match(consent.headers.get('set-cookie'), /Secure/i);
  const id = /name="request" value="([^"]+)"/.exec(await consent.text())[1];
  const redirect = await send('/oauth/shopify', { method: 'POST', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ request: id, shop }).toString() });
  assert.equal(redirect.status, 302, await redirect.clone().text());
  const state = new URL(redirect.headers.get('location')).searchParams.get('state');
  const query = new URLSearchParams({ shop, state, code: 'synthetic-shopify-code', timestamp: String(Math.floor(Date.now() / 1000)) });
  query.sort(); query.set('hmac', createHmac('sha256', 'synthetic-app-secret').update(query.toString().replace(/\+/g, '%20')).digest('hex'));
  const callback = await send('/oauth/shopify/callback?' + query, { headers: { Cookie: cookie } });
  assert.equal(callback.status, 302, await callback.clone().text());
  const code = new URL(callback.headers.get('location')).searchParams.get('code');
  const body = { client_id, grant_type: 'authorization_code', code, code_verifier: verifier, redirect_uri: 'http://localhost:9999/callback', resource: origin + '/mcp' };
  const response = await post('/token', body);
  assert.equal(response.status, 200, await response.clone().text());
  assert.equal((await post('/token', body)).status, 400);
  return { client_id, tokens: await response.json() };
}
async function rpc(token, method, params = {}) {
  const response = await post('/mcp', { jsonrpc: '2.0', id: 1, method, params }, { Authorization: 'Bearer ' + token, Accept: 'application/json, text/event-stream' });
  assert.equal(response.status, 200, await response.clone().text());
  return response.json();
}
try {
  assert.equal((await send('/health')).status, 200);
  assert.equal((await send('/health', { headers: { Origin: 'null' } })).status, 403);
  assert.equal((await send('/health', { headers: { Origin: 'https://foreign.invalid' } })).status, 403);
  assert.equal((await (await mf.getWorker()).fetch('https://foreign.invalid/health', { headers: { host: 'foreign.invalid' } })).status, 403);
  assert.equal((await post('/mcp', {})).status, 401);
  assert.equal((await send('/.well-known/oauth-protected-resource/mcp')).status, 200);
  const first = await authorize('synthetic-a.myshopify.com'), second = await authorize('synthetic-b.myshopify.com');
  for (const [grant, shop] of [[first, 'synthetic-a.myshopify.com'], [second, 'synthetic-b.myshopify.com']]) {
    assert.equal((await rpc(grant.tokens.access_token, 'tools/list')).result.tools.length, 8);
    assert.equal((await rpc(grant.tokens.access_token, 'tools/call', { name: 'list_shopify_skills', arguments: {} })).result.structuredContent.skills.length, 19);
    assert.equal((await rpc(grant.tokens.access_token, 'tools/call', { name: 'shopify_get_shop', arguments: {} })).result.structuredContent.shop, shop);
  }
  const guide = await rpc(first.tokens.access_token, 'tools/call', { name: 'read_shopify_skill', arguments: { name: 'shopify-va', resource: 'references/connected-store-work.md' } });
  assert.ok(guide.result.structuredContent.text.length > 100);
  assert.equal((await rpc(first.tokens.access_token, 'tools/call', { name: 'read_shopify_skill', arguments: { name: 'shopify-va', resource: '../.env' } })).result.isError, true);
  upstreamRedirect = true;
  assert.equal((await rpc(first.tokens.access_token, 'tools/call', { name: 'shopify_get_shop', arguments: {} })).result.isError, true);
  upstreamRedirect = false;
  await mf.dispose(); mf = new Miniflare(convertV4MiniflareOptions(options));
  assert.equal((await rpc(first.tokens.access_token, 'tools/list')).result.tools.length, 8, 'OAuth grant survives runtime restart');
  const refresh = { client_id: first.client_id, grant_type: 'refresh_token', refresh_token: first.tokens.refresh_token, resource: origin + '/mcp' };
  const rotated = await post('/token', refresh);
  assert.equal(rotated.status, 200);
  assert.equal((await post('/token', refresh)).status, 400);
  const tokens = await rotated.json();
  await post('/revoke', { client_id: first.client_id, token: tokens.access_token });
  assert.equal((await post('/mcp', {}, { Authorization: 'Bearer ' + first.tokens.access_token })).status, 401);
  assert.equal((await rpc(second.tokens.access_token, 'tools/list')).result.tools.length, 8);
  async function checkFiles(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await checkFiles(path);
      else assert.ok(!(await readFile(path)).includes(Buffer.from('upstream-synthetic')), 'Stored Shopify token must be encrypted');
    }
  }
  await mf.dispose(); mf = undefined;
  await checkFiles(persist);
  console.log('Workers runtime passed: browser origin protection, real OAuth/PKCE/HMAC flow, 19 skills, 8 tools, store isolation, durable restart, encrypted persistence, single-use codes, refresh rotation and revocation.');
} finally { if (mf) await mf.dispose(); await rm(persist, { recursive: true, force: true }); }
