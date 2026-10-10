import { NextResponse, type NextRequest } from 'next/server';

import { CONSENT_REGION_COOKIE } from '@/lib/consent';
import { consentRegionForCountry } from '@/lib/consent-region';

/**
 * Stamp whether the visitor's location needs an opt-in before analytics and
 * ad cookies run, so the consent defaults and banner can tell without the page
 * reading headers. Same behaviour as the marketing site's proxy. An unknown
 * location asks first. Only written when it changes.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
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
