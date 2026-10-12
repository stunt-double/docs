import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { StuntDoubleLockup } from '@/components/logo';
import { SidebarSeparator } from '@/components/sidebar-separator';
import { GITHUB_URL } from '@/lib/site';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      githubUrl={GITHUB_URL}
      sidebar={{ components: { Separator: SidebarSeparator } }}
      nav={{
        title: (
          // The lockup's artwork carries its clear space on the left, top and
          // bottom but ends flush with "DOUBLE", so the chip keeps a quarter
          // of the glyph's width clear. Mono caps, never live "Stunt Double"
          // type by the glyph.
          <span className="-ml-1.5 flex items-center gap-2">
            <StuntDoubleLockup height={30} />
            <span className="border-fd-border bg-fd-muted text-fd-muted-foreground rounded-md border px-1.5 py-0.5 font-mono text-[0.6875rem] leading-none tracking-[0.12em] uppercase">
              Docs
            </span>
          </span>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
