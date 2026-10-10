// Ported from apps/marketing/src/lib/agent/content-negotiation.ts in the Stunt Double
// monorepo, so a markdown request behaves the same on both sites.

/**
 * HTTP content negotiation for the Markdown representation of a page
 * (https://acceptmarkdown.com, RFC 9110 §12.5.1).
 *
 * Kept free of runtime imports so `node --test` can load it directly.
 */

/** Representations the docs site can produce, HTML first (the default). */
export const PRODUCES = ['text/html', 'text/markdown'] as const;
export type ProducedType = (typeof PRODUCES)[number];

type AcceptEntry = { type: string; q: number; specificity: number };

function parseAccept(header: string): AcceptEntry[] {
  return header
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const [rawType = '', ...params] = raw.split(';').map((s) => s.trim());
      const type = rawType.toLowerCase();
      let q = 1;
      for (const param of params) {
        const [name, value] = param.split('=').map((s) => s.trim());
        if (name?.toLowerCase() === 'q' && value !== undefined) {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
        }
      }
      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;
      return { type, q, specificity };
    });
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === '*/*') return true;
  if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

/**
 * The representation the client prefers, or `null` when it explicitly rejects
 * everything we produce. A missing or empty header means "anything", so HTML.
 *
 * The most specific matching range decides each candidate's q (so
 * `text/html;q=0, *\/*` rejects HTML), the highest q wins across candidates,
 * and a tie goes to whichever the client listed first.
 */
export function preferredType(header: string | null | undefined): ProducedType | null {
  if (!header || !header.trim()) return PRODUCES[0];
  const entries = parseAccept(header);
  if (entries.length === 0) return PRODUCES[0];

  let best: ProducedType | null = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of PRODUCES) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Infinity;
    entries.forEach((entry, idx) => {
      if (!matches(entry, candidate)) return;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = idx;
      }
    });
    if (matched === null) continue;
    const q = (matched as AcceptEntry).q;
    if (q <= 0) continue;
    if (q > bestQ || (q === bestQ && matchedPosition < bestPosition)) {
      best = candidate;
      bestQ = q;
      bestPosition = matchedPosition;
    }
  }

  return best;
}

/** True when the client prefers Markdown over HTML. */
export function prefersMarkdown(header: string | null | undefined): boolean {
  return preferredType(header) === 'text/markdown';
}

/** Adds `Accept` to a `Vary` header value without duplicating it. */
export function varyWithAccept(existing: string | null | undefined): string {
  if (!existing || !existing.trim()) return 'Accept';
  const tokens = existing.split(',').map((s) => s.trim().toLowerCase());
  if (tokens.includes('accept') || tokens.includes('*')) return existing;
  return `${existing}, Accept`;
}


/**
 * The internal `/md` route that serves a page's markdown, for a page path or
 * its `.md` twin (`/guides/figma` and `/guides/figma.md` both map to
 * `/md/guides/figma`; `/` and `/index.md` map to `/md`).
 */
export function markdownPath(pathname: string): string {
  const path = pathname.replace(/\.md$/, '').replace(/\/index$/, '').replace(/\/+$/, '');
  return path ? `/md${path}` : '/md';
}
