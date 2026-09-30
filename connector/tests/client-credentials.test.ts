import { test } from 'node:test';
import assert from 'node:assert/strict';
import { organizationConnection } from '../src/client-credentials.js';
import { ConnectorError, type Fetch } from '../src/shopify.js';

test('organization tokens are scoped, cached, single-flight, and renewed before expiry', async () => {
  let time = 1000, calls = 0;
  const fetcher = (async (url, init) => {
    calls++;
    assert.equal(url,'https://test-fixture.myshopify.com/admin/oauth/access_token');
    assert.equal(init?.redirect,'error');
    const form = init?.body as URLSearchParams;
    assert.equal(form.get('grant_type'),'client_credentials');
    await new Promise(resolve => setTimeout(resolve,5));
    return new Response(JSON.stringify({access_token:`synthetic-${calls}`,scope:'read_products, read_inventory',expires_in:86400}));
  }) as Fetch;
  const provider=organizationConnection('test-fixture.myshopify.com','synthetic-id','synthetic-secret',fetcher,()=>time);
  assert.deepEqual(provider.scopes,[]);
  const [first,second]=await Promise.all([provider.resolve(),provider.resolve()]);
  assert.equal(calls,1); assert.equal(first,second);
  assert.deepEqual(provider.scopes,['read_products','read_inventory']);
  assert.equal((await provider.resolve()).accessToken,'synthetic-1');
  time+=86400000;
  assert.equal((await provider.resolve()).accessToken,'synthetic-2');
  assert.equal(calls,2);
});

test('organization failures do not leak credentials and allow a later retry', async () => {
  let calls=0;
  const provider=organizationConnection('test-fixture.myshopify.com','synthetic-id','synthetic-private-secret', (async () => {
    calls++;
    return new Response('synthetic-private-secret',{status:403});
  }) as Fetch);
  for(let attempt=0;attempt<2;attempt++)await assert.rejects(provider.resolve(),error => {
    assert.ok(error instanceof ConnectorError);
    assert.equal(error.code,'ORGANIZATION_AUTH_FAILED');
    assert.ok(!error.message.includes('synthetic-private-secret')); return true;
  });
  assert.equal(calls,2);
  assert.throws(()=>organizationConnection('localhost','id','secret'),/Invalid/);
});

test('organization token responses require a valid token, lifetime, and scope', async () => {
  for(const body of ['invalid-json',JSON.stringify({access_token:'synthetic',scope:'read_products'}),
    JSON.stringify({access_token:'',scope:'read_products',expires_in:86400})]) {
    const provider=organizationConnection('test-fixture.myshopify.com','id','secret',(async()=>new Response(body)) as Fetch);
    await assert.rejects(provider.resolve(),ConnectorError);
  }
});
