import { publicContent, SECURITY_HEADERS } from '../src/public-routes.js';

interface GuideEnv {
  PUBLIC_SITE_URL: string;
  CONNECTOR_PUBLIC_URL: string;
  PUBLIC_LAUNCH_STAGE: string;
  SHOPIFY_PUBLIC_APP_HANDLE: string;
  PLUGIN_DOWNLOAD_URL: string;
}

/** Mount only /shopify-va* on the main brand domain; the existing MKT Skills site keeps its other routes. */
export default {
  async fetch(request: Request, env: GuideEnv): Promise<Response> {
    const url = new URL(request.url), site = new URL(env.PUBLIC_SITE_URL);
    if (url.origin !== site.origin || request.headers.get('host') !== site.host) return Response.json({ error: 'host_not_allowed' }, { status: 403, headers: SECURITY_HEADERS });
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405, headers: { ...SECURITY_HEADERS, Allow: 'GET, HEAD' } });
    if (!url.pathname.startsWith('/shopify-va')) return new Response('Page not found', { status: 404, headers: SECURITY_HEADERS });
    const content = publicContent(url.pathname, { publicUrl: env.CONNECTOR_PUBLIC_URL, basePath: '/shopify-va',
      appHandle: env.SHOPIFY_PUBLIC_APP_HANDLE || undefined, pluginDownloadUrl: env.PLUGIN_DOWNLOAD_URL || undefined,
      launchStage: env.PUBLIC_LAUNCH_STAGE === 'public' ? 'public' : 'candidate' });
    if (!content) return new Response('Page not found', { status: 404, headers: SECURITY_HEADERS });
    return new Response(request.method === 'HEAD' ? null : content.body, { headers: { ...SECURITY_HEADERS, 'Content-Type': content.contentType } });
  },
} satisfies ExportedHandler<GuideEnv>;
