'use client';

import type { Separator } from 'fumadocs-core/page-tree';

/** A sidebar section label: mono xs caps, like the other labels on the site. */
export function SidebarSeparator({ item }: { item: Separator }) {
  return (
    <p className="text-fd-muted-foreground mt-6 mb-1.5 inline-flex items-center gap-2 px-2 font-mono text-xs tracking-[0.12em] uppercase first:mt-0">
      {item.icon}
      {item.name}
    </p>
  );
}
