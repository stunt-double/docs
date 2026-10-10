import { NextResponse, type NextRequest } from 'next/server';

import { CONSENT_REGION_COOKIE } from '@/lib/consent';
import { markdownPath, prefersMarkdown, varyWithAccept } from '@/lib/content-negotiation';
import { consentRegionForCountry } from '@/lib/consent-region';

/**
 * Stamp whether the visitor's location needs an opt-in before analytics and
 * ad cookies run, so the consent defaults and banner can tell without the page
 * reading headers. Same behaviour as the marketing site's proxy. An unknown
 * location asks first. Only written when it changes.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Markdown for agents: a `.md` path, or a page request that prefers
  // `text/markdown`, is served from the `/md` route (same rule as marketing).
  if (!pathname.startsWith('/md') && (pathname.endsWith('.md') || prefersMarkdown(request.headers.get('accept')))) {
    const url = request.nextUrl.clone();
    url.pathname = markdownPath(pathname);
    const rewritten = NextResponse.rewrite(url);
    rewritten.headers.set('Vary', varyWithAccept(rewritten.headers.get('Vary')));
    return rewritten;
  }
  const response = NextResponse.next();
  response.headers.set('Vary', varyWithAccept(response.headers.get('Vary')));
  const region = consentRegionForCountry(request.headers.get('x-vercel-ip-country'));
  if (request.cookies.get(CONSENT_REGION_COOKIE)?.value !== region) {
    response.cookies.set(CONSENT_REGION_COOKIE, region, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    });
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|json|webmanifest|woff|woff2|map)$).*)',
  ],
};
