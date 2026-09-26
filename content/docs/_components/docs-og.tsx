import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { blogArtSvg } from '../../../blog/components/blog-art';
import { docsNav } from '../_lib/nav';

/**
 * Shared social card for every documentation page.
 *
 * Support docs used to inherit the generic site card, so a shared doc link
 * looked identical whatever page it pointed at. This renders a per-page card
 * that carries the doc's own title and deck, seeded with the page's own
 * generative mark, so it reads the same way the blog and guides cards do and a
 * reader can tell what the link is before they open it.
 *
 * Lives in `_components` (a shared helper, like the blog's `og-card.tsx`)
 * rather than in one route's `opengraph-image.tsx`, because every doc route
 * serves the same composition and only the looked-up copy changes. The
 * font/background `readFile` paths must stay static string literals here so
 * Turbopack's file tracer can bundle the assets into each route's lambda; a
 * helper taking a filename would trace the whole monorepo in (see the note on
 * the root OG route).
 */
export const DOCS_OG_SIZE = { width: 1200, height: 630 };

const INK = '#0e1119';
const PAPER_BACKGROUND =
  'radial-gradient(ellipse 70% 55% at 28% 20%, #dce6fe 0%, rgba(220, 230, 254, 0) 60%), linear-gradient(180deg, #f8fafd 0%, #edf0f5 100%)';

// Mirror the path style used by the blog/guide OG routes so Turbopack's file
// tracer can statically bundle the font/image assets into the lambda.
const LOGO_PATH =
  'M163.224 224.64L163.238 224.971L163.569 224.971C201.926 224.971 224.146 193.162 225.175 160.403C225.69 144.019 221.009 127.692 210.422 115.52C201.757 105.559 189.157 98.404 172.269 96.2677L224.87 96.1092L225.215 96.1081L225.215 95.7632C225.215 77.5582 219.34 61.2434 208.28 49.4769C197.217 37.7071 180.99 30.5153 160.343 30.5153L159.997 30.5153L159.997 30.8613L159.997 95.5558C159.902 95.5408 159.79 95.5229 159.662 95.5017C159.184 95.4228 158.482 95.2998 157.588 95.1234C155.8 94.7707 153.244 94.2051 150.175 93.3538C144.037 91.6509 135.856 88.807 127.679 84.2437C111.327 75.1186 95.0229 59.1433 95.0229 31.6707L95.0229 31.3248L94.6769 31.3248C69.5368 31.3248 53.5708 41.6415 43.9005 54.7818C34.2439 67.9034 30.8814 83.8165 30.8804 95.023C30.8804 95.0247 30.8804 95.0263 30.8804 95.028L30.8802 95.0309L30.8793 95.0675C30.879 95.083 30.8786 95.102 30.8782 95.1246C30.8778 95.1488 30.8773 95.1771 30.8769 95.2093C30.8752 95.3339 30.8739 95.5179 30.8749 95.7573C30.8769 96.2362 30.8886 96.9371 30.9271 97.8283C31.0041 99.6107 31.1882 102.155 31.617 105.21C32.4743 111.317 34.3106 119.471 38.2294 127.647C42.149 135.825 48.1549 144.031 57.3516 150.227C64.4203 154.989 73.3614 158.555 84.6657 160.015C78.1764 159.986 71.0264 159.939 63.8602 159.892L63.3384 159.889C51.677 159.812 40.0139 159.737 31.1292 159.738L30.7833 159.738L30.7833 160.084C30.7833 197.225 63.5228 225.485 95.5432 225.485L95.8892 225.485L95.8892 225.139L95.8892 160.737C128.164 160.85 144.974 176.767 153.736 192.675C158.138 200.666 160.511 208.661 161.783 214.66C162.419 217.659 162.779 220.157 162.981 221.905C163.081 222.778 163.142 223.464 163.178 223.93C163.196 224.163 163.207 224.342 163.214 224.461C163.218 224.521 163.22 224.566 163.222 224.596L163.223 224.63L163.224 224.638L163.224 224.639C163.224 224.64 163.224 224.64 163.569 224.625L163.224 224.64ZM159.999 96.2988L160.437 160.081L95.9215 160.045C95.9616 159.409 95.9869 158.242 96.0019 156.681C96.021 154.685 96.0232 152.011 96.0129 148.894C95.9923 142.66 95.9218 134.65 95.8369 126.742C95.752 118.834 95.6527 111.026 95.5746 105.196C95.5356 102.28 95.5019 99.8594 95.4779 98.1672C95.466 97.3211 95.4564 96.6572 95.4499 96.2048L95.4449 95.8645L95.7225 95.8661L97.514 95.8759C99.0619 95.8845 101.284 95.8969 103.979 95.9122C109.369 95.9428 116.653 95.9851 124.228 96.0317C139.03 96.1226 154.94 96.2299 159.999 96.2988Z';

