/** The canonical origin. Every canonical, sitemap and OG URL is absolute on it. */
export const SITE_URL = 'https://docs.stuntdouble.io';

/** An absolute URL on the docs origin for a site path (`/` is the bare origin). */
export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
