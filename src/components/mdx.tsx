import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { docsHref } from '@/lib/links';

/**
 * The blocks the docs and guides MDX uses, ported from the marketing site
 * (`content-blocks.tsx`, `guide-visuals.tsx`, `mdx-blocks.tsx`) with the same
 * classes, drawn from the Continuity tokens in `global.css`. All are
 * server-safe (no hooks). Hairlines, not cards, and none of them spends the
 * page's arc.
 */

/* Continuity icons, from StuntKit's `@stunt-double/icons` SVG files (open
   source): 24 grid, 1.5 stroke, square caps, mitred joins. */
function Icon({ children, className = 'h-4 w-4' }: { children: ReactNode; className?: string }) {
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

const UsersIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <circle cx="9.5" cy="8" r="4" />
    <path d="M3 21v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1" />
    <path d="M15.5 4.25a4 4 0 0 1 0 7.5" />
    <path d="M18 15a3.5 3.5 0 0 1 3 3.5V21" />
  </Icon>
);
const LightbulbIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M9 18v-2.73A6.5 6.5 0 1 1 15 15.27V18z" />
    <path d="M10 21h4" />
  </Icon>
);
const InfoIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <rect x="10.75" y="6.75" width="2.5" height="2.5" fill="currentColor" stroke="none" />
  </Icon>
);
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M4 12h16" />
    <path d="M14 6l6 6-6 6" />
  </Icon>
);
const RotateCwIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M20 12a8 8 0 1 1-2.35-5.65L20 9" />
    <path d="M20 4v5h-5" />
  </Icon>
);

const CALLOUT_VARIANTS = {
  who: { Icon: UsersIcon, label: 'Who this is for' },
  tip: { Icon: LightbulbIcon, label: 'Tip' },
  note: { Icon: InfoIcon, label: 'Note' },
} as const;

/** An aside between hairlines, with a sans title and a quiet icon on a foreground tint. */
export function Callout({
  variant = 'note',
  title,
  children,
}: {
  variant?: keyof typeof CALLOUT_VARIANTS;
  title?: string;
  children: ReactNode;
}) {
  const { Icon: VariantIcon, label } = CALLOUT_VARIANTS[variant];
  return (
    <aside className="not-prose border-border/60 my-10 border-y py-5">
      <div className="text-foreground flex items-center gap-2">
        <VariantIcon className="text-foreground/70 h-4 w-4" />
        <span className="text-sm font-medium">{title ?? label}</span>
      </div>
      <div className="text-muted-foreground mt-2 text-[0.9375rem] leading-relaxed">{children}</div>
    </aside>
  );
}

/** Keep the arrow on the same line as the last word, so it never strands at the row's edge. */
function labelWithArrow(label: string, arrow: ReactNode) {
  const split = label.lastIndexOf(' ');
  const head = split === -1 ? '' : label.slice(0, split + 1);
  const tail = split === -1 ? label : label.slice(split + 1);
  return (
    <>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        {arrow}
      </span>
    </>
  );
}

export interface CardGridItem {
  title: string;
  description: string;
  href: string;
}