// Hairline trim marks at the four corners, as on the homepage card: the card's
// one motif, in place of a rounded frame. Each corner names only the edges it
// draws, so no style value is ever `undefined` (Satori throws on one).
const TRIM = '2px solid #0e1119';
const TRIM_MARKS = [
  { top: 32, left: 32, borderTop: TRIM, borderLeft: TRIM },
  { top: 32, right: 32, borderTop: TRIM, borderRight: TRIM },
  { bottom: 32, left: 32, borderBottom: TRIM, borderLeft: TRIM },
  { bottom: 32, right: 32, borderBottom: TRIM, borderRight: TRIM },
].map((pos, i) => (
  <div
    key={i}
    style={{ position: 'absolute', width: 18, height: 18, opacity: 0.7, display: 'flex', ...pos }}
  />
));

type FontWeight = 400 | 500;

interface DocMeta {
  title: string;
  description: string;
  section: string;
}

/**
 * Resolve a doc page's card copy from the navigation tree, the same source the
 * sidebar and sitemap read, so a title only ever lives in one place. Falls back
 * to the section-level heading if a page has no registered entry.
 */
function resolveDoc(href: string): DocMeta {
  for (const section of docsNav) {
    const link = section.links.find((l) => l.href === href);
    if (link) {
      return {
        title: link.title,
        description: link.description ?? 'Documentation, tutorials and guides for Stunt Double.',
        section: section.title,
      };
    }
  }
  return {
    title: 'Documentation',
    description: 'Documentation, tutorials and guides for Stunt Double.',
    section: 'Support',
  };
}

/**
 * Render the documentation social card for the page at `href`.
 *
 * Guarded end to end: a malformed seed, a missing font, or a satori fault all
 * degrade to a text-free logo card rather than 500-ing the route, so the image
 * URL a crawler already holds is never unreachable.
 */
