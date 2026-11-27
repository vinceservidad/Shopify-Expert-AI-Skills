import { APP_HOME_SCRIPT, HERO_SCRIPT, PUBLIC_STYLES, SEQUENCE_SCRIPT, THEME_SCRIPT, renderHelpPage, renderLlmsFullTxt, renderLlmsTxt, renderPrivacyPage, renderProductPage, type PublicPageConfig } from './public-pages.js';
import { ogImageBytes } from './public-ui/og-image.js';
import { FONT_LICENSES, fontBytes } from './public-ui/fonts.js';

// Cloudflare Web Analytics (owner-approved 2026-10-01): the zone injects its beacon into these pages, served
// from a versioned path under beacon.min.js/, and it reports to /cdn-cgi/rum on this origin. Nothing else is added.
export const WEB_ANALYTICS_BEACON = 'https://static.cloudflareinsights.com/beacon.min.js';
export const PUBLIC_PAGE_CSP = `default-src 'none'; style-src 'self'; script-src 'self' ${WEB_ANALYTICS_BEACON} ${WEB_ANALYTICS_BEACON}/; connect-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`;
export const SECURITY_HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': PUBLIC_PAGE_CSP };

// Plain text displays inline in browsers (text/markdown is downloaded) and is read by every agent and crawler.
export const LLMS_CONTENT_TYPE = 'text/plain; charset=utf-8';

// Fonts are cached for a year as immutable: a changed font file must ship under a new file name.
// The OFL licence texts are served beside them at /shopify-va/assets/fonts/license-*.txt.
export const FONT_CACHE_CONTROL = 'public, max-age=31536000, immutable';

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
  if (['/assets/sequence.js', '/shopify-va/assets/sequence.js'].includes(path)) return { body: SEQUENCE_SCRIPT, contentType: 'text/javascript; charset=utf-8' };
  const font = /^(?:\/shopify-va)?\/assets\/fonts\/([a-z0-9-]+\.(?:woff2|txt))$/.exec(path)?.[1];
  if (font) {
    const bytes = fontBytes(font);
    if (bytes) return { body: bytes, contentType: 'font/woff2', cacheControl: FONT_CACHE_CONTROL };
    const license = font.startsWith('license-') && Object.hasOwn(FONT_LICENSES, font.replace(/^license-/, 'LICENSE-')) ? FONT_LICENSES[font.replace(/^license-/, 'LICENSE-')] : undefined;
    if (license) return { body: license, contentType: 'text/plain; charset=utf-8', cacheControl: 'public, max-age=86400' };
    return undefined;
  }
  if (path === '/assets/app-home.js') return { body: APP_HOME_SCRIPT, contentType: 'text/javascript; charset=utf-8' };
  if (['/og-shopify-va.png', '/shopify-va/og-shopify-va.png'].includes(path)) {
    return { body: ogImageBytes(), contentType: 'image/png', cacheControl: 'public, max-age=86400' };
  }
  if (['/llms.txt', '/shopify-va/llms.txt'].includes(path)) {
    return { body: renderLlmsTxt(config), contentType: LLMS_CONTENT_TYPE };
  }
  if (['/llms-full.txt', '/shopify-va/llms-full.txt'].includes(path)) {
    return { body: renderLlmsFullTxt(config), contentType: LLMS_CONTENT_TYPE };
  }
  if (['/', '/shopify-va', '/shopify-va/'].includes(path)) return { body: renderProductPage(config), contentType: 'text/html; charset=utf-8' };
  if (['/help', '/setup', '/shopify-va/setup', '/shopify-va/setup/'].includes(path)) return { body: renderHelpPage(config), contentType: 'text/html; charset=utf-8' };
  if (['/privacy', '/shopify-va/privacy', '/shopify-va/privacy/'].includes(path)) return { body: renderPrivacyPage(config), contentType: 'text/html; charset=utf-8' };
  return undefined;
}
