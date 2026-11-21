import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { APP_HOME_SCRIPT } from '../src/public-ui/app-home.js';

type Handler = (event: { preventDefault(): void }) => unknown;
class Element {
  textContent = '';
  value = '';
  hidden = false;
  disabled = false;
  className = '';
  children: Element[] = [];
  attributes = new Set<string>();
  handlers = new Map<string, Handler[]>();
  classList = { toggle() {} };
  constructor(readonly tagName: string) {}
  setAttribute(name: string) { this.attributes.add(name); }
  removeAttribute(name: string) { this.attributes.delete(name); }
  append(node: Element) { this.children.push(node); }
  replaceChildren() { this.children = []; }
  focus() {}
  addEventListener(event: string, handler: Handler) { this.handlers.set(event, [...this.handlers.get(event) ?? [], handler]); }
  dispatch(event = 'click') { for (const handler of this.handlers.get(event) ?? []) void handler({ preventDefault() {} }); }
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}
const settled = () => new Promise<void>(resolve => setImmediate(resolve));
const response = (data: unknown) => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });

function fixture() {
  const elements = new Map<string, Element>();
  const element = (id: string) => {
    if (!elements.has(id)) elements.set(id, new Element(id));
    return elements.get(id)!;
  };
  const calls: Array<{ path: string; body?: Record<string, unknown> }> = [];
  let sessionShop = 'first.myshopify.com';
  let inspect: ((body: Record<string, unknown>) => Promise<Response>) | undefined;
  let approval: (() => Promise<Response>) | undefined;
  let check: (() => Promise<Response>) | undefined;
  const fetcher = async (path: string, options: { body?: string }) => {
    const body = options.body ? JSON.parse(options.body) as Record<string, unknown> : undefined;
    calls.push({ path, body });
    if (path === '/app/session') return response({ shop: sessionShop, is_owner: true, permissions: ['read_products'], connections: 0 });
    if (path === '/app/connections') return response({ shop: sessionShop, is_owner: true, connections: [] });
    if (path === '/app/pairing/inspect' && inspect) return inspect(body!);
    if (path === '/app/pairing/approve' && approval) return approval();
    if (path === '/app/checks' && check) return check();
    throw new Error('Unexpected UI request: ' + path);
  };
  runInNewContext(APP_HOME_SCRIPT, {
    document: { getElementById: element, createElement: (tag: string) => new Element(tag),
      querySelectorAll: () => [element('read-shop'), element('read-products'), element('read-orders'), element('next-page')] },
    window: { shopify: { idToken: async () => 'synthetic-token' } }, fetch: fetcher, AbortSignal,
  });
  return { element, calls, setShop: (shop: string) => { sessionShop = shop; },
    onInspect: (callback: typeof inspect) => { inspect = callback; }, onApproval: (callback: typeof approval) => { approval = callback; },
    onCheck: (callback: typeof check) => { check = callback; } };
}
const review = (code: string, shop = 'first.myshopify.com') => ({ shop, client_name: code, return_origin: 'https://client.example',
  permissions: ['read_products'], expires_at: Date.now() + 600000, review_token: 'synthetic-review-' + code });

test('a slow old-code inspection cannot restore approval after the input changes', async () => {
  const f = fixture(); await settled();
  const first = deferred<Response>(), second = deferred<Response>();
  f.onInspect(body => body.pairing_code === 'first' ? first.promise : second.promise);
  f.element('pairing-code').value = 'first'; f.element('pairing-code').dispatch('input');
  f.element('inspect-pairing').dispatch(); await settled();
  f.element('pairing-code').value = 'second'; f.element('pairing-code').dispatch('input');
  f.element('inspect-pairing').dispatch(); await settled();
  second.resolve(response(review('second'))); await settled();
  assert.equal(f.element('pairing-review').hidden, false);
  first.resolve(response(review('first'))); await settled();
  const displayed = f.element('pairing-facts').children.map(node => node.textContent);
  assert(displayed.includes('second')); assert(!displayed.includes('first'));
  f.onApproval(async () => response({ approved: true, shop: 'first.myshopify.com' }));
  f.element('approve-pairing').dispatch(); await settled();
  assert.deepEqual(f.calls.find(call => call.path === '/app/pairing/approve')?.body, {
    pairing_code: 'second', review_token: 'synthetic-review-second',
  });
});

test('a session transition discards an earlier inspection and permits a new review', async () => {
  const f = fixture(); await settled();
  const old = deferred<Response>(); f.onInspect(() => old.promise);
  f.element('pairing-code').value = 'old'; f.element('inspect-pairing').dispatch(); await settled();
  f.setShop('second.myshopify.com'); f.element('retry-session').dispatch(); await settled();
  old.resolve(response(review('old'))); await settled();
  assert.equal(f.element('pairing-review').hidden, true);
  assert(f.element('approve-pairing').attributes.has('disabled'));
  assert(f.element('session-status').textContent.includes('second.myshopify.com'));
  f.onInspect(async () => response(review('new', 'second.myshopify.com')));
  f.element('pairing-code').value = 'new'; f.element('inspect-pairing').dispatch(); await settled();
  assert.equal(f.element('pairing-review').hidden, false);
  assert(f.element('pairing-facts').children.some(node => node.textContent === 'second.myshopify.com'));
});

test('an approval awaiting its response freezes inputs and cannot clear a newer session', async () => {
  const f = fixture(); await settled();
  f.onInspect(async () => response(review('old')));
  f.element('pairing-code').value = 'old'; f.element('inspect-pairing').dispatch(); await settled();
  const oldApproval = deferred<Response>(); f.onApproval(() => oldApproval.promise);
  f.element('approve-pairing').dispatch(); await settled();
  assert.equal(f.element('pairing-code').disabled, true);
  f.setShop('second.myshopify.com'); f.element('retry-session').dispatch(); await settled();
  f.element('pairing-code').value = 'new';
  oldApproval.resolve(response({ approved: true, shop: 'first.myshopify.com' })); await settled();
  assert.equal(f.element('pairing-code').value, 'new');
  assert(f.element('session-status').textContent.includes('second.myshopify.com'));
  assert.equal(f.element('pairing-code').disabled, false);
  assert(!f.element('pairing-status').textContent.includes('Approved for first'));
});

test('an old store read does not appear after the Shopify session is refreshed', async () => {
  const f = fixture(); await settled();
  const oldRead = deferred<Response>(); f.onCheck(() => oldRead.promise);
  f.element('read-shop').dispatch(); await settled();
  f.setShop('second.myshopify.com'); f.element('retry-session').dispatch(); await settled();
  oldRead.resolve(response({ shop: 'first.myshopify.com', observedAt: new Date().toISOString(), data: { shop: { name: 'First store' } } }));
  await settled();
  assert.equal(f.element('evidence-result').children.length, 0);
  assert(!f.element('read-shop').attributes.has('disabled'));
  assert(f.element('session-status').textContent.includes('second.myshopify.com'));
});
