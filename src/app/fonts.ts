import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

// Every face here is open (SIL OFL), so the public repo carries no licensed font.
// Continuity's faces map as:
//   Untitled Sans (licensed)  -> Geist Sans: body, UI, navigation
//   Geist Mono                -> Geist Mono: counts, steps, code
//   Space Grotesk             -> Space Grotesk 400: the page title, once per page
// Untitled Serif and Tiempos are licensed and not loaded; `--font-serif`
// falls through to the token's own system serifs.
// Space Grotesk is copied from packages/ui/public/fonts (licence alongside).
export const SpaceGrotesk = localFont({
  src: '../../public/fonts/space-grotesk-regular.woff2',
  variable: '--font-space-grotesk',
  weight: '400',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
});

export { GeistMono, GeistSans };
