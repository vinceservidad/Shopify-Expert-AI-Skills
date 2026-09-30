import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { DatabaseSync } from 'node:sqlite';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { SecretStore } from '../src/store.js';
import { encryptRecord, MAX_SHOP_RECORDS } from '../src/record-store.js';

const shopA = 'synthetic-a.myshopify.com', shopB = 'synthetic-b.myshopify.com';
const legacyValue = { client: 'synthetic-unowned-client', token: 'synthetic-legacy-secret' };
type Operation = { action: string; key?: string; value?: unknown; ttl?: number; shop?: string; prefix?: string; now?: number; count?: number };
type Fixture = { run: (operation: Operation) => Promise<any>; reopen: () => Promise<void>; dispose: () => Promise<void> };

async function nodeFixture(t: TestContext): Promise<Fixture> {
  const directory = await mkdtemp(join(tmpdir(), 'toolkit-node-public-store-'));
  const filename = join(directory, 'records.sqlite'), encryptionKey = randomBytes(32);
  let now = 1_000_000;
  t.mock.method(Date, 'now', () => now);
  let inspector = new DatabaseSync(filename);
  inspector.exec('CREATE TABLE records (key TEXT PRIMARY KEY, payload TEXT NOT NULL, expires INTEGER NOT NULL)');
  inspector.prepare('INSERT INTO records VALUES (?, ?, ?)').run('client:legacy', encryptRecord('client:legacy', legacyValue, encryptionKey), now + 3600_000);
  let store = new SecretStore(filename, encryptionKey);
  return {
    async run(operation) {
      const { action, key, value, ttl, shop, prefix } = operation;
      switch (action) {
        case 'put': store.put(key!, value, ttl!, shop); return;
        case 'get': return store.get(key!);
        case 'take': return store.take(key!);
        case 'list': return store.listByShop(shop!, prefix!);
        case 'purge': store.removeByShop(shop!); return;
        case 'cleanup': store.cleanup(); return;
        case 'bulk': for (let index = 0; index < operation.count!; index++) store.put(`grant:${index}`, { index }, 3600, shop!); return;
        case 'clock': now = operation.now!; return;
        case 'raw': return inspector.prepare('SELECT * FROM records ORDER BY key').all();
        case 'columns': return inspector.prepare('PRAGMA table_info(records)').all();
        case 'failDelete': inspector.exec("CREATE TRIGGER fail_delete BEFORE DELETE ON records WHEN OLD.key = 'grant:a:2' BEGIN SELECT RAISE(ABORT, 'synthetic purge failure'); END"); return;
        case 'allowDelete': inspector.exec('DROP TRIGGER fail_delete'); return;
        case 'file': return Buffer.from(await readFile(filename)).toString('utf8');
        default: throw new Error('Unknown test operation.');
      }
    },
    async reopen() { store.close(); inspector.close(); store = new SecretStore(filename, encryptionKey); inspector = new DatabaseSync(filename); },
    async dispose() { store.close(); inspector.close(); await rm(directory, { recursive: true, force: true }); },
  };
}

