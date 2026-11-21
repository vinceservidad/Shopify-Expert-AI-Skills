import assert from 'node:assert/strict';
import { randomBytes, createHash, createHmac } from 'node:crypto';
import { mkdtemp, rm, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
// Read the shared source contracts independently of the Worker bundle. worker:test also runs without a Node build.
const source = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
  import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
  import { createServer } from './src/mcp.ts';
  import { WORKFLOWS, listWorkflows, prepareWorkflow } from './src/workflows.ts';
  import { listSkills, readSkill } from './src/catalog.ts';
  import { QUERIES } from './src/shopify.ts';
  const server = createServer({skillsRoot:'../skills'}), client = new Client({name:'worker-source-comparison',version:'1.0.0'});
  const [ct, st] = InMemoryTransport.createLinkedPair(); await server.connect(st); await client.connect(ct);
  const tools = (await client.listTools()).tools; await client.close(); await server.close();
  const prepared = await Promise.all(WORKFLOWS.map(workflow => prepareWorkflow(workflow.id, [], (name,resource) => readSkill('../skills',name,resource))));
  console.log(JSON.stringify({tools, workflows:listWorkflows(), prepared, skills:await listSkills('../skills'), queries:QUERIES}));
`], { encoding: 'utf8' }));
const legacyNames = ['list_shopify_skills', 'read_shopify_skill', 'shopify_connection_status', 'shopify_get_shop',
  'shopify_search_products', 'shopify_get_product_variants', 'shopify_get_inventory_levels', 'shopify_list_order_summaries'];
const origin = 'https://shopify-va-toolkit.vinceluxxe.workers.dev';
const persist = await mkdtemp(join(tmpdir(), 'toolkit-workers-'));
const key = randomBytes(32).toString('base64');
let upstreamRedirect = false;
const upstreamCalls = [];
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
    assert.equal(url.pathname, '/admin/api/2026-07/graphql.json'); assert.equal(request.method, 'POST');
    const body = await request.json();
    upstreamCalls.push({ shop: url.hostname, ...body });
    if (body.query === source.queries.productDetails) return Response.json({ data: { product: { id: body.variables.id,
      descriptionHtml: `<p>Product from ${url.hostname}</p>`, seo: { title: `Product from ${url.hostname}`, description: null },
      media: { nodes: [{ id: 'gid://shopify/MediaImage/1', alt: url.hostname, mediaContentType: 'IMAGE', status: 'READY' }], pageInfo: { hasNextPage: true, endCursor: 'media-next' } },
    } } }, { headers: { 'x-shopify-api-version': '2026-07' } });
    if (body.query === source.queries.orderDetails) return Response.json({ data: { order: { id: body.variables.id,
      displayFinancialStatus: 'PAID', displayFulfillmentStatus: 'UNFULFILLED', cancelledAt: null,
      lineItems: { nodes: [{ id: 'gid://shopify/LineItem/1', name: `Product from ${url.hostname}`, quantity: 2, sku: 'TEST-1' }], pageInfo: { hasNextPage: true, endCursor: 'line-next' } },
    } } }, { headers: { 'x-shopify-api-version': '2026-07' } });
    assert.equal(body.query, source.queries.shop);
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
    const tools = (await rpc(grant.tokens.access_token, 'tools/list')).result.tools;
    assert.equal(tools.length, 12); assert.deepEqual(tools, source.tools, 'Worker tools retain Node input contracts');
    for (const name of legacyNames) assert.ok(tools.some(tool => tool.name === name));
    assert.ok(tools.every(tool => tool.annotations?.readOnlyHint === true && tool.annotations?.destructiveHint === false));
    const skills = (await rpc(grant.tokens.access_token, 'tools/call', { name: 'list_shopify_skills', arguments: {} })).result.structuredContent.skills;
    assert.equal(skills.length, 19); assert.deepEqual(skills, source.skills);
    assert.equal((await rpc(grant.tokens.access_token, 'tools/call', { name: 'shopify_get_shop', arguments: {} })).result.structuredContent.shop, shop);
    for (const [name,id,field,page,query] of [
      ['shopify_get_product_details','gid://shopify/Product/1','product','media',source.queries.productDetails],
      ['shopify_get_order_details','gid://shopify/Order/1','order','lineItems',source.queries.orderDetails],
    ]) {
      const arguments_ = {id,first:1,after:'synthetic-cursor'};
      const details = (await rpc(grant.tokens.access_token,'tools/call',{name,arguments:arguments_})).result;
      assert.equal(details.isError,undefined); assert.equal(details.structuredContent.shop,shop);
      assert.equal(details.structuredContent.apiVersion,'2026-07'); assert.equal(details.structuredContent.data[field].id,id);
      assert.equal(details.structuredContent.data[field][page].pageInfo.hasNextPage,true);
      assert.ok(JSON.stringify(details).includes(`Product from ${shop}`)); assert.ok(!JSON.stringify(details).includes(`upstream-${shop}`));
      assert.deepEqual(upstreamCalls.at(-1),{shop,query,variables:arguments_});
    }
  }
  const beforePreparation = upstreamCalls.length;
  const workflows = (await rpc(first.tokens.access_token,'tools/call',{name:'list_shopify_va_workflows',arguments:{}})).result.structuredContent.workflows;
  assert.deepEqual(workflows,source.workflows);
  for (const expected of source.prepared) {
    const prepared = (await rpc(first.tokens.access_token,'tools/call',{name:'prepare_shopify_va_task',arguments:{workflow_id:expected.workflow_id}})).result;
    assert.equal(prepared.isError,undefined); assert.deepEqual(prepared.structuredContent,expected,'Every Worker workflow has complete source guidance');
    const guide = (await rpc(first.tokens.access_token,'tools/call',{name:'read_shopify_skill',arguments:{name:expected.owner_skill,resource:expected.reference}})).result;
    assert.equal(guide.isError,undefined); assert.ok(expected.guidance.includes(guide.structuredContent.text));
  }
  const policy = (await rpc(first.tokens.access_token,'tools/call',{name:'prepare_shopify_va_task',arguments:{workflow_id:'customer_reply',provided_input_keys:['customer_message']}})).result;
  assert.deepEqual(policy.structuredContent.missing_inputs,['approved_policies']); assert.equal(policy.structuredContent.inputs_verified,false);
  for (const arguments_ of [{workflow_id:'unknown'},{workflow_id:'customer_reply',provided_input_keys:['invented_policy']},
    {workflow_id:'customer_reply',client_brief:'Private client content'},{workflow_id:'daily_work_plan',provided_input_keys:Array(31).fill('task_queue')}]) {
    assert.equal((await rpc(first.tokens.access_token,'tools/call',{name:'prepare_shopify_va_task',arguments:arguments_})).result.isError,true);
  }
  assert.equal(upstreamCalls.length,beforePreparation,'Workflow discovery and preparation make no Shopify reads');
  const guide = await rpc(first.tokens.access_token, 'tools/call', { name: 'read_shopify_skill', arguments: { name: 'shopify-va', resource: 'references/connected-store-work.md' } });
  assert.ok(guide.result.structuredContent.text.length > 100);
  assert.equal((await rpc(first.tokens.access_token, 'tools/call', { name: 'read_shopify_skill', arguments: { name: 'shopify-va', resource: '../.env' } })).result.isError, true);
  upstreamRedirect = true;
  assert.equal((await rpc(first.tokens.access_token, 'tools/call', { name: 'shopify_get_shop', arguments: {} })).result.isError, true);
  upstreamRedirect = false;
  await mf.dispose(); mf = new Miniflare(convertV4MiniflareOptions(options));
  assert.equal((await rpc(first.tokens.access_token, 'tools/list')).result.tools.length, 12, 'OAuth grant survives runtime restart');
  const restartedOrder = (await rpc(first.tokens.access_token,'tools/call',{name:'shopify_get_order_details',arguments:{id:'gid://shopify/Order/1'}})).result;
  assert.equal(restartedOrder.structuredContent.shop,'synthetic-a.myshopify.com');
  assert.deepEqual(upstreamCalls.at(-1).variables,{id:'gid://shopify/Order/1',first:20});
  const refresh = { client_id: first.client_id, grant_type: 'refresh_token', refresh_token: first.tokens.refresh_token, resource: origin + '/mcp' };
  const rotated = await post('/token', refresh);
  assert.equal(rotated.status, 200);
  assert.equal((await post('/token', refresh)).status, 400);
  const tokens = await rotated.json();
  const refreshedProduct = (await rpc(tokens.access_token,'tools/call',{name:'shopify_get_product_details',arguments:{id:'gid://shopify/Product/1'}})).result;
  assert.equal(refreshedProduct.structuredContent.shop,'synthetic-a.myshopify.com');
  await post('/revoke', { client_id: first.client_id, token: tokens.access_token });
  assert.equal((await post('/mcp', {}, { Authorization: 'Bearer ' + first.tokens.access_token })).status, 401);
  assert.equal((await post('/mcp', {}, { Authorization: 'Bearer ' + tokens.access_token })).status, 401);
  assert.equal((await rpc(second.tokens.access_token, 'tools/list')).result.tools.length, 12);
  const unaffectedOrder = (await rpc(second.tokens.access_token,'tools/call',{name:'shopify_get_order_details',arguments:{id:'gid://shopify/Order/1'}})).result;
  assert.equal(unaffectedOrder.structuredContent.shop,'synthetic-b.myshopify.com','Revocation cannot change another store grant');
  async function checkFiles(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await checkFiles(path);
      else assert.ok(!(await readFile(path)).includes(Buffer.from('upstream-synthetic')), 'Stored Shopify token must be encrypted');
    }
  }
  await mf.dispose(); mf = undefined;
  await checkFiles(persist);
  console.log('Workers runtime passed: browser origin protection, real OAuth/PKCE/HMAC flow, 19 skills, 8 complete VA workflows, 12 tools, Node contract parity, detail-read store isolation, durable restart, encrypted persistence, single-use codes, refresh rotation and revocation.');
} finally { if (mf) await mf.dispose(); await rm(persist, { recursive: true, force: true }); }
