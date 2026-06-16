/**
 * Documentation navigation tree.
 *
 * Single source of truth for the docs sidebar and the sitemap, so a new page
 * only needs adding here once. Keep the order top-to-bottom as it should read
 * in the sidebar. Every `href` must map to a `page.mdx` route under
 * `src/app/support/docs`.
 */

export interface DocsLink {
  title: string;
  href: string;
  /** Short description used for the section landing cards and link previews. */
  description?: string;
}

export interface DocsSection {
  title: string;
  links: DocsLink[];
}

export const docsNav: DocsSection[] = [
  {
    title: 'Getting started',
    links: [
      {
        title: 'Introduction',
        href: '/support/docs',
        description: 'What Stunt Double is and how the pieces fit together.',
      },
      {
        title: 'Quickstart',
        href: '/support/docs/getting-started',
        description: 'Create a workspace, add an actor, and run your first checklist.',
      },
    ],
  },
  {
    title: 'Concepts',
    links: [
      {
        title: 'Core concepts',
        href: '/support/docs/concepts',
        description: 'Actors, checklists, interviews, workflows, and insights.',
      },
    ],
  },
  {
    title: 'API',
    links: [
      {
        title: 'API overview',
        href: '/support/docs/api',
        description: 'How to talk to Stunt Double programmatically.',
      },
      {
        title: 'MCP server',
        href: '/support/docs/api/mcp',
        description: 'Connect Claude and other MCP clients to your workspace.',
      },
    ],
  },
];

/** Flattened list of every docs link, in sidebar order. */
export const docsLinks: DocsLink[] = docsNav.flatMap((section) => section.links);
