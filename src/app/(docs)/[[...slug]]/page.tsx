import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageFooter,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { JsonLd } from "@/components/json-ld";
import { getMDXComponents } from "@/components/mdx";
import { SiteFooter } from "@/components/site-footer";
import { absoluteUrl } from "@/lib/site";
import { source } from "@/lib/source";
import { editUrl, sectionFor, uniqueTitle } from "../../section";

type Props = { params: Promise<{ slug?: string[] }> };

const SITE_NAME = "Stunt Double Docs";

/** Most pages open with their own `# ` heading; only the rest get the Fumadocs title. */
function hasOwnH1(path: string): boolean {
  const body = readFileSync(
    join(process.cwd(), "content", "docs", path),
    "utf8",
  ).replace(/^(```|~~~)[\s\S]*?^\1/gm, "");
  return /^# /m.test(body);
}

function ogImagePath(slugs: string[]): string {
  return `/og/${[...slugs, "image.png"].join("/")}`;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const url = absoluteUrl(page.url);
  const section = sectionFor(page.url);
  const edit = editUrl(page.path);

  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: page.data.title,
    description: page.data.description,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(ogImagePath(page.slugs)),
    inLanguage: "en-US",
    ...(section ? { articleSection: section } : {}),
    isPartOf: { "@id": "https://docs.stuntdouble.io/#website" },
    publisher: { "@id": "https://www.stuntdouble.io/#organization" },
  };

  // Home, then each parent folder that has its own page, then this page.
  const crumbs = [{ name: "Docs", url: absoluteUrl("/") }];
  for (let i = 1; i < page.slugs.length; i++) {
    const parent = source.getPage(page.slugs.slice(0, i));
    if (parent)
      crumbs.push({ name: parent.data.title, url: absoluteUrl(parent.url) });
  }
  if (page.url !== "/") crumbs.push({ name: page.data.title, url });
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} footer={{ enabled: false }}>
      <JsonLd data={article} />
      <JsonLd data={breadcrumbs} />
      {!hasOwnH1(page.path) && (
        <>
          <DocsTitle className="sd-title">{page.data.title}</DocsTitle>
          <DocsDescription>{page.data.description}</DocsDescription>
        </>
      )}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
      {edit ? (
        <a href={edit} className="sd-edit" target="_blank" rel="noreferrer noopener">
          Edit this page on GitHub
        </a>
      ) : null}
      <PageFooter />
      <SiteFooter />
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

  const url = absoluteUrl(page.url);
  const title = uniqueTitle(page.url, page.data.title);
  const image = {
    url: ogImagePath(page.slugs),
    width: 1200,
    height: 630,
    alt: page.data.title,
  };

  return {
    title,
    description: page.data.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description: page.data.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      site: "@stuntdouble",
      title,
      description: page.data.description,
      images: [image],
    },
  };
}