// Exercise the actual Cloudflare SQLite API, including its transaction rollback behavior.
async function workerFixture(): Promise<Fixture> {
  const directory = await mkdtemp(join(tmpdir(), 'toolkit-worker-public-store-'));
  const encryptionKey = Buffer.from(randomBytes(32)).toString('base64');
  const entry = `
    import { DurableObject } from 'cloudflare:workers';
    import { DurableSecretStore } from ${JSON.stringify(resolve('worker/store.ts'))};
    import { encryptRecord } from ${JSON.stringify(resolve('src/record-store.ts'))};
    export class StoreFixture extends DurableObject {
      now = 1000000;
      constructor(ctx, env) {
        super(ctx, env);
        this.encryptionKey = Buffer.from(env.KEY, 'base64');
      }
      async fetch(request) {
        const operation = await request.json();
        Date.now = () => this.now;
        if (!this.ctx.storage.sql.exec('PRAGMA table_info(records)').toArray().length) {
          this.ctx.storage.sql.exec('CREATE TABLE records (key TEXT PRIMARY KEY, payload TEXT NOT NULL, expires INTEGER NOT NULL)');
          this.ctx.storage.sql.exec('INSERT INTO records VALUES (?, ?, ?)', 'client:legacy', encryptRecord('client:legacy', ${JSON.stringify(legacyValue)}, this.encryptionKey), this.now + 3600000);
        }
        const store = new DurableSecretStore(this.ctx.storage, this.encryptionKey);
        const { action, key, value, ttl, shop, prefix } = operation;
        try {
          let result;
          switch (action) {
            case 'put': store.put(key, value, ttl, shop); break;
            case 'get': result = store.get(key); break;
            case 'take': result = store.take(key); break;
            case 'list': result = store.listByShop(shop, prefix); break;
            case 'purge': store.removeByShop(shop); break;
            case 'cleanup': store.cleanup(); break;
            case 'bulk': for (let index = 0; index < operation.count; index++) store.put('grant:' + index, { index }, 3600, shop); break;
            case 'clock': this.now = operation.now; break;
            case 'raw': result = this.ctx.storage.sql.exec('SELECT * FROM records ORDER BY key').toArray(); break;
            case 'columns': result = this.ctx.storage.sql.exec('PRAGMA table_info(records)').toArray(); break;
            case 'failDelete': this.ctx.storage.sql.exec("CREATE TRIGGER fail_delete BEFORE DELETE ON records WHEN OLD.key = 'grant:a:2' BEGIN SELECT RAISE(ABORT, 'synthetic purge failure'); END"); break;
            case 'allowDelete': this.ctx.storage.sql.exec('DROP TRIGGER fail_delete'); break;
            default: throw new Error('Unknown test operation.');
          }
          return Response.json({ result });
        } catch (error) { return Response.json({ error: error.message }, { status: 400 }); }
      }
    }
    export default { fetch: (request, env) => env.STORE.getByName('test').fetch(request) };
  `;
  const compiled = await build({ stdin: { contents: entry, resolveDir: process.cwd(), sourcefile: 'public-store-fixture.ts' },
    bundle: true, format: 'esm', platform: 'node', target: 'es2023', external: ['cloudflare:workers', 'node:crypto'], write: false });
  const options = { modules: true, script: compiled.outputFiles[0]!.text, compatibilityDate: '2026-09-30', compatibilityFlags: ['nodejs_compat'],
    bindings: { KEY: encryptionKey }, durableObjects: { STORE: { className: 'StoreFixture', useSQLite: true } }, resourcePersistencePath: directory };
  let runtime = new Miniflare(convertV4MiniflareOptions(options));
  return {
    async run(operation) {
      const response = await runtime.dispatchFetch('https://storage-test.invalid/', { method: 'POST', body: JSON.stringify(operation) });
      const result = await response.json() as { result?: unknown; error?: string };
      if (result.error) throw new Error(result.error);
      return result.result;
    },
    async reopen() { await runtime.dispose(); runtime = new Miniflare(convertV4MiniflareOptions(options)); },
    async dispose() { await runtime.dispose(); await rm(directory, { recursive: true, force: true }); },
  };
}

