import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { ConsentSettingsButton } from '@/components/consent-banner';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{ title: <span className="font-medium">Stunt Double Docs</span> }}
      links={[{ text: 'stuntdouble.io', url: 'https://www.stuntdouble.io', external: true }]}
      sidebar={{ footer: <ConsentSettingsButton key="consent-settings" /> }}
    >
      {children}
    </DocsLayout>
  );
}
