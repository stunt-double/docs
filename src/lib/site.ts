/** The canonical origin. Every canonical, sitemap and OG URL is absolute on it. */
export const SITE_URL = 'https://docs.stuntdouble.io';

/** An absolute URL on the docs origin for a site path (`/` is the bare origin). */
export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** The docs source repository. */
export const GITHUB_URL = 'https://github.com/stunt-double/docs';

/** The hosted MCP server endpoint. */
export const MCP_URL = 'https://app.stuntdouble.io/api/mcp';
