import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { SITE_URL } from '@/lib/source';
import './global.css';

export const metadata: Metadata = {
  title: { default: 'Stunt Double Docs', template: '%s | Stunt Double Docs' },
  description:
    'Learn how Stunt Double works: create AI actors, automate verification checklists, run user interviews, and drive it all from the API.',
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
