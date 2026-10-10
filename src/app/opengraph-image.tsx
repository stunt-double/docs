import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// The site's Open Graph card, rendered once at build. Continuity hex hand-offs
// (docs/BRAND-KIT.md in the design system): Satori cannot read CSS variables.
const INK = '#0e1119';
const PAPER = '#f8fafd';
const ARC = '#3555e5';
const BLOOM = '#dce6fe';
const MUTED = '#545862';

// The Stunt Double glyph on its 256 grid, copied exactly from the design
// system's `StuntDoubleIcon`. Never redrawn.
const GLYPH_PATH =
  'M163.224 224.64L163.238 224.971L163.569 224.971C201.926 224.971 224.146 193.162 225.175 160.403C225.69 144.019 221.009 127.692 210.422 115.52C201.757 105.559 189.157 98.404 172.269 96.2677L224.87 96.1092L225.215 96.1081L225.215 95.7632C225.215 77.5582 219.34 61.2434 208.28 49.4769C197.217 37.7071 180.99 30.5153 160.343 30.5153L159.997 30.5153L159.997 30.8613L159.997 95.5558C159.902 95.5408 159.79 95.5229 159.662 95.5017C159.184 95.4228 158.482 95.2998 157.588 95.1234C155.8 94.7707 153.244 94.2051 150.175 93.3538C144.037 91.6509 135.856 88.807 127.679 84.2437C111.327 75.1186 95.0229 59.1433 95.0229 31.6707L95.0229 31.3248L94.6769 31.3248C69.5368 31.3248 53.5708 41.6415 43.9005 54.7818C34.2439 67.9034 30.8814 83.8165 30.8804 95.023C30.8804 95.0247 30.8804 95.0263 30.8804 95.028L30.8802 95.0309L30.8793 95.0675C30.879 95.083 30.8786 95.102 30.8782 95.1246C30.8778 95.1488 30.8773 95.1771 30.8769 95.2093C30.8752 95.3339 30.8739 95.5179 30.8749 95.7573C30.8769 96.2362 30.8886 96.9371 30.9271 97.8283C31.0041 99.6107 31.1882 102.155 31.617 105.21C32.4743 111.317 34.3106 119.471 38.2294 127.647C42.149 135.825 48.1549 144.031 57.3516 150.227C64.4203 154.989 73.3614 158.555 84.6657 160.015C78.1764 159.986 71.0264 159.939 63.8602 159.892L63.3384 159.889C51.677 159.812 40.0139 159.737 31.1292 159.738L30.7833 159.738L30.7833 160.084C30.7833 197.225 63.5228 225.485 95.5432 225.485L95.8892 225.485L95.8892 225.139L95.8892 160.737C128.164 160.85 144.974 176.767 153.736 192.675C158.138 200.666 160.511 208.661 161.783 214.66C162.419 217.659 162.779 220.157 162.981 221.905C163.081 222.778 163.142 223.464 163.178 223.93C163.196 224.163 163.207 224.342 163.214 224.461C163.218 224.521 163.22 224.566 163.222 224.596L163.223 224.63L163.224 224.638L163.224 224.639C163.224 224.64 163.224 224.64 163.569 224.625L163.224 224.64ZM159.999 96.2988L160.437 160.081L95.9215 160.045C95.9616 159.409 95.9869 158.242 96.0019 156.681C96.021 154.685 96.0232 152.011 96.0129 148.894C95.9923 142.66 95.9218 134.65 95.8369 126.742C95.752 118.834 95.6527 111.026 95.5746 105.196C95.5356 102.28 95.5019 99.8594 95.4779 98.1672C95.466 97.3211 95.4564 96.6572 95.4499 96.2048L95.4449 95.8645L95.7225 95.8661L97.514 95.8759C99.0619 95.8845 101.284 95.8969 103.979 95.9122C109.369 95.9428 116.653 95.9851 124.228 96.0317C139.03 96.1226 154.94 96.2299 159.999 96.2988Z';

export const alt = 'Stunt Double Docs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MONO = {
  display: 'flex',
  fontFamily: 'Geist Mono',
  fontSize: 15,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: MUTED,
} as const;

export default async function OpengraphImage() {
  // Open faces from the `geist` package, as TTF (Satori reads no WOFF2). Static
  // literal paths, so the file tracer bundles exactly these files.
  const [sans, mono] = await Promise.all([
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf')),
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf')),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 72,
        position: 'relative',
        fontFamily: 'Geist',
        // One lamp, top left; it fades to bloom at zero alpha, never transparent.
        background: `radial-gradient(ellipse 70% 55% at 28% 20%, ${BLOOM} 0%, rgba(220, 230, 254, 0) 60%), linear-gradient(180deg, ${PAPER} 0%, #edf0f6 100%)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width="52" height="52" viewBox="0 0 256 256" fill="none">
          <path d={GLYPH_PATH} fill={INK} />
        </svg>
        <div style={{ ...MONO, alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', width: 8, height: 8, background: ARC }} />
          Docs
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 96 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 88,
            lineHeight: 1,
            letterSpacing: '-0.025em',
            color: INK,
          }}
        >
          Stunt Double Docs
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            maxWidth: 900,
            fontSize: 28,
            lineHeight: 1.45,
            color: '#383d48',
          }}
        >
          Create actors, automate checklists, run user interviews, and drive it all from the API.
        </div>
      </div>

      <div
        style={{
          ...MONO,
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 56,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ display: 'flex' }}>docs.stuntdouble.io</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'flex', width: 44, height: 1, background: `${INK}33` }} />
          <span>stuntdouble.io</span>
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: sans, weight: 400, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
      ],
    }
  );
}
