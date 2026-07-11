/**
 * Integration guide registry.
 *
 * Single source of truth for the guide pages under /support/docs/guides. The
 * docs sidebar section, the guides index cards, and the /integrations hub cards
 * all render from this list, so adding a guide means one entry here plus a
 * `page.mdx` under `src/app/support/docs/guides/<slug>/`.
 */

export interface IntegrationGuide {
  slug: string;
  title: string;
  /** Short description used on hub cards and link previews. */
  description: string;
}

export const integrationGuides: IntegrationGuide[] = [
  {
    slug: 'claude-design',
    title: 'Claude design',
    description: 'Design in Claude, publish the artifact, validate with personas in the same chat.',
  },
  {
    slug: 'figma',
    title: 'Figma',
    description: 'Test prototypes with personas and re-check flows when files change.',
  },
  {
    slug: 'figma-make',
    title: 'Figma Make',
    description: 'Publish a Make site and interview personas against it before anyone builds.',
  },
  {
    slug: 'codebases',
    title: 'Codebases',
    description: 'Verify changes on preview deployments from Claude Code, Cursor, or GitHub.',
  },
  {
    slug: 'validation',
    title: 'Validation',
    description: 'Enforce brand, compliance, continuity, and design-system standards continuously.',
  },
];

export const guideHref = (slug: string) => `/support/docs/guides/${slug}`;
