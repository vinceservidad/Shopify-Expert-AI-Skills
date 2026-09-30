import { z } from 'zod';
import { type Connection, type Fetch, ConnectorError, shopDomain } from './shopify.js';

export type ConnectionProvider = { shop: string; scopes: string[]; resolve(): Promise<Connection> };

/** Shopify supports this grant only for installed apps and stores in the same organization. */
export function organizationConnection(shop: string, clientId: string, clientSecret: string,
  fetcher: Fetch = fetch, now: () => number = Date.now): ConnectionProvider {
  shopDomain.parse(shop);
  let cached: Connection | undefined, expiresAt = 0, pending: Promise<Connection> | undefined;
  const provider: ConnectionProvider = { shop, scopes: [], resolve: async () => {
    if (cached && now() < expiresAt - 60000) return cached;
    if (pending) return pending;
    pending = (async () => {
      let response: Response;
      try {
        response = await fetcher(`https://${shop}/admin/oauth/access_token`, {
          method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
        });
      } catch { throw new ConnectorError('TOKEN_UNAVAILABLE', 'Shopify token service could not be reached. Retry later.', true); }
      if (!response.ok) {
        throw new ConnectorError('ORGANIZATION_AUTH_FAILED',
          'Check app installation, credentials, and that the app and store belong to the same Shopify organization.', response.status === 429 || response.status >= 500);
      }
      const parsed = z.object({ access_token: z.string().min(1), scope: z.string(), expires_in: z.number().positive() })
        .safeParse(await response.json().catch(() => null));
      if (!parsed.success) throw new ConnectorError('INVALID_TOKEN_RESPONSE', 'Shopify returned an invalid token response. No store read was verified.');
      cached = { shop, accessToken: parsed.data.access_token, scopes: parsed.data.scope.split(',').map(value => value.trim()).filter(Boolean) };
      provider.scopes = cached.scopes;
      expiresAt = now() + parsed.data.expires_in * 1000;
      return cached;
    })().finally(() => { pending = undefined; });
    return pending;
  } };
  return provider;
}