/** A hub page's "read next" list: hairline rows, each whole row a link, the arrow nudging on hover. */
export function CardGrid({ items, columns = 2 }: { items: CardGridItem[]; columns?: 2 | 3 }) {
  return (
    <ul
      className={`not-prose border-border/60 my-10 grid gap-x-10 border-t ${
        columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'
      }`}
    >
      {items.map((item) => (
        <li key={item.href} className="border-border/60 border-b">
          <Link href={docsHref(item.href)} className="group flex flex-col py-4">
            <span className="text-foreground text-sm font-medium underline-offset-4 group-hover:underline">
              {labelWithArrow(
                item.title,
                <ArrowRightIcon className="text-foreground/60 ease-snap ml-1.5 inline-block h-3.5 w-3.5 align-[-0.125em] transition-transform duration-(--duration-quick) group-hover:translate-x-1 motion-reduce:transition-none" />
              )}
            </span>
            <span className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {item.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** A pipeline of numbered steps, side by side from `sm`, stacked below it. The mono numbers carry the order. */
export function FlowStrip({
  nodes,
  loop = false,
}: {
  nodes: { label: string; sub?: string }[];
  loop?: boolean;
}) {
  return (
    <div className="not-prose my-10">
      <ol className="border-border/60 divide-border/60 flex flex-col divide-y border-y sm:flex-row sm:divide-x sm:divide-y-0">
        {nodes.map((node, i) => (
          <li
            key={node.label}
            className="flex flex-1 flex-col py-4 sm:px-4 sm:first:pl-0 sm:last:pr-0"
          >
            <span className="text-foreground/60 mb-2 font-mono text-xs tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-foreground text-sm leading-snug font-medium">{node.label}</span>
            {node.sub && (
              <span className="text-muted-foreground mt-1 text-xs leading-snug">{node.sub}</span>
            )}
          </li>
        ))}
      </ol>
      {loop && (
        <p className="text-muted-foreground mt-3 inline-flex items-center gap-1.5 font-mono text-xs">
          <RotateCwIcon className="text-foreground/60 h-3 w-3" />
          Repeat each round
        </p>
      )}
    </div>
  );
}

/** The roles or surfaces a guide touches, as a three-column set divided by hairlines. */
export function RoleGrid({ items }: { items: { role: string; gets: string }[] }) {
  return (
    <div className="not-prose border-border/60 divide-border/60 my-10 grid divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {items.map((item) => (
        <div key={item.role} className="py-4 sm:px-4 sm:pt-5 sm:first:pl-0 sm:last:pr-0">
          <div className="text-foreground text-sm font-medium">{item.role}</div>
          <div className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{item.gets}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * A typographic pull quote: serif italic at leading 1.3 (italic serif means
 * someone said it), the opening mark hung in the margin, the source beneath
 * as a mono record line.
 */
export function Pullquote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="not-prose my-12 sm:my-14">
      <blockquote className="text-foreground relative font-serif text-2xl leading-[1.3] font-normal tracking-[-0.01em] text-balance italic sm:text-3xl">
        <div className="[&>p]:inline">
          <span aria-hidden="true" className="absolute -translate-x-[0.5em] select-none">
            &ldquo;
          </span>
          {children}
          <span aria-hidden="true">&rdquo;</span>
        </div>
      </blockquote>
      {cite && (
        <figcaption className="text-muted-foreground mt-4 font-mono text-xs">{cite}</figcaption>
      )}
    </figure>
  );
}

/** A quiet strip of contour lines between long sections. */
export function TextureBreak() {
  return (
    <div className="not-prose my-12" aria-hidden="true">
      <svg
        viewBox="0 0 600 60"
        className="text-foreground/40 mx-auto h-20 w-full max-w-xl sm:h-16"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          {Array.from({ length: 6 }).map((_, i) => {
            const y = 10 + i * 8;
            let d = `M 0 ${y}`;
            for (let x = 0; x <= 600; x += 12) {
              d += ` L ${x} ${y + Math.sin(x * 0.02 + i * 0.6) * (3 + i * 0.6)}`;
            }
            return <path key={i} d={d} strokeOpacity={0.55 - i * 0.07} />;
          })}
        </g>
      </svg>
    </div>
  );
}

function DocsLink({ href, ...props }: ComponentProps<'a'>) {
  const A = defaultMdxComponents.a as (p: ComponentProps<'a'>) => ReactNode;
  return <A href={href ? docsHref(href) : href} {...props} />;
}

/** The page title, in the display face (`.sd-title` in `global.css`). */
function H1({ className, ...props }: ComponentProps<'h1'>) {
  return <h1 className={`sd-title ${className ?? ''}`} {...props} />;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    a: DocsLink,
    h1: H1,
    Callout,
    CardGrid,
    FlowStrip,
    RoleGrid,
    Pullquote,
    TextureBreak,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
