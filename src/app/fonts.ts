import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare } from 'geist/font/pixel';
import { GeistSans } from 'geist/font/sans';

// Every face here is open (SIL OFL) and ships from the `geist` package, so the
// public repo carries no licensed font. Continuity's own faces map as:
//   Untitled Sans (licensed)  -> Geist Sans: body, UI, navigation
//   Geist Mono                -> Geist Mono: counts, steps, code
//   Geist Pixel               -> Geist Pixel Square: the page title, once
// Untitled Serif and Tiempos are licensed and not loaded; `--font-serif`
// falls through to the token's own system serifs.
export { GeistMono, GeistPixelSquare, GeistSans };
