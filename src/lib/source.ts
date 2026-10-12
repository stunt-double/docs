import { llms, loader } from 'fumadocs-core/source';
import { slugsPlugin } from 'fumadocs-core/source/plugins/slugs';
import { statusBadgesPlugin } from 'fumadocs-core/source/plugins/status-badges';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';
import { createElement } from 'react';

import { pageIcon } from './page-icon';

export { SITE_URL } from './site';

const docs = defineDocs({
  dir: 'content/docs',
  // `status` (`preview`, `new`, ...) badges the page in the sidebar.
  docs: {
    schema: pageSchema.extend({ status: pageSchema.shape.title.optional() }),
    postprocess: { includeProcessedMarkdown: true },
  },
  meta: { schema: metaSchema },
});

// Pages sit at the root (`/getting-started`, `/guides/figma`), matching the
// old `/support/docs` and `/guides` paths with the docs prefix dropped. The
// overview pages generated from the source repos (`_generated/`), if any, serve
// under `/reference`; the /mcp section is generated straight into `content/docs/mcp`.
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  icon: pageIcon,
  plugins: [
    statusBadgesPlugin({
      renderBadge: (status) =>
        createElement(
          'span',
          {
            'data-status': status,
            className:
              'border-fd-border text-fd-muted-foreground ms-auto rounded-sm border px-1 py-px font-mono text-[0.625rem] leading-none tracking-[0.08em] uppercase',
          },
          status,
        ),
    }),
    slugsPlugin((_file, next) => {
      const slugs = next();
      return slugs[0] === '_generated' ? ['reference', ...slugs.slice(1)] : undefined;
    }),
  ],
});

/** `/llms.txt` (the index) and `/llms-full.txt` (every page), as apps/brand serves them. */
export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