export async function renderDocsOgImage(href: string) {
  const size = DOCS_OG_SIZE;
  const { title, description, section } = resolveDoc(href);

  // Per-page generative mark, seeded on the page path so each doc card is
  // distinct and stable across builds. Guarded so a rendering fault can never
  // throw the route; we degrade to the logo-only fallback below.
  let artDataUrl: string | undefined;
  try {
    artDataUrl = `data:image/svg+xml;base64,${Buffer.from(
      blogArtSvg(href, { width: 520, height: 520, ink: INK })
    ).toString('base64')}`;
  } catch {
    // Keep the defaults and let the composition fall back gracefully.
  }

  const [
    bgDataUrl,
    tiemposRegular,
    tiemposRegularItalic,
    untitledRegular,
    untitledMedium,
    geistMonoRegular,
  ] = await Promise.all([
      readFile(join(process.cwd(), 'public', 'og', 'bg-default.png'))
        .then((buf) => `data:image/png;base64,${buf.toString('base64')}`)
        .catch(() => undefined),
      readFile(join(process.cwd(), 'public', 'og-fonts', 'tiempos-headline-regular.ttf')).catch(
        () => undefined
      ),
      readFile(
        join(process.cwd(), 'public', 'og-fonts', 'tiempos-headline-regular-italic.ttf')
      ).catch(() => undefined),
      readFile(join(process.cwd(), 'public', 'og-fonts', 'untitled-sans-regular.ttf')).catch(
        () => undefined
      ),
      readFile(join(process.cwd(), 'public', 'og-fonts', 'untitled-sans-medium.ttf')).catch(
        () => undefined
      ),
      readFile(join(process.cwd(), 'public', 'og-fonts', 'geist-mono-regular.ttf')).catch(
        () => undefined
      ),
    ]);

  const fontCandidates: {
    name: string;
    data: Buffer | undefined;
    weight: FontWeight;
    style: 'normal' | 'italic';
  }[] = [
    { name: 'Untitled Sans', data: untitledRegular, weight: 400, style: 'normal' },
    { name: 'Untitled Sans', data: untitledMedium, weight: 500, style: 'normal' },
    { name: 'Tiempos Headline', data: tiemposRegular, weight: 400, style: 'normal' },
    { name: 'Tiempos Headline', data: tiemposRegularItalic, weight: 400, style: 'italic' },
    { name: 'Geist Mono', data: geistMonoRegular, weight: 400, style: 'normal' },
  ];
  const fonts = fontCandidates.filter(
    (f): f is { name: string; data: Buffer; weight: FontWeight; style: 'normal' | 'italic' } =>
      f.data !== undefined
  );

  const fallback = (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: PAPER_BACKGROUND,
      }}
    >
      {artDataUrl ? (
        <img
          src={artDataUrl}
          width={size.height}
          height={size.height}
          style={{ position: 'absolute', opacity: 0.5, objectFit: 'contain' }}
          alt=""
        />
      ) : null}
      {TRIM_MARKS}
      <svg width="180" height="180" viewBox="0 0 256 256" fill="none">
        <path d={LOGO_PATH} fill={INK} />
      </svg>
    </div>
  );

  if (fonts.length === 0) {
    return new ImageResponse(fallback, size);
  }

  const card = (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '72px',
        position: 'relative',
        fontFamily: 'Untitled Sans',
        background: PAPER_BACKGROUND,
      }}
    >
      {bgDataUrl ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage: `url(${bgDataUrl})`,
            backgroundSize: '1200px 630px',
            opacity: 0.1,
            mixBlendMode: 'multiply',
          }}
        />
      ) : null}

      {TRIM_MARKS}

      {/* SD mark + overline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
        <svg width="48" height="48" viewBox="0 0 256 256" fill="none">
          <path d={LOGO_PATH} fill={INK} />
        </svg>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'Geist Mono',
            fontSize: 15,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#545862',
          }}
        >
          Documentation
        </div>
      </div>

      {/* Title + hero graphic, side by side. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '48px',
          marginTop: '44px',
          position: 'relative',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: title.length > 42 ? 50 : 60,
              fontWeight: 400,
              color: INK,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              fontFamily: 'Tiempos Headline',
              display: 'flex',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#545862',
              marginTop: '24px',
              lineHeight: 1.45,
              display: 'flex',
            }}
          >
            {description}
          </div>
        </div>

        {artDataUrl ? (
          <img
            src={artDataUrl}
            width={520}
            height={520}
            style={{ width: '360px', height: '360px', objectFit: 'contain', flexShrink: 0 }}
            alt=""
          />
        ) : null}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '56px',
          left: '72px',
          right: '72px',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Geist Mono',
          fontSize: 15,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#545862',
        }}
      >
        <span style={{ display: 'flex' }}>{section}</span>
        <span style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span
            style={{ display: 'flex', width: '44px', height: '1px', background: '#0e111933' }}
          />
          <span>stuntdouble.io/support</span>
        </span>
      </div>
    </div>
  );

  try {
    return new ImageResponse(card, { ...size, fonts });
  } catch (error) {
    console.error(`[docs] OG image render failed for "${href}"; serving fallback card:`, error);
    return new ImageResponse(fallback, size);
  }
}
