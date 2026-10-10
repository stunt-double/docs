import { GoogleAnalytics } from '@next/third-parties/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { ConsentBanner } from '@/components/consent-banner';
import { CONSENT_DEFAULTS_SCRIPT } from '@/lib/consent';
import { SITE_URL } from '@/lib/source';
import './global.css';

// Set on Production only, so previews and local dev stay out of the reports. The id is public.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: { default: 'Stunt Double Docs', template: '%s | Stunt Double Docs' },
  description:
    'Learn how Stunt Double works: create AI actors, automate verification checklists, run user interviews, and drive it all from the API.',
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        {/* Consent defaults: must run before gtag's config, so parser-blocking inline. */}
        {GA_MEASUREMENT_ID ? (
          <script id="consent-defaults" dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }} />
        ) : null}
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <RootProvider>{children}</RootProvider>
        {GA_MEASUREMENT_ID ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
        <ConsentBanner />
      </body>
    </html>
  );
}
