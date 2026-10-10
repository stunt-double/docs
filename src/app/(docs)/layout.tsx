import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { StuntDoubleLockup } from '@/components/logo';
import { SidebarSeparator } from '@/components/sidebar-separator';
import { GITHUB_URL } from '@/lib/site';
import { source } from '@/lib/source';

/** A 16px stroke icon in the sidebar's link style. */
function LinkIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// Lucide's globe, file-text and bot outlines.
const GLOBE = 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z';
const FILE = 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8';
const BOT = 'M12 8V4H8M4 8h16a0 0 0 0 1 0 0v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8ZM2 14h2M20 14h2M15 13v2M9 13v2';

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
      links={[
        {
          text: 'stuntdouble.io',
          url: 'https://www.stuntdouble.io',
          icon: <LinkIcon d={GLOBE} />,
          external: true,
        },
        {
          type: 'menu',
          text: 'For AI agents',
          icon: <LinkIcon d={BOT} />,
          items: [
            { text: 'llms.txt', url: '/llms.txt', icon: <LinkIcon d={FILE} />, external: true },
            { text: 'llms-full.txt', url: '/llms-full.txt', icon: <LinkIcon d={FILE} />, external: true },
            { text: 'agents.md', url: '/.well-known/agents.md', icon: <LinkIcon d={FILE} />, external: true },
          ],
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
