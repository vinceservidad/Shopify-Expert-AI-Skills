import assert from 'node:assert/strict';
import { randomBytes, createHash, createHmac, randomUUID } from 'node:crypto';
import { mkdtemp, rm, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

// Compare the compiled public Worker with source contracts, without relying on a Node build.
const source = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
  import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
  import { createServer } from './src/mcp.ts';
  import { WORKFLOWS, listWorkflows, prepareWorkflow } from './src/workflows.ts';
  import { listSkills, readSkill } from './src/catalog.ts';
  import { QUERIES, API_VERSION, SHOPIFY_SCOPES } from './src/shopify.ts';
  const server = createServer({skillsRoot:'../skills'}), client = new Client({name:'public-worker-source',version:'1.0.0'});
  const [ct, st] = InMemoryTransport.createLinkedPair(); await server.connect(st); await client.connect(ct);
  const tools = (await client.listTools()).tools; await client.close(); await server.close();
  const prepared = await Promise.all(WORKFLOWS.map(workflow => prepareWorkflow(workflow.id, [], (name,resource) => readSkill('../skills',name,resource))));
  console.log(JSON.stringify({tools, workflows:listWorkflows(), prepared, skills:await listSkills('../skills'), queries:QUERIES, apiVersion:API_VERSION, scopes:SHOPIFY_SCOPES}));
`], { encoding: 'utf8' }));
assert.equal(source.apiVersion, '2026-07');
assert.deepEqual(source.scopes, ['read_products', 'read_inventory', 'read_orders']);
assert.equal(Object.keys(source.queries).length, 7);

const origin = 'https://shopify-mcp.synthetic-mktskills.test';
const shopA = 'synthetic-a.myshopify.com', shopB = 'synthetic-b.myshopify.com';
const clientId = 'synthetic-public-app', clientSecret = 'synthetic-public-app-secret';
const installUrl = 'https://admin.shopify.com/oauth/install?client_id=synthetic-public-app&signature=synthetic-install-signature';
const persist = await mkdtemp(join(tmpdir(), 'toolkit-public-worker-'));
const upstreamCalls = [], exchanges = [];
let upstreamRedirect = false, unavailableOrder = false;
let requestSequence = 0;
const nextPage = after => ({ hasNextPage: !after, endCursor: after ? null : 'synthetic-next' });

function sessionToken(shop, sub = '1001', overrides = {}, secret = clientSecret) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ iss: `https://${shop}/admin`, dest: `https://${shop}`, aud: clientId,
    sub, iat: now, nbf: now - 1, exp: now + 60, jti: randomUUID(), sid: randomUUID(), ...overrides })).toString('base64url');
  const content = `${header}.${payload}`;
  return `${content}.${createHmac('sha256', secret).update(content).digest('base64url')}`;
}

function queryData(operation, shop, variables) {
  const number = variables.after ? '2' : '1';
  const title = `Sample ${number} from ${shop}`;
  switch (operation) {
    case 'shop': return { shop: { id: `gid://shopify/Shop/${shop === shopA ? '1' : '2'}`, name: shop, currencyCode: 'USD', ianaTimezone: 'UTC', primaryDomain: { url: `https://${shop}` } } };
    case 'products': return { products: { nodes: [{ id: `gid://shopify/Product/${number}`, title, handle: `sample-${number}`, status: 'ACTIVE', totalInventory: 3 }], pageInfo: nextPage(variables.after) } };
    case 'variants': return { product: { id: variables.id, title: shop, variants: { nodes: [{ id: `gid://shopify/ProductVariant/${number}`, title, sku: `SAMPLE-${number}`, price: '1.00', inventoryItem: { id: `gid://shopify/InventoryItem/${number}` } }], pageInfo: nextPage(variables.after) } } };
    case 'productDetails': return { product: { id: variables.id, descriptionHtml: `<p>${title}</p>`, seo: { title, description: null }, media: { nodes: [{ id: `gid://shopify/MediaImage/${number}`, alt: title, mediaContentType: 'IMAGE', status: 'READY' }], pageInfo: nextPage(variables.after) } } };
    case 'inventory': return { inventoryItem: { id: variables.id, sku: 'SAMPLE-1', tracked: false, inventoryLevels: { nodes: [{ location: { id: `gid://shopify/Location/${number}` }, quantities: [{ name: 'available', quantity: 3 }, { name: 'on_hand', quantity: 5 }, { name: 'committed', quantity: 2 }] }], pageInfo: nextPage(variables.after) } } };
    case 'orders': return { orders: { nodes: [{ id: `gid://shopify/Order/${number}`, name: `#SAMPLE-${number}`, createdAt: '2026-09-30T00:00:00Z', displayFinancialStatus: 'PENDING', totalPriceSet: { shopMoney: { amount: '2.00', currencyCode: 'USD' } } }], pageInfo: nextPage(variables.after) } };
    case 'orderDetails': return { order: unavailableOrder ? null : { id: variables.id, displayFinancialStatus: 'PENDING', displayFulfillmentStatus: 'UNFULFILLED', cancelledAt: null,
      lineItems: { nodes: [{ id: `gid://shopify/LineItem/${number}`, name: title, quantity: 1, sku: `SAMPLE-${number}` }], pageInfo: nextPage(variables.after) } } };
    default: throw new Error('Unexpected fixed query.');
  }
}

