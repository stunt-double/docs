import type { Root, Node } from "fumadocs-core/page-tree";

import { source } from "@/lib/source";

function contains(node: Node, url: string): boolean {
  if (node.type === "page") return node.url === url;
  if (node.type === "folder") {
    return (
      node.index?.url === url ||
      node.children.some((child) => contains(child, url))
    );
  }
  return false;
}

/**
 * The sidebar section a page sits under: its top-level folder ("Tutorials",
 * "Integrations"), or for a page outside one, the `---Name---` separator
 * above it in the root `meta.json` ("Start here"). Undefined for a page with
 * neither.
 */
export function sectionFor(
  url: string,
  tree: Root = source.getPageTree(),
): string | undefined {
  let current: string | undefined;
  for (const node of tree.children) {
    if (node.type === "separator")
      current = typeof node.name === "string" ? node.name : undefined;
    else if (contains(node, url))
      return node.type === "folder" && typeof node.name === "string"
        ? node.name
        : current;
  }
  return undefined;
}

/** The page's `<title>` text: its own title, with the section added when another page shares it. */
export function uniqueTitle(url: string, title: string): string {
  const shared =
    source.getPages().filter((page) => page.data.title === title).length > 1;
  const section = shared ? sectionFor(url) : undefined;
  return section ? `${title} (${section})` : title;
}

/** Where a handwritten page's source lives; generated pages are owned by their source repo. */
export function editUrl(path: string): string | undefined {
  if (path.startsWith("_generated/")) return undefined;
  // Everything in mcp/ but connect.mdx is written by scripts/generate.mjs (MCP_GENERATED).
  if (path.startsWith("mcp/") && path !== "mcp/connect.mdx") return undefined;
  return `https://github.com/stunt-double/docs/blob/main/content/docs/${path}`;
}
