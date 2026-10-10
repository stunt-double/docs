import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { ConsentSettingsButton } from '@/components/consent-banner';
import { StuntDoubleLockup } from '@/components/logo';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{
        title: (
          // The lockup's artwork carries its clear space on the left, top and
          // bottom but ends flush with "DOUBLE", so the tag keeps a quarter of
          // the glyph's width (about 6px here) clear and sits on that line's
          // baseline. Mono caps, never live "Stunt Double" type by the glyph.
          <span className="-ml-2 flex items-end">
            <StuntDoubleLockup height={40} />
            <span className="text-fd-muted-foreground mb-[6px] ml-2.5 font-mono text-[11px] tracking-[0.12em] uppercase">
              Docs
            </span>
          </span>
        ),
      }}
      links={[
        {
          text: 'stuntdouble.io',
          url: 'https://www.stuntdouble.io',
          external: true,
        },
      ]}
      sidebar={{ footer: <ConsentSettingsButton key="consent-settings" /> }}
    >
      {children}
    </DocsLayout>
  );
}
