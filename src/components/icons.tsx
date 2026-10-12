import type { ReactNode } from 'react';

/*
 * Continuity product icons, copied from StuntKit's `@stunt-double/icons` SVG
 * files (open source, `packages/icons/svg`): 24 grid, 1.5 stroke, square caps,
 * mitred joins. Where an icon stands for one of Stunt Double's own things (an
 * actor, a checklist, an interview, an automation, feedback, a worker), use
 * the product icon, never a generic robot or clipboard. Change the geometry in
 * StuntKit first, then copy it here.
 */

function Svg({ children, className = 'h-4 w-4' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const PATHS = {
  actor: (
    <>
      <path d="M3 8V3h5" />
      <path d="M16 3h5v5" />
      <path d="M21 16v5h-5" />
      <path d="M8 21H3v-5" />
      <circle cx="12" cy="9.5" r="2.5" />
      <path d="M7.5 17.5a4.5 4.5 0 0 1 9 0" />
    </>
  ),
  checklist: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8.5l1.5 1.5 3-3" />
      <path d="M14.5 9h2" />
      <rect x="8" y="13.5" width="3" height="3" />
      <path d="M14.5 15h2" />
    </>
  ),
  interview: (
    <>
      <path d="M7 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-4 4z" />
      <path d="M9.5 7v2.5L8 11" />
      <path d="M14.5 7v2.5L13 11" />
    </>
  ),
  automation: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <path d="M9 6h5" />
      <path d="M17 3l3 3-3 3-3-3z" />
      <path d="M17 9v6" />
      <rect x="14" y="15" width="6" height="6" rx="1" />
    </>
  ),
  feedback: (
    <>
      <path d="M12 3a8 8 0 0 1 0 16H4v-8a8 8 0 0 1 8-8z" />
      <path d="M8.5 9.5h7" />
      <path d="M8.5 13h4" />
    </>
  ),
  insight: (
    <>
      <path d="M9.5 21v-2a5 5 0 1 1 5 0v2z" />
      <path d="M12 3V2" />
      <path d="M5 6l-1-1" />
      <path d="M19 6l1-1" />
    </>
  ),
  worker: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" />
      <path d="M9.5 3v3" />
      <path d="M14.5 3v3" />
      <path d="M9.5 18v3" />
      <path d="M14.5 18v3" />
      <path d="M3 9.5h3" />
      <path d="M3 14.5h3" />
      <path d="M18 9.5h3" />
      <path d="M18 14.5h3" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5" />
      <path d="M15 3v5" />
      <path d="M6 8h12v4a6 6 0 0 1-12 0z" />
      <path d="M12 18v3" />
    </>
  ),
  run: (
    <>
      <path d="M9 4.5l12 7.5-12 7.5z" />
      <path d="M3 9h3" />
      <path d="M3 15h3" />
    </>
  ),
  terminal: (
    <>
      <path d="M4 17l5-5-5-5" />
      <path d="M12 19h8" />
    </>
  ),
  code: (
    <>
      <path d="M15 7l5 5-5 5" />
      <path d="M9 7l-5 5 5 5" />
    </>
  ),
  rocket: (
    <>
      <path d="M8 13l7-7c1.5-1.5 3.5-2 5-2 0 1.5-.5 3.5-2 5l-7 7z" />
      <path d="M9.5 11.5H5l3-3h4" />
      <path d="M12.5 14.5V19l3-3v-4" />
      <path d="M7 17l-3 3" />
      <circle cx="15.5" cy="8.5" r="1.5" />
    </>
  ),
  project: (
    <>
      <path d="M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      <path d="M3 13h18" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8l-2 6-6 2 2-6z" />
    </>
  ),
  book: (
    <>
      <path d="M3 4h5a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H3z" />
      <path d="M21 4h-5a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h6z" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="4" />
      <path d="M3 21v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1" />
      <path d="M15.5 4.25a4 4 0 0 1 0 7.5" />
      <path d="M18 15a3.5 3.5 0 0 1 3 3.5V21" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4" />
      <path d="M8 20h8" />
    </>
  ),
  // The Model Context Protocol mark, redrawn on the 24 grid at the set's stroke.
  mcp: (
    <>
      <path d="M2.94 11.33l8.45-8.45a3 3 0 0 1 4.23 0 3 3 0 0 1 0 4.23L9.24 13.49" />
      <path d="M9.32 13.4l6.3-6.29a3 3 0 0 1 4.23 0l.04.04a3 3 0 0 1 0 4.23l-7.64 7.64a1 1 0 0 0 0 1.41l1.57 1.57" />
      <path d="M13.51 4.99l-6.25 6.26a3 3 0 0 0 0 4.22 3 3 0 0 0 4.22 0l6.25-6.25" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
} as const;

export type ProductIconName = keyof typeof PATHS;

export function isProductIcon(name: string): name is ProductIconName {
  return Object.hasOwn(PATHS, name);
}

export function ProductIcon({ name, className }: { name: ProductIconName; className?: string }) {
  return <Svg className={className}>{PATHS[name]}</Svg>;
}
