import { flattenTree, type Root } from 'fumadocs-core/page-tree';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * "Continue reading": the previous and next pages in sidebar order, each a
 * half-column card under a mono label. External sidebar links (llms.txt,
 * stuntdouble.io) are never a neighbour.
 */
export function ContinueReading({ tree, url }: { tree: Root; url: string }) {
  const pages = flattenTree(tree.children).filter((item) => !item.external);
  const i = pages.findIndex((item) => item.url === url);
  if (i === -1) return null;
  const previous = pages[i - 1];
  const next = pages[i + 1];
  if (!previous && !next) return null;

  return (
    <nav aria-labelledby="continue-reading" className="border-border/60 mt-10 border-t pt-6">
      <h2
        id="continue-reading"
        className="text-muted-foreground mb-4 font-mono text-[0.6875rem] font-normal tracking-[0.12em] uppercase"
      >
        Continue reading
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {previous ? (
          <Card
            href={previous.url}
            direction="Previous"
            title={previous.name}
            description={previous.description}
          />
        ) : null}
        {next ? (
          <Card
            href={next.url}
            direction="Next"
            title={next.name}
            description={next.description}
            className={previous ? undefined : 'sm:col-start-2'}
          />
        ) : null}
      </div>
    </nav>
  );
}

function Card({
  href,
  direction,
  title,
  description,
  className,
}: {
  href: string;
  direction: 'Previous' | 'Next';
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  const Chevron = direction === 'Next' ? ChevronRight : ChevronLeft;
  return (
    <Link
      href={href}
      rel={direction === 'Next' ? 'next' : 'prev'}
      className={`border-border hover:bg-fd-accent/50 group flex flex-col gap-1.5 rounded-lg border p-4 transition-colors ${className ?? ''}`}
    >
      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
        {direction === 'Previous' ? <Chevron className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {direction}
        {direction === 'Next' ? <Chevron className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      </span>
      <span className="text-foreground flex items-center gap-2 text-sm font-medium">{title}</span>
      {description ? (
        <span className="text-muted-foreground line-clamp-2 text-sm">{description}</span>
      ) : null}
    </Link>
  );
}
