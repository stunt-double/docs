import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { sectionsFromMdx } from '@/lib/search-feed';
import { SITE_URL, source } from '@/lib/source';

// Built once at build time: marketing's site-search sync reads it.
export const dynamic = 'force-static';

export function GET() {
  const sections = source.getPages().flatMap((page) =>
    sectionsFromMdx(readFileSync(join(process.cwd(), 'content', 'docs', page.path), 'utf8'), {
      path: page.url,
      title: page.data.title,
      origin: SITE_URL,
    })
  );
  return Response.json({ sections });
}
