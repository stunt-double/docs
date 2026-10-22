/** The marketing site, for the few root links the docs make that live there. */
export const MARKETING_ORIGIN = 'https://www.stuntdouble.io';

/**
 * Map a link written for the old marketing-hosted docs to where it lives now,
 * so the MDX can stay as written: `/support/docs/...` drops its prefix, a
 * docs section path (`/guides`, `/mcp`, `/integrations`, ...) is already
 * right, and any other root path (`/pricing`, `/changelog`, `/llms.txt`) is on
 * the marketing site.
 */
const DOCS_SECTIONS =
  /^\/(guides|integrations|mcp|tutorials|concepts|getting-started|api|stuntkit|index-ranking|reference)(?=$|[/#?])/;

export function docsHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  if (href === '/support/docs' || /^\/support\/docs[/#?]/.test(href)) {
    return href.slice('/support/docs'.length) || '/';
  }
  if (DOCS_SECTIONS.test(href)) return href;
  return `${MARKETING_ORIGIN}${href}`;
}
