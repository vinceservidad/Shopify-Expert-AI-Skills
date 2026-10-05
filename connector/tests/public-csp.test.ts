import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PUBLIC_PAGE_CSP } from '../src/public-routes.js';

const directives = Object.fromEntries(PUBLIC_PAGE_CSP.split(';').map(part => part.trim().split(/\s+/)).map(([name, ...values]) => [name, values]));

test('public pages allow only the Cloudflare Web Analytics beacon beyond their own origin', () => {
  assert.deepEqual(directives['default-src'], ["'none'"]);
  assert.deepEqual(directives['script-src'], ["'self'", 'https://static.cloudflareinsights.com/beacon.min.js', 'https://static.cloudflareinsights.com/beacon.min.js/']);
  // The injected beacon reports to /cdn-cgi/rum on the same origin, so no third-party connection is allowed.
  assert.deepEqual(directives['connect-src'], ["'self'"]);
  assert.deepEqual(directives['style-src'], ["'self'"]);
  assert.deepEqual(directives['frame-ancestors'], ["'none'"]);
  assert.ok(!PUBLIC_PAGE_CSP.includes("'unsafe-inline'") && !PUBLIC_PAGE_CSP.includes("'unsafe-eval'"));
});