const options = {
  upstream: origin, modules: true, scriptPath: 'build/worker/index.js', compatibilityDate: '2026-09-30', compatibilityFlags: ['nodejs_compat'],
  bindings: { PUBLIC_URL: origin, SHOPIFY_CLIENT_ID: clientId, SHOPIFY_CLIENT_SECRET: clientSecret,
    CONNECTOR_STORAGE_KEY: randomBytes(32).toString('base64'), SHOPIFY_AUTH_MODE: 'public',
    SHOPIFY_PUBLIC_INSTALL_URL: installUrl, PUBLIC_LAUNCH_STAGE: 'candidate' },
  durableObjects: { OAUTH_ISSUER: { className: 'OAuthIssuer', useSQLite: true } }, resourcePersistencePath: persist,
  ratelimits: { AUTH_RATE_LIMITER: { namespace_id: '7142001', simple: { limit: 30, period: 60 } }, MCP_RATE_LIMITER: { namespace_id: '7142002', simple: { limit: 120, period: 60 } } },
  outboundService: async request => {
    const url = new URL(request.url);
    assert.ok([shopA, shopB].includes(url.hostname), 'Credentials never leave the selected Shopify host');
    assert.equal(request.method, 'POST');
    const body = await request.json();
    if (url.pathname === '/admin/oauth/access_token') {
      assert.equal(body.client_id, clientId); assert.equal(body.client_secret, clientSecret);
      exchanges.push({ shop: url.hostname, ...body });
      if (body.grant_type === 'urn:ietf:params:oauth:grant-type:token-exchange') {
        assert.equal(body.subject_token_type, 'urn:ietf:params:oauth:token-type:id_token');
        const claims = JSON.parse(Buffer.from(body.subject_token.split('.')[1], 'base64url').toString('utf8'));
        assert.equal(claims.dest, `https://${url.hostname}`);
        if (body.requested_token_type === 'urn:shopify:params:oauth:token-type:online-access-token') {
          return Response.json({ access_token: `synthetic-online-${url.hostname}-${claims.sub}`, scope: source.scopes.join(','), expires_in: 60,
            associated_user_scope: source.scopes.join(','), associated_user: { account_owner: claims.sub === '1001' } });
        }
        assert.equal(body.requested_token_type, 'urn:shopify:params:oauth:token-type:offline-access-token');
        assert.equal(body.expiring, '1', 'Public offline credentials are explicitly expiring');
      } else {
        assert.equal(body.grant_type, 'refresh_token');
        assert.equal(body.refresh_token, `synthetic-refresh-${url.hostname}`);
      }
      return Response.json({ access_token: `synthetic-offline-${url.hostname}`, scope: source.scopes.join(','), expires_in: 3600,
        refresh_token: `synthetic-refresh-${url.hostname}`, refresh_token_expires_in: 86400 });
    }
    assert.equal(url.pathname, `/admin/api/${source.apiVersion}/graphql.json`);
    if (upstreamRedirect) return new Response(null, { status: 302, headers: { Location: 'https://foreign.invalid/credentials' } });
    const credential = request.headers.get('x-shopify-access-token');
    assert.ok(credential === `synthetic-offline-${url.hostname}` || credential === `synthetic-online-${url.hostname}-1001`
      || credential === `synthetic-online-${url.hostname}-2001`, 'Online and offline reads stay bound to their store');
    const operation = Object.keys(source.queries).find(operation => body.query === source.queries[operation]);
    assert.ok(operation, 'Every outgoing query is a fixed read');
    upstreamCalls.push({ shop: url.hostname, credential, operation, ...body });
    return Response.json({ data: queryData(operation, url.hostname, body.variables) }, { headers: { 'x-shopify-api-version': source.apiVersion } });
  },
};

