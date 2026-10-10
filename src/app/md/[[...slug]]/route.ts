import { docsLlms, source } from '@/lib/source';

// Each docs page as markdown. Reached through the proxy, which rewrites a page
// path here when the request prefers `text/markdown` (or ends in `.md`), so an
// agent following a redirect from the old marketing docs still gets markdown.
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: page.slugs }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) return new Response('Not found\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  return new Response(await docsLlms.page(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept' },
  });
}
