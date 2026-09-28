import { renderArticleCard } from '../../../lib/og-article-card';
import { OG_SIZE } from '../../../lib/og-card';
import { docsNav } from '../_lib/nav';

/**
 * Shared social card for every documentation page.
 *
 * Support docs used to inherit the generic site card, so a shared doc link
 * looked identical whatever page it pointed at. This renders a per-page card
 * that carries the doc's own title and deck over the page's own ridges field
 * (the call sheet's rules, lifted by the lamp, as the guides draw), so it
 * reads the same way the blog and guides cards do and a reader can tell what
 * the link is before they open it.
 *
 * Lives in `_components` (a shared helper, like the blog's `og-card.tsx`)
 * rather than in one route's `opengraph-image.tsx`, because every doc route
 * serves the same composition and only the looked-up copy changes.
 */
export const DOCS_OG_SIZE = OG_SIZE;

interface DocMeta {
  title: string;
  description: string;
  section: string;
}

/**
 * Resolve a doc page's card copy from the navigation tree, the same source the
 * sidebar and sitemap read, so a title only ever lives in one place. Falls back
 * to the section-level heading if a page has no registered entry.
 */
function resolveDoc(href: string): DocMeta {
  for (const section of docsNav) {
    const link = section.links.find((l) => l.href === href);
    if (link) {
      return {
        title: link.title,
        description: link.description ?? 'Documentation, tutorials and guides for Stunt Double.',
        section: section.title,
      };
    }
  }
  return {
    title: 'Documentation',
    description: 'Documentation, tutorials and guides for Stunt Double.',
    section: 'Support',
  };
}

/**
 * Render the documentation social card for the page at `href`. Never throws:
 * a missing font or a render fault degrades to the text-free card.
 */
export function renderDocsOgImage(href: string) {
  const { title, description, section } = resolveDoc(href);
  return renderArticleCard({
    seed: href,
    motif: 'ridges',
    eyebrow: 'Documentation',
    title,
    description,
    footer: [section, 'stuntdouble.io/support'],
    label: `docs "${href}"`,
  });
}
