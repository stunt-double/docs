/**
 * Documentation navigation tree.
 *
 * Single source of truth for the docs sidebar and the sitemap, so a new page
 * only needs adding here once. Keep the order top-to-bottom as it should read
 * in the sidebar. Every `href` maps to a `page.mdx` route under
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
    title: 'Tutorials',
    links: [
      {
        title: 'Overview',
        href: '/support/docs/tutorials',
        description: 'The full series, and where to start.',
      },
      {
        title: 'Build an actor that behaves like your audience',
        href: '/support/docs/tutorials/first-actor',
        description: 'Instructions and knowledge that make an actor feel real.',
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
        title: 'Collect stakeholder feedback on a prototype',
        href: '/support/docs/tutorials/feedback-widget',
        description: 'Install the feedback widget and triage what reviewers pin.',
      },
      {
        title: 'Review designs from Slack',
        href: '/support/docs/tutorials/slack-design-review',
        description: 'Share a link in Slack and get a reviewed screen back in the thread.',
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
    title: 'Open source',
    links: [
      {
        title: 'StuntKit',
        href: '/support/docs/stuntkit',
        description: 'The open source tools behind Stunt Double, for your own agents.',
      },
      {
        title: 'Give an AI agent a safe browser',
        href: '/support/docs/stuntkit/browser-toolset',
        description: 'Browser tools for any model, with guards against paying and signing up.',
      },
    ],
  },
  {
    title: 'Guides',
    links: [
      {
        title: 'Integration guides',
        href: '/guides',
        description: 'How Stunt Double plugs into the tools where work already happens.',
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
        description: 'Connect Claude, Cursor and other MCP clients to your workspace.',
      },
    ],
  },
];

/** Flattened list of every docs link, in sidebar order. */
export const docsLinks: DocsLink[] = docsNav.flatMap((section) => section.links);
