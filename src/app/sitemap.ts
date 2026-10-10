import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";
import { source } from "@/lib/source";
import { gitDates } from "./git-dates";

// Every page the loader serves, the generated reference pages (`/reference/*`,
// MCP and integrations) included. `lastModified` only where git can say.
export default function sitemap(): MetadataRoute.Sitemap {
  const dateOf = gitDates();
  return source.getPages().map((page) => {
    const lastModified = dateOf(`content/docs/${page.path}`);
    return {
      url: absoluteUrl(page.url),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: page.url === "/" ? 1 : page.slugs.length === 1 ? 0.8 : 0.6,
    };
  });
}
