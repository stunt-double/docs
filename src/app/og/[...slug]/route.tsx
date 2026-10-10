import { notFound } from "next/navigation";

import { renderOgCard } from "@/components/og-card";
import { source } from "@/lib/source";
import { sectionFor } from "../../section";

// Every card is rendered at build time from the docs tree, and an unknown
// slug is a 404 rather than an on-demand render.
export const dynamicParams = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  // The last segment is the `image.png` filename, so crawlers get an extension.
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return renderOgCard({
    eyebrow: sectionFor(page.url) ?? "Docs",
    title: page.data.title,
    description: page.data.description,
  });
}

export function generateStaticParams() {
  return source
    .getPages()
    .map((page) => ({ slug: [...page.slugs, "image.png"] }));
}
