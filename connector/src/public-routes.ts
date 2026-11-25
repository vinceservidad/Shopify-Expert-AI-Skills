import { APP_HOME_SCRIPT, HERO_SCRIPT, PUBLIC_STYLES, THEME_SCRIPT, renderHelpPage, renderLlmsTxt, renderPrivacyPage, renderProductPage, type PublicPageConfig } from './public-pages.js';
import { ogImageBytes } from './public-ui/og-image.js';

// Cloudflare Web Analytics (owner-approved 2026-10-01): the zone injects its beacon into these pages, served
// from a versioned path under beacon.min.js/, and it reports to /cdn-cgi/rum on this origin. Nothing else is added.
export const WEB_ANALYTICS_BEACON = 'https://static.cloudflareinsights.com/beacon.min.js';
export const PUBLIC_PAGE_CSP = `default-src 'none'; style-src 'self'; script-src 'self' ${WEB_ANALYTICS_BEACON} ${WEB_ANALYTICS_BEACON}/; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`;
export const SECURITY_HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': PUBLIC_PAGE_CSP };

export type PublicRouteResponse = {
  body: string | Uint8Array<ArrayBuffer>;
  contentType: string;
  cacheControl?: string;
};

/** These public pages contain guides and release state, never merchant credentials or store results. */
export function publicContent(path: string, config: PublicPageConfig): PublicRouteResponse | undefined {
  if (['/assets/public.css', '/shopify-va/assets/public.css'].includes(path)) return { body: PUBLIC_STYLES, contentType: 'text/css; charset=utf-8' };
  if (['/assets/theme.js', '/shopify-va/assets/theme.js'].includes(path)) return { body: THEME_SCRIPT, contentType: 'text/javascript; charset=utf-8' };
  if (['/assets/hero.js', '/shopify-va/assets/hero.js'].includes(path)) return { body: HERO_SCRIPT, contentType: 'text/javascript; charset=utf-8' };
  if (path === '/assets/app-home.js') return { body: APP_HOME_SCRIPT, contentType: 'text/javascript; charset=utf-8' };
  if (['/og-shopify-va.png', '/shopify-va/og-shopify-va.png'].includes(path)) {
    return { body: ogImageBytes(), contentType: 'image/png', cacheControl: 'public, max-age=86400' };
  }
  if (['/llms.txt', '/shopify-va/llms.txt'].includes(path)) {
    return { body: renderLlmsTxt(config), contentType: 'text/markdown; charset=utf-8' };
  }
  if (['/', '/shopify-va', '/shopify-va/'].includes(path)) return { body: renderProductPage(config), contentType: 'text/html; charset=utf-8' };
  if (['/help', '/setup', '/shopify-va/setup', '/shopify-va/setup/'].includes(path)) return { body: renderHelpPage(config), contentType: 'text/html; charset=utf-8' };
  if (['/privacy', '/shopify-va/privacy', '/shopify-va/privacy/'].includes(path)) return { body: renderPrivacyPage(config), contentType: 'text/html; charset=utf-8' };
  return undefined;
}
