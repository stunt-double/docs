import { loader } from 'fumadocs-core/source';
import { slugsPlugin } from 'fumadocs-core/source/plugins/slugs';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';

export const SITE_URL = 'https://docs.stuntdouble.io';

const docs = defineDocs({
  dir: 'content/docs',
  docs: { schema: pageSchema },
  meta: { schema: metaSchema },
});

// Pages sit at the root (`/getting-started`, `/guides/figma`), matching the
// old `/support/docs` and `/guides` paths with the docs prefix dropped. The
// pages generated from the source repos (`_generated/`) serve under
// `/reference`.
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: [
    slugsPlugin((_file, next) => {
      const slugs = next();
      return slugs[0] === '_generated' ? ['reference', ...slugs.slice(1)] : undefined;
    }),
  ],
});
