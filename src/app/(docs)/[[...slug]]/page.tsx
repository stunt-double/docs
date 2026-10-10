import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getMDXComponents } from '@/components/mdx';
import { source } from '@/lib/source';

type Props = { params: Promise<{ slug?: string[] }> };

/** Most pages open with their own `# ` heading; only the rest get the Fumadocs title. */
function hasOwnH1(path: string): boolean {
  const body = readFileSync(join(process.cwd(), 'content', 'docs', path), 'utf8').replace(
    /^(```|~~~)[\s\S]*?^\1/gm,
    ''
  );
  return /^# /m.test(body);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      {!hasOwnH1(page.path) && (
        <>
          <DocsTitle>{page.data.title}</DocsTitle>
          <DocsDescription>{page.data.description}</DocsDescription>
        </>
      )}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
  };
}
