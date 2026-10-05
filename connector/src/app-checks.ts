import type { Express } from 'express';
import { z } from 'zod';
import type { ShopifyOAuth } from './auth.js';
import { PublicAuthError } from './public-auth.js';
import { ConnectorError, queryShopify, type Fetch } from './shopify.js';

const page = { first: z.number().int().min(1).max(50).default(20), after: z.string().max(512).optional() };
const search = { ...page, query: z.string().max(500).optional() };
const id = (kind: string) => z.string().regex(new RegExp(`^gid://shopify/${kind}/[0-9]+$`));
const requestSchema = z.discriminatedUnion('operation', [
  z.object({ operation: z.literal('shop'), variables: z.object({}).strict().default({}) }).strict(),
  z.object({ operation: z.literal('products'), variables: z.object(search).strict().default({ first: 20 }) }).strict(),
  z.object({ operation: z.literal('orders'), variables: z.object(search).strict().default({ first: 20 }) }).strict(),
  z.object({ operation: z.literal('variants'), variables: z.object({ id: id('Product'), ...page }).strict() }).strict(),
  z.object({ operation: z.literal('productDetails'), variables: z.object({ id: id('Product'), ...page }).strict() }).strict(),
  z.object({ operation: z.literal('inventory'), variables: z.object({ id: id('InventoryItem'), ...page }).strict() }).strict(),
  z.object({ operation: z.literal('orderDetails'), variables: z.object({ id: id('Order'), ...page }).strict() }).strict(),
]);

/** Merchant UI reads share the same fixed queries as MCP and use the current staff member's access. */
export function installAppChecks(app: Express, auth: ShopifyOAuth, fetcher?: Fetch): void {
  app.post('/app/checks', async (request, response) => {
    try {
      const session = await auth.appConnection(request);
      const parsed = requestSchema.safeParse(request.body);
      if (!parsed.success) { response.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Choose a listed check and valid record ID or page size.', retryable: false } }); return; }
      response.json(await queryShopify(session.connection, parsed.data.operation, parsed.data.variables, fetcher));
    } catch (error) {
      if (error instanceof PublicAuthError) {
        if (error.code === 'invalid_session') response.set('X-Shopify-Retry-Invalid-Session-Request', '1');
        response.status(error.status).json({ error: { code: error.code, message: error.message, retryable: error.status >= 500 } });
        return;
      }
      if (error instanceof ConnectorError) {
        response.status(error.code === 'MISSING_SCOPE' ? 403 : 502).json({ error: { code: error.code, message: error.message, retryable: error.retryable } });
        return;
      }
      // Unknown exceptions can contain credentials. Return only an actionable generic error.
      response.status(503).json({ error: { code: 'READ_UNAVAILABLE', message: 'This check is temporarily unavailable. Retry from Shopify.', retryable: true } });
    }
  });
}