let mf = new Miniflare(convertV4MiniflareOptions(options));
async function send(path, init = {}) {
  // Distinct synthetic visitors keep functional scenarios separate from rate-limit testing.
  const ip = `192.0.2.${(++requestSequence % 250) + 1}`;
  return mf.dispatchFetch(origin + path, { redirect: 'manual', ...init, headers: { host: new URL(origin).host, 'cf-connecting-ip': ip, ...init.headers } });
}
const post = (path, body, headers = {}) => send(path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const appPost = (path, body, shop, sub = '1001') => post(path, body, { Authorization: `Bearer ${sessionToken(shop, sub)}` });
const appGet = (path, shop, sub = '1001') => send(path, { headers: { Authorization: `Bearer ${sessionToken(shop, sub)}` } });
async function okJson(response, status = 200) { assert.equal(response.status, status, await response.clone().text()); return response.json(); }
async function rpc(accessToken, method, params = {}) {
  return okJson(await post('/mcp', { jsonrpc: '2.0', id: 1, method, params }, { Authorization: `Bearer ${accessToken}`, Accept: 'application/json, text/event-stream' }));
}
async function beginPairing(name = 'Synthetic AI client') {
  const redirectUri = 'http://localhost:9999/callback';
  const registration = await okJson(await post('/register', { client_name: name, redirect_uris: [redirectUri] }), 201);
  const verifier = randomBytes(32).toString('base64url');
  const parameters = new URLSearchParams({ client_id: registration.client_id, redirect_uri: redirectUri, response_type: 'code', resource: origin + '/mcp', scope: 'shopify:read', state: 'synthetic-state',
    code_challenge_method: 'S256', code_challenge: createHash('sha256').update(verifier).digest('base64url') });
  const response = await send('/authorize?' + parameters);
  assert.equal(response.status, 200, await response.clone().text());
  assert.match(response.headers.get('set-cookie'), /HttpOnly/); assert.match(response.headers.get('set-cookie'), /Secure/);
  const html = await response.text();
  assert.ok(html.includes(installUrl.replaceAll('&', '&amp;')));
  const cookie = response.headers.get('set-cookie').split(';')[0];
  const request = /name="request" value="([^"]+)"/.exec(html)?.[1];
  const code = /id="pairing-code">([^<]+)</.exec(html)?.[1];
  assert.ok(request); assert.ok(code);
  return { clientId: registration.client_id, redirectUri, verifier, request, code, cookie };
}
async function approvePairing(pair, shop) {
  const review = await okJson(await appPost('/app/pairing/inspect', { pairing_code: pair.code }, shop));
  assert.equal(review.shop, shop); assert.equal(review.return_origin, 'http://localhost:9999');
  assert.deepEqual(review.permissions, source.scopes); assert.ok(review.review_token);
  const body = { pairing_code: pair.code, review_token: review.review_token };
  const approved = await okJson(await appPost('/app/pairing/approve', body, shop));
  assert.equal(approved.approved, true);
  assert.equal((await appPost('/app/pairing/approve', body, shop)).status, 400, 'Approval review is single use');
  return review;
}
async function completePairing(pair) {
  assert.equal((await send('/oauth/public/status?request=' + pair.request)).status, 401, 'Polling requires the originating browser');
  const state = await okJson(await send('/oauth/public/status?request=' + pair.request, { headers: { Cookie: pair.cookie } }));
  assert.equal(state.status, 'approved');
  assert.equal((await post('/oauth/public/complete', { request: pair.request }, { Cookie: pair.cookie })).status, 403, 'Completion requires same-origin form submission');
  const response = await send('/oauth/public/complete', { method: 'POST', headers: { Cookie: pair.cookie, Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ request: pair.request }).toString() });
  assert.equal(response.status, 302, await response.clone().text());
  const callback = new URL(response.headers.get('location'));
  assert.equal(callback.origin, 'http://localhost:9999'); assert.equal(callback.searchParams.get('state'), 'synthetic-state');
  const body = { client_id: pair.clientId, grant_type: 'authorization_code', code: callback.searchParams.get('code'), code_verifier: pair.verifier,
    redirect_uri: pair.redirectUri, resource: origin + '/mcp' };
  const tokens = await okJson(await post('/token', body));
  assert.equal(tokens.expires_in, 3600); assert.equal(tokens.scope, 'shopify:read');
  assert.equal((await post('/token', body)).status, 400, 'Authorization code cannot be replayed');
  return { ...pair, tokens };
}
async function authorize(shop, name) { const pair = await beginPairing(name); await approvePairing(pair, shop); return completePairing(pair); }
async function webhook(shop, topic, eventId, body, signatureBody = body) {
  return send('/webhooks/shopify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-shopify-shop-domain': shop,
    'x-shopify-topic': topic, 'x-shopify-event-id': eventId, 'x-shopify-hmac-sha256': createHmac('sha256', clientSecret).update(signatureBody).digest('base64') }, body });
}