for (const [name, factory] of [['Node', nodeFixture], ['Workers', workerFixture]] as const) {
  test(`${name} encrypted store migrates legacy records and isolates atomic store deletion`, async t => {
    const fixture = await factory(t);
    try {
      assert.deepEqual(await fixture.run({ action: 'get', key: 'client:legacy' }), legacyValue);
      assert.ok((await fixture.run({ action: 'columns' })).some((column: { name: string }) => column.name === 'owner_shop'));
      for (const [key, shop] of [['installation:a', shopA], ['grant:a:1', shopA], ['grant:a:2', shopA], ['access:a', shopA],
        ['refresh:a', shopA], ['pending:a', shopA], ['grant:b:1', shopB]] as const) {
        await fixture.run({ action: 'put', key, shop, ttl: 3600, value: { token: `synthetic-secret-${key}` } });
      }
      const raw = await fixture.run({ action: 'raw' });
      assert.ok(raw.every((row: { payload: string }) => !row.payload.includes('synthetic-secret') && !row.payload.includes('synthetic-legacy-secret')));
      assert.equal(raw.find((row: { key: string }) => row.key === 'client:legacy').owner_shop, null);
      assert.deepEqual((await fixture.run({ action: 'list', shop: shopA, prefix: 'grant:' })).map((row: { key: string }) => row.key), ['grant:a:1', 'grant:a:2']);
      await fixture.reopen();
      assert.deepEqual(await fixture.run({ action: 'get', key: 'client:legacy' }), legacyValue);
      assert.equal((await fixture.run({ action: 'list', shop: shopB, prefix: '' })).length, 1);
      await fixture.run({ action: 'failDelete' });
      await assert.rejects(fixture.run({ action: 'purge', shop: shopA }), /synthetic purge failure/);
      assert.equal((await fixture.run({ action: 'list', shop: shopA, prefix: '' })).length, 6, 'Failed deletion preserves every credential atomically');
      await fixture.run({ action: 'allowDelete' });
      await fixture.run({ action: 'purge', shop: shopA });
      assert.deepEqual(await fixture.run({ action: 'list', shop: shopA, prefix: '' }), []);
      assert.ok(await fixture.run({ action: 'get', key: 'grant:b:1' }), 'Another store keeps its grant');
      assert.deepEqual(await fixture.run({ action: 'get', key: 'client:legacy' }), legacyValue, 'Unowned dynamic client registration survives');
      await fixture.run({ action: 'purge', shop: shopA });
      assert.equal((await fixture.run({ action: 'raw' })).length, 2, 'Duplicate purges are harmless');
      if (name === 'Node') assert.ok(!(await fixture.run({ action: 'file' })).includes('synthetic-secret'));
    } finally { await fixture.dispose(); }
  });

  test(`${name} store excludes expired records and treats prefixes and owners literally`, async t => {
    const fixture = await factory(t);
    try {
      await fixture.run({ action: 'put', key: 'grant:live', shop: shopA, ttl: 3600, value: { live: true } });
      await fixture.run({ action: 'put', key: 'grant:expires', shop: shopA, ttl: 1, value: { token: 'synthetic-short-lived' } });
      await fixture.run({ action: 'put', key: 'grant:%literal', shop: shopA, ttl: 3600, value: { literal: true } });
      await fixture.run({ action: 'clock', now: 1_001_000 });
      assert.equal(await fixture.run({ action: 'get', key: 'grant:expires' }), undefined, 'Expiry boundary is closed');
      assert.equal((await fixture.run({ action: 'list', shop: shopA, prefix: 'grant:' })).length, 2);
      assert.equal((await fixture.run({ action: 'raw' })).length, 4, 'Reading excludes expired payloads before physical cleanup');
      assert.deepEqual((await fixture.run({ action: 'list', shop: shopA, prefix: 'grant:%' })).map((row: { key: string }) => row.key), ['grant:%literal']);
      assert.deepEqual(await fixture.run({ action: 'list', shop: shopB, prefix: '' }), []);
      for (const shop of ['Synthetic-A.myshopify.com', 'synthetic-a.myshopify.com/other', '%', "' OR 1=1 --"]) {
        await assert.rejects(fixture.run({ action: 'purge', shop }), /canonical/);
        await assert.rejects(fixture.run({ action: 'put', key: 'rejected', value: {}, ttl: 3600, shop }), /canonical/);
      }
      await fixture.run({ action: 'cleanup' });
      assert.equal((await fixture.run({ action: 'raw' })).length, 3);
      assert.deepEqual(await fixture.run({ action: 'take', key: 'grant:live' }), { live: true });
      assert.equal(await fixture.run({ action: 'get', key: 'grant:live' }), undefined, 'Taken records cannot be replayed');
      await fixture.run({ action: 'put', key: 'grant:owned', shop: shopA, ttl: 3600, value: { owned: true } });
      await fixture.run({ action: 'put', key: 'grant:owned', ttl: 3600, value: { client: true } });
      await fixture.run({ action: 'purge', shop: shopA });
      assert.deepEqual(await fixture.run({ action: 'get', key: 'grant:owned' }), { client: true }, 'Replacing a record cannot retain an obsolete owner');
    } finally { await fixture.dispose(); }
  });
  test(`${name} shop listing fails explicitly instead of silently dropping excessive connections`, async t => {
    const fixture = await factory(t);
    try {
      await fixture.run({ action: 'bulk', shop: shopA, count: MAX_SHOP_RECORDS });
      assert.equal((await fixture.run({ action: 'list', shop: shopA, prefix: 'grant:' })).length, MAX_SHOP_RECORDS);
      await fixture.run({ action: 'put', shop: shopA, key: 'grant:overflow', ttl: 3600, value: {} });
      await assert.rejects(fixture.run({ action: 'list', shop: shopA, prefix: 'grant:' }), /safety limit/);
      await fixture.run({ action: 'purge', shop: shopA });
      assert.deepEqual(await fixture.run({ action: 'list', shop: shopA, prefix: '' }), []);
    } finally { await fixture.dispose(); }
  });
}

test('Node idle cleanup is explicitly started, unrefed, and cancelled by close', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'toolkit-idle-store-'));
  const filename = join(directory, 'records.sqlite');
  let now = 1_000_000;
  t.mock.method(Date, 'now', () => now);
  let scheduled: (() => void) | undefined;
  let handle: ReturnType<typeof setInterval> | undefined;
  const realSetInterval = setInterval;
  const interval = t.mock.method(globalThis, 'setInterval', ((callback: () => void) => {
    scheduled = callback;
    handle = realSetInterval(() => {}, 60_000);
    return handle;
  }) as typeof setInterval);
  const clear = t.mock.method(globalThis, 'clearInterval');
  const store = new SecretStore(filename, randomBytes(32));
  const inspector = new DatabaseSync(filename);
  try {
    store.put('short-lived', { value: true }, 1, shopA);
    store.startCleanup();
    assert.ok(scheduled); assert.equal(handle?.hasRef(), false);
    assert.equal(interval.mock.callCount(), 1);
    now += 1000;
    assert.equal(inspector.prepare('SELECT COUNT(*) AS count FROM records').get()?.count, 1);
    scheduled!();
    assert.equal(inspector.prepare('SELECT COUNT(*) AS count FROM records').get()?.count, 0, 'Idle cleanup physically removes expired ciphertext');
    assert.deepEqual(store.listByShop(shopA, ''), []);
    store.startCleanup();
    assert.equal(interval.mock.callCount(), 1, 'Starting twice does not leak timers');
    store.close();
    assert.ok(clear.mock.calls.some(call => call.arguments[0] === handle));
    assert.throws(() => store.startCleanup(), /closed/);
  } finally { store.close(); inspector.close(); await rm(directory, { recursive: true, force: true }); }
});
