import { GoogleAnalytics } from '@next/third-parties/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { ConsentBanner } from '@/components/consent-banner';
import { JsonLd } from '@/components/json-ld';
import { DocsSearchDialog, OpenSearchFromUrl } from '@/components/search';
import { CONSENT_DEFAULTS_SCRIPT } from '@/lib/consent';
import { SITE_URL } from '@/lib/source';
import { GeistMono, GeistSans, SpaceGrotesk } from './fonts';
import './global.css';

// Set on Production only, so previews and local dev stay out of the reports. The id is public.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: { default: 'Stunt Double Docs', template: '%s | Stunt Double Docs' },
  description:
    'Learn how Stunt Double works: create AI actors, automate verification checklists, run user interviews, and drive it all from the API.',
  metadataBase: new URL(SITE_URL),
  // Page-level metadata sets only title, description and the canonical, so
  // these carry through. The card itself is `opengraph-image.tsx`.
  openGraph: { type: 'website', siteName: 'Stunt Double Docs', locale: 'en_US', url: SITE_URL },
  twitter: { card: 'summary_large_image', site: '@stuntdouble' },
};

// Paper in light, midnight in dark (Continuity hex hand-offs).
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafd' },
    { media: '(prefers-color-scheme: dark)', color: '#07090f' },
  ],
};

const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.stuntdouble.io/#organization',
  name: 'Stunt Double',
  url: 'https://www.stuntdouble.io',
  logo: `${SITE_URL}/icon-512.png`,
  sameAs: ['https://github.com/stunt-double', 'https://x.com/stuntdouble'],
};

// The search target is the docs search dialog, which opens on `?q=`.
const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Stunt Double Docs',
  url: SITE_URL,
  inLanguage: 'en-US',
  publisher: { '@id': 'https://www.stuntdouble.io/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Font variables sit on <html>, where the `@theme` tokens that read them resolve.
    <html
      lang="en-US"
      className={`${GeistSans.variable} ${GeistMono.variable} ${SpaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Consent defaults: must run before gtag's config, so parser-blocking inline. */}
        {GA_MEASUREMENT_ID ? (
          <script
            id="consent-defaults"
            dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }}
          />
        ) : null}
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <JsonLd data={ORGANIZATION} />
        <JsonLd data={WEBSITE} />
        <RootProvider search={{ SearchDialog: DocsSearchDialog }}>
          <OpenSearchFromUrl />
          {children}
        </RootProvider>
        {GA_MEASUREMENT_ID ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
        <ConsentBanner />
      </body>
    </html>
  );
}
