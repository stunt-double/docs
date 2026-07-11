/**
 * Documentation navigation tree.
 *
 * Single source of truth for the docs sidebar and the sitemap, so a new page
 * only needs adding here once. Keep the order top-to-bottom as it should read
 * in the sidebar. Every `href` maps to a `page.mdx` route under
 * `src/app/support/docs`.
 */

import { guideHref, integrationGuides } from './guides';

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
    title: 'Tutorials',
    links: [
      {
        title: 'Overview',
        href: '/support/docs/tutorials',
        description: 'The full series, and where to start.',
      },
      {
        title: 'Build an actor with the right capabilities',
        href: '/support/docs/tutorials/first-actor',
        description: 'Instructions, knowledge, and capabilities that fit the job.',
      },
      {
        title: 'Write checklists that catch real regressions',
        href: '/support/docs/tutorials/effective-checklists',
        description: 'Structure checks around outcomes and read the evidence.',
      },
      {
        title: 'Run a user interview',
        href: '/support/docs/tutorials/running-an-interview',
        description: 'Sections, items, recruitment, and reading the report.',
      },
      {
        title: 'Automate multi-step workflows',
        href: '/support/docs/tutorials/building-workflows',
        description: 'Chain checklists, conditions, and PR reviews together.',
      },
      {
        title: 'Turn runs into insights',
        href: '/support/docs/tutorials/reviewing-runs',
        description: 'Read results, screenshots, recordings, and insights.',
      },
      {
        title: 'Test a product behind your firewall',
        href: '/support/docs/tutorials/self-hosted-worker',
        description: 'Run actors against an internal product with a worker.',
      },
      {
        title: 'Automate Stunt Double from Claude',
        href: '/support/docs/tutorials/automate-with-mcp',
        description: 'Connect the MCP server and drive your workspace from Claude.',
      },
    ],
  },
  {
    title: 'Integration guides',
    links: [
      {
        title: 'Overview',
        href: '/support/docs/guides',
        description: 'How Stunt Double plugs into the tools where work already happens.',
      },
      ...integrationGuides.map((guide) => ({
        title: guide.title,
        href: guideHref(guide.slug),
        description: guide.description,
      })),
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
