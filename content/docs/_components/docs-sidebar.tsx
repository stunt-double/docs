'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/app/lib/utils';
import { docsNav } from '../_lib/nav';

/**
 * Docs sidebar navigation. Renders the shared `docsNav` tree and highlights the
 * link matching the current pathname. Used inside the docs layout on desktop
 * (a sticky rail) and at the top of the page on small screens.
 *
 * On desktop the rail is capped to the viewport height (see the layout), so the
 * "Support" back link stays pinned while the section list scrolls on its own
 * when it is taller than the space available. A soft mask fades whichever edge
 * still has content past the fold, reading as a scroll shadow so the cut-off is
 * obvious. Below `lg` the list is not a scroll container, so the fade collapses
 * to a no-op and the whole nav flows with the page.
 */
export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  // Which edges have content scrolled out of view. The mask only fades the side
  // that actually continues past the fold, so a fully visible list shows none.
  const [edges, setEdges] = useState({ top: false, bottom: false });

  const update = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const next = { top: el.scrollTop > 1, bottom: el.scrollTop < max - 1 };
    setEdges((prev) => (prev.top === next.top && prev.bottom === next.bottom ? prev : next));
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    update();
    // The list height tracks the viewport (its max-height is `100vh`-based), so
    // a resize can change whether either edge has hidden content.
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const fade = '24px';
  const top = edges.top ? `transparent 0, black ${fade}` : 'black 0, black 0';
  const bottom = edges.bottom
    ? `black calc(100% - ${fade}), transparent 100%`
    : 'black 100%, black 100%';
  const maskImage = `linear-gradient(to bottom, ${top}, ${bottom})`;

  return (
    <nav
      aria-label="Documentation"
      className={cn('text-sm lg:flex lg:max-h-[calc(100vh-8rem)] lg:flex-col', className)}
    >
      <Link
        href="/support"
        className="text-muted-foreground hover:text-foreground mb-7 inline-flex items-center gap-1.5 transition-colors lg:shrink-0"
      >
        <ArrowLeft className="size-3.5" />
        Support
      </Link>
      <div
        ref={listRef}
        onScroll={update}
        className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pl-px"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <ul className="flex flex-col gap-7">
          {docsNav.map((section) => (
            <li key={section.title}>
              <p className="text-muted-foreground mb-3 font-mono text-xs uppercase">
                {section.title}
              </p>
              <ul className="border-border/60 flex flex-col gap-0.5 border-l">
                {section.links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          '-ml-px block border-l py-1.5 pl-4 transition-colors',
                          active
                            ? 'border-foreground text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground border-transparent hover:border-foreground/40'
                        )}
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
