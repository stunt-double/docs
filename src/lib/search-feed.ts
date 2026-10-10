/**
 * The docs, cut into sections for marketing's semantic search
 * (`/search-feed.json`). The rules follow marketing's `site-search-chunks.ts`:
 * a page splits at its h2 and h3 headings, each anchor is the one
 * `rehype-slug` stamps on the rendered heading (github-slugger, counted over
 * every heading on the page), and only prose is kept (no frontmatter,
 * imports, exports, fenced code or JSX tags). Long sections are not split
 * here: the consumer decides how to chunk for its embedding model.
 *
 * Pure apart from `github-slugger` and `node:crypto`, so `node --test` can
 * load it directly.
 */

import GithubSlugger from 'github-slugger';
import { createHash } from 'node:crypto';

export type SearchSection = {
  /** Page path, e.g. `/tutorials/first-actor`. */
  page: string;
  /** The page title. */
  title: string;
  /** The section heading, or null for a page's opening. */
  heading: string | null;
  /** Heading anchor, or `''` for a page's opening. */
  anchor: string;
  /** Absolute URL, anchor included. */
  url: string;
  /** Plain text: no markup, JSX or code. */
  text: string;
  /** sha256 of title, heading and text. */
  hash: string;
};

/** A section with less text than this (a heading over a lone callout) is not worth indexing. */
export const MIN_SECTION_CHARS = 40;

export function sectionHash(title: string, heading: string | null, text: string): string {
  return createHash('sha256')
    .update([title, heading, text].filter(Boolean).join('\n\n'))
    .digest('hex');
}

/**
 * Markdown and MDX inline syntax down to the words a reader sees: links keep
 * their text, images, inline code markers and emphasis go, JSX tags go but
 * their children stay.
 */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<\/?[A-Za-z][^<>]*\/?>/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,;:!?]|$)/g, '$1$2')
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, '')
    .replace(/\|/g, ' ')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Drop what is not prose: frontmatter, `import` and `export` blocks, and fenced code. */
function proseLines(source: string): string[] {
  const lines = source
    .replace(/\r\n/g, '\n')
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .split('\n');
  const kept: string[] = [];
  let inFence = false;
  let inExport = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (inExport) {
      if (line.trim() === '') inExport = false;
      continue;
    }
    if (/^(import|export)\s/.test(line)) {
      inExport = true;
      continue;
    }
    kept.push(line);
  }
  return kept;
}

/** An MDX page, as sections at its h2 and h3 headings. */
export function sectionsFromMdx(
  source: string,
  page: { path: string; title: string; origin: string }
): SearchSection[] {
  const slugger = new GithubSlugger();
  const sections: SearchSection[] = [];
  let anchor = '';
  let heading: string | null = null;
  let body: string[] = [];

  const flush = () => {
    const text = plainText(body.join('\n'));
    body = [];
    if (text.length < MIN_SECTION_CHARS) return;
    sections.push({
      page: page.path,
      title: page.title,
      heading,
      anchor,
      url: `${page.origin}${page.path}${anchor ? `#${anchor}` : ''}`,
      text,
      hash: sectionHash(page.title, heading, text),
    });
  };

  for (const line of proseLines(source)) {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      body.push(line);
      continue;
    }
    const text = plainText(match[2] ?? '');
    // Every heading takes a slug, split or not, so duplicate counting matches
    // what rehype-slug renders.
    const slug = slugger.slug(text);
    const depth = match[1]?.length ?? 1;
    if (depth === 2 || depth === 3) {
      flush();
      anchor = slug;
      heading = text;
    } else if (depth > 3) {
      body.push(text);
    }
    // The h1 is the page title, which every section already carries.
  }
  flush();
  return sections;
}
