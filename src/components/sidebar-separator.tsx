'use client';

import type { Separator } from 'fumadocs-core/page-tree';

/** A sidebar section label, in the brand's overline style. */
export function SidebarSeparator({ item }: { item: Separator }) {
  return (
    <p className="text-overline text-fd-muted-foreground mt-6 mb-1.5 inline-flex items-center gap-2 px-2 first:mt-0">
      {item.icon}
      {item.name}
    </p>
  );
}
