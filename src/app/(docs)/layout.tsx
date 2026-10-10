import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{ title: <span className="font-medium">Stunt Double Docs</span> }}
      links={[{ text: 'stuntdouble.io', url: 'https://www.stuntdouble.io', external: true }]}
    >
      {children}
    </DocsLayout>
  );
}
