import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/site';
import { source } from '@/lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: absoluteUrl(page.url),
    changeFrequency: 'weekly' as const,
    priority: page.url === '/' ? 1 : page.slugs.length === 1 ? 0.8 : 0.6,
  }));
}