try {
  assert.equal((await send('/health')).status, 200);
  assert.equal((await send('/health', { headers: { Origin: 'null' } })).status, 403);
  assert.equal((await send('/health', { headers: { Origin: 'https://foreign.invalid' } })).status, 403);
  // dispatchFetch normalizes Host; the direct worker binding preserves the forged header.
  assert.equal((await (await mf.getWorker()).fetch(origin + '/health', { headers: { host: 'foreign.invalid' } })).status, 403);
  assert.equal((await (await mf.getWorker()).fetch('https://foreign.invalid/health', { headers: { host: 'foreign.invalid' } })).status, 403);
  assert.equal((await post('/mcp', {})).status, 401);
  const metadata = await okJson(await send('/.well-known/oauth-protected-resource/mcp'));
  assert.equal(metadata.resource, origin + '/mcp');

  for (const path of ['/shopify-va', '/help', '/privacy']) {
    const response = await send(path);
    assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text(); assert.ok(html.includes('MKT Skills')); assert.ok(!html.includes('synthetic-offline'));
  }
  const appPage = await send('/app?shop=' + shopA);
  assert.equal(appPage.status, 200);
  const appHtml = await appPage.text();
  assert.ok(appHtml.includes('shopify-api-key')); assert.ok(appHtml.includes('app-bridge.js')); assert.ok(appHtml.includes('polaris-'));
  assert.match(appPage.headers.get('content-security-policy'), new RegExp(`frame-ancestors https://admin\\.shopify\\.com https://${shopA.replaceAll('.', '\\.')}($|;)`));
  assert.ok(!appHtml.includes('synthetic-offline') && !appHtml.includes('synthetic-refresh'), 'Public app shell contains no credentials');
  for (const path of ['/assets/public.css', '/assets/theme.js', '/assets/favicon.svg', '/assets/app-home.js']) assert.equal((await send(path)).status, 200, `${path} is reachable`);
  const foreignPage = await send('/app?shop=foreign.invalid');
  assert.ok(!foreignPage.headers.get('content-security-policy').includes('foreign.invalid'));

  const beforeForged = exchanges.length;
  for (const token of [sessionToken(shopA, '1001', {}, 'forged-secret'), sessionToken(shopA, '1001', { aud: 'wrong-client' }),
    sessionToken(shopA, '1001', { exp: Math.floor(Date.now() / 1000) - 1 }), sessionToken(shopA, '1001', { iss: 'https://foreign.invalid/admin' })]) {
    assert.equal((await post('/app/session', {}, { Authorization: `Bearer ${token}` })).status, 401);
  }
  assert.equal(exchanges.length, beforeForged, 'Invalid sessions never reach Shopify');
  assert.equal((await post('/app/checks', { operation: 'shop' })).status, 401);
  assert.equal((await appPost('/app/pairing/inspect', { pairing_code: 'A'.repeat(32) }, shopA, '2001')).status, 403, 'Staff cannot approve owner connections');
  assert.equal((await appPost('/app/pairing/approve', { pairing_code: 'A'.repeat(32), review_token: 'A'.repeat(43) }, shopA, '2001')).status, 403);
  const owner = await okJson(await appPost('/app/session', {}, shopA));
  assert.equal(owner.is_owner, true); assert.equal(owner.shop, shopA); assert.equal(owner.connected, false);

  const first = await authorize(shopA, 'Synthetic first AI'), second = await authorize(shopB, 'Synthetic second AI');
  for (const [grant, shop] of [[first, shopA], [second, shopB]]) {
    const tools = (await rpc(grant.tokens.access_token, 'tools/list')).result.tools;
    assert.equal(tools.length, 12); assert.deepEqual(tools, source.tools);
    assert.ok(tools.every(tool => tool.annotations.readOnlyHint && tool.annotations.destructiveHint === false));
    const skills = (await rpc(grant.tokens.access_token, 'tools/call', { name: 'list_shopify_skills', arguments: {} })).result.structuredContent.skills;
    assert.equal(skills.length, 19); assert.deepEqual(skills, source.skills);
    const status = (await rpc(grant.tokens.access_token, 'tools/call', { name: 'shopify_connection_status', arguments: {} })).result.structuredContent;
    assert.equal(status.shop, shop); assert.equal(status.mode, 'read-only'); assert.deepEqual(status.scopes, source.scopes);
  }
  const beforePreparation = upstreamCalls.length;
  const workflows = (await rpc(first.tokens.access_token, 'tools/call', { name: 'list_shopify_va_workflows', arguments: {} })).result.structuredContent.workflows;
  assert.equal(workflows.length, 8); assert.deepEqual(workflows, source.workflows);
  for (const expected of source.prepared) {
    const actual = (await rpc(first.tokens.access_token, 'tools/call', { name: 'prepare_shopify_va_task', arguments: { workflow_id: expected.workflow_id } })).result;
    assert.equal(actual.isError, undefined); assert.deepEqual(actual.structuredContent, expected);
    const guide = (await rpc(first.tokens.access_token, 'tools/call', { name: 'read_shopify_skill', arguments: { name: expected.owner_skill, resource: expected.reference } })).result;
    assert.equal(guide.isError, undefined); assert.ok(expected.guidance.includes(guide.structuredContent.text));
  }
  assert.equal(upstreamCalls.length, beforePreparation, 'Workflow preparation stores no client files and makes no store calls');

  const reads = [
    ['shop', 'shopify_get_shop', {}], ['products', 'shopify_search_products', { first: 1, query: 'title:"Sample"' }],
    ['variants', 'shopify_get_product_variants', { id: 'gid://shopify/Product/1', first: 1 }],
    ['productDetails', 'shopify_get_product_details', { id: 'gid://shopify/Product/1', first: 1 }],
    ['inventory', 'shopify_get_inventory_levels', { id: 'gid://shopify/InventoryItem/1', first: 1 }],
    ['orders', 'shopify_list_order_summaries', { first: 1 }],
    ['orderDetails', 'shopify_get_order_details', { id: 'gid://shopify/Order/1', first: 1 }],
  ];
  for (const [operation, name, variables] of reads) {
    const result = (await rpc(first.tokens.access_token, 'tools/call', { name, arguments: variables })).result;
    assert.equal(result.isError, undefined);
    const evidence = result.structuredContent;
    assert.equal(evidence.shop, shopA); assert.equal(evidence.apiVersion, source.apiVersion); assert.equal(evidence.source, 'shopify-admin-graphql');
    assert.ok(evidence.observedAt); assert.deepEqual(evidence.data, queryData(operation, shopA, variables));
    assert.deepEqual(upstreamCalls.at(-1), { shop: shopA, credential: `synthetic-offline-${shopA}`, operation, query: source.queries[operation], variables });
    assert.ok(!JSON.stringify(evidence).includes('synthetic-offline'));
  }
  for (const [name, id, field, page] of [['shopify_get_product_details', 'gid://shopify/Product/1', 'product', 'media'], ['shopify_get_order_details', 'gid://shopify/Order/1', 'order', 'lineItems']]) {
    const before = (await rpc(first.tokens.access_token, 'tools/call', { name, arguments: { id, first: 1 } })).result.structuredContent.data[field][page];
    const after = (await rpc(first.tokens.access_token, 'tools/call', { name, arguments: { id, first: 1, after: before.pageInfo.endCursor } })).result.structuredContent.data[field][page];
    assert.equal(before.pageInfo.hasNextPage, true); assert.equal(after.pageInfo.hasNextPage, false); assert.notEqual(before.nodes[0].id, after.nodes[0].id);
  }
  assert.ok(!/customer|email|address|paymentDetails|trackingInfo/.test(source.queries.orderDetails));
  unavailableOrder = true;
  assert.equal((await rpc(first.tokens.access_token, 'tools/call', { name: 'shopify_get_order_details', arguments: { id: 'gid://shopify/Order/404' } })).result.isError, true);
  unavailableOrder = false;

  // The embedded screen's seven fixed reads use a fresh online staff exchange, never the owner's offline token.
  const beforeAppReads = exchanges.length;
  for (const [operation, _name, variables] of reads) {
    const evidence = await okJson(await appPost('/app/checks', { operation, variables }, shopB, '2001'));
    assert.equal(evidence.shop, shopB); assert.equal(evidence.source, 'shopify-admin-graphql'); assert.equal(evidence.apiVersion, source.apiVersion);
    assert.deepEqual(evidence.data, queryData(operation, shopB, variables));
    assert.equal(upstreamCalls.at(-1).credential, `synthetic-online-${shopB}-2001`); assert.deepEqual(upstreamCalls.at(-1).variables, variables);
  }
  assert.equal(exchanges.length - beforeAppReads, reads.length, 'Every screen read revalidates the staff session');
  const beforeInvalid = upstreamCalls.length;
  for (const body of [{ operation: 'products', variables: { first: 51 } }, { operation: 'orderDetails', variables: { id: 'invalid' } },
    { operation: 'mutation', variables: {} }, { operation: 'shop', variables: {}, query: 'arbitrary query' }]) assert.equal((await appPost('/app/checks', body, shopB)).status, 400);
  assert.equal(upstreamCalls.length, beforeInvalid, 'Invalid screen inputs cannot reach Shopify');
  upstreamRedirect = true;
  assert.equal((await rpc(second.tokens.access_token, 'tools/call', { name: 'shopify_get_shop', arguments: {} })).result.isError, true);
  assert.equal((await appPost('/app/checks', { operation: 'shop' }, shopB)).status, 502);
  upstreamRedirect = false;

  await mf.dispose(); mf = new Miniflare(convertV4MiniflareOptions(options));
  assert.equal((await rpc(first.tokens.access_token, 'tools/list')).result.tools.length, 12, 'Public grants survive runtime restart');
  const refreshed = await okJson(await post('/token', { client_id: first.clientId, grant_type: 'refresh_token', refresh_token: first.tokens.refresh_token, resource: origin + '/mcp' }));
  assert.equal((await post('/token', { client_id: first.clientId, grant_type: 'refresh_token', refresh_token: first.tokens.refresh_token, resource: origin + '/mcp' })).status, 400);
  first.tokens = refreshed;

  const connectionsA = await okJson(await appGet('/app/connections', shopA));
  assert.equal(connectionsA.connections.length, 1); assert.equal(connectionsA.connections[0].client_name, 'Synthetic first AI');
  assert.ok(!JSON.stringify(connectionsA).includes('synthetic-offline'));
  assert.equal((await appPost('/app/disconnect', { connection_id: connectionsA.connections[0].id }, shopB)).status, 404, 'A second owner cannot disconnect another shop');
  assert.equal((await appPost('/app/disconnect', { connection_id: connectionsA.connections[0].id }, shopA, '2001')).status, 403);
  await okJson(await appPost('/app/disconnect', { connection_id: connectionsA.connections[0].id }, shopA));
  assert.equal((await post('/mcp', {}, { Authorization: `Bearer ${first.tokens.access_token}` })).status, 401);
  assert.equal((await rpc(second.tokens.access_token, 'tools/list')).result.tools.length, 12);
  const beforeReconnect = exchanges.filter(exchange => exchange.requested_token_type === 'urn:shopify:params:oauth:token-type:offline-access-token').length;
  const reconnected = await authorize(shopA, 'Synthetic reconnect');
  assert.equal(exchanges.filter(exchange => exchange.requested_token_type === 'urn:shopify:params:oauth:token-type:offline-access-token').length, beforeReconnect, 'Clients share one encrypted installation credential');

  const uninstalled = '{\n  "myshopify_domain": "' + shopA + '",\n  "synthetic_marker": "no customer identity is retained"\n}\n';
  const canonical = JSON.stringify(JSON.parse(uninstalled));
  assert.equal((await webhook(shopA, 'app/uninstalled', 'wrong-bytes', uninstalled, canonical)).status, 401, 'HMAC authenticates raw bytes, not parsed JSON');
  assert.equal((await rpc(reconnected.tokens.access_token, 'tools/list')).result.tools.length, 12, 'Rejected webhooks preserve access');
  await okJson(await webhook(shopA, 'app/uninstalled', 'uninstall-a', uninstalled));
  await okJson(await webhook(shopA, 'app/uninstalled', 'uninstall-a', uninstalled));
  assert.equal((await post('/mcp', {}, { Authorization: `Bearer ${reconnected.tokens.access_token}` })).status, 401, 'Signed uninstall removes every shop grant');
  assert.equal((await post('/token', { client_id: reconnected.clientId, grant_type: 'refresh_token', refresh_token: reconnected.tokens.refresh_token, resource: origin + '/mcp' })).status, 400);
  assert.equal((await rpc(second.tokens.access_token, 'tools/list')).result.tools.length, 12, 'Uninstall preserves the other shop');

  // Reinstall must use a fresh Shopify session, issued after the uninstall barrier.
  await delay(1100);
  const reinstalled = await authorize(shopA, 'Synthetic reinstall');
  assert.equal((await rpc(reinstalled.tokens.access_token, 'tools/list')).result.tools.length, 12);
  await okJson(await webhook(shopA, 'app/uninstalled', 'uninstall-a', uninstalled));
  assert.equal((await rpc(reinstalled.tokens.access_token, 'tools/list')).result.tools.length, 12, 'Duplicate old delivery cannot revoke a new verified installation');
  const redact = '{\n "shop_domain": "' + shopA + '", "shop_id": 1\n}\n';
  await okJson(await webhook(shopA, 'shop/redact', 'redact-after-reinstall', redact));
  assert.equal((await rpc(reinstalled.tokens.access_token, 'tools/list')).result.tools.length, 12, 'Delayed privacy delivery preserves a verified reinstall');
  const customer = JSON.stringify({ shop_domain: shopB, shop_id: 2, customer: { id: 1, email: 'synthetic-private-customer@example.test' }, orders_requested: [] });
  await okJson(await webhook(shopB, 'customers/data_request', 'request-b', customer));
  await okJson(await webhook(shopB, 'customers/redact', 'redact-b', customer));
  assert.equal((await rpc(second.tokens.access_token, 'tools/list')).result.tools.length, 12);

  async function inspectPersistence(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await inspectPersistence(path);
      else {
        const bytes = await readFile(path);
        for (const secret of ['synthetic-online-', 'synthetic-offline-', 'synthetic-refresh-', 'synthetic-private-customer@example.test', 'no customer identity is retained']) {
          assert.ok(!bytes.includes(Buffer.from(secret)), 'Credential and webhook contents never persist in plaintext');
        }
      }
    }
  }
  await mf.dispose(); mf = undefined;
  await inspectPersistence(persist);
  console.log('Public Workers runtime passed: managed public pairing, SDK session identity, owner approval, strict browser/origin protections, 19 skills, 8 workflows, 12 tools, all 7 fixed reads, online staff checks, pagination, restart, client reconnect/disconnect, raw-byte HMAC webhooks, encrypted persistence, two-store uninstall isolation and verified reinstall. Synthetic runtime verification only; native AI clients and real Shopify deliveries remain separate live checks.');
} finally { if (mf) await mf.dispose(); await rm(persist, { recursive: true, force: true }); }
