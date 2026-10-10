import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { ProductIcon, type ProductIconName } from '@/components/icons';
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
  /** A Continuity product icon, for hub pages where each row is one of Stunt Double's own things. */
  icon?: ProductIconName;
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
            {item.icon && (
              <ProductIcon name={item.icon} className="text-foreground/70 mb-3 h-5 w-5" />
            )}
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

/**
 * A product screen, redrawn faithfully in Figma ("Docs screenshots") from the
 * shipped dashboard and exported in both themes to `public/screens/`. The
 * light and dark files swap with the site theme, click to zoom, and the
 * caption carries a mono figure number (`.sd-figure` in `global.css`). The
 * screen is the evidence, so the frame is one hairline and nothing else.
 */
export function Screenshot({
  name,
  alt,
  caption,
  width = 1440,
  height = 900,
}: {
  /** File stem in `public/screens/`: `<name>-light.png` and `<name>-dark.png`. */
  name: string;
  alt: string;
  caption?: ReactNode;
  width?: number;
  height?: number;
}) {
  const img = (theme: 'light' | 'dark', className: string) => (
    <ImageZoom
      src={`/screens/${name}-${theme}.png`}
      alt={alt}
      width={width}
      height={height}
      sizes="(min-width: 1024px) 760px, 100vw"
      className={`m-0! block w-full rounded-none! ${className}`}
    />
  );
  return (
    <figure className="sd-figure not-prose my-10">
      <div className="border-border overflow-hidden rounded-lg border">
        {img('light', 'dark:hidden')}
        {img('dark', 'hidden dark:block')}
      </div>
      {caption && (
        <figcaption className="text-muted-foreground mt-3 flex gap-3 text-sm leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Numbered steps on a hairline rail. The mono numbers (`01`, `02`) carry the
 * order, so a step's own heading never repeats it. Write each step's title as
 * a `###` heading so it lands in the table of contents.
 */
export function Steps({ children }: { children: ReactNode }) {
  return <div className="sd-steps">{children}</div>;
}

export function Step({ children }: { children: ReactNode }) {
  return <div className="sd-step">{children}</div>;
}

/**
 * The facts a reader checks before committing to a page (how long, which
 * plan, who can do it), as one mono record line between hairlines.
 */
export function PageFacts({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="not-prose border-border/60 divide-border/60 my-8 grid grid-cols-2 divide-x border-y sm:flex">
      {items.map((item) => (
        <div key={item.label} className="py-3 pr-4 pl-4 first:pl-0 sm:flex-1">
          <dt className="text-muted-foreground font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
            {item.label}
          </dt>
          <dd className="text-foreground mt-1 text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const CONCEPT_WORK: { icon: ProductIconName; name: string; does: string; href: string }[] = [
  {
    icon: 'checklist',
    name: 'Checklist',
    does: 'Verifies a flow, check by check',
    href: '/concepts#checklists',
  },
  {
    icon: 'interview',
    name: 'Interview',
    does: 'Reports how personas got on',
    href: '/concepts#interviews',
  },
  {
    icon: 'automation',
    name: 'Automation',
    does: 'Runs both on a schedule or event',
    href: '/concepts#workflows',
  },
];

/**
 * How the building blocks nest, drawn as hairline tiers: where things live,
 * who does the work, the work they do, and what comes back. Each tier links
 * to its section of Core concepts.
 */
export function ConceptMap() {
  const tier = 'border-border/60 border-b py-4 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6';
  const label =
    'text-muted-foreground mb-2 block font-mono text-[0.6875rem] tracking-[0.12em] uppercase sm:mb-0 sm:pt-0.5';
  const chip = 'text-foreground inline-flex items-center gap-2 text-sm font-medium';
  return (
    <div className="not-prose border-border/60 my-10 border-t" role="figure" aria-label="How Stunt Double's building blocks fit together">
      <div className={tier}>
        <span className={label}>Where</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link href="/concepts#workspaces-and-projects" className={chip}>
            <ProductIcon name="users" className="text-foreground/70 h-4 w-4" />
            Workspace
          </Link>
          <span className="text-muted-foreground font-mono text-xs" aria-hidden="true">
            /
          </span>
          <Link href="/concepts#workspaces-and-projects" className={chip}>
            <ProductIcon name="project" className="text-foreground/70 h-4 w-4" />
            Project
          </Link>
          <span className="text-muted-foreground text-sm">your team, then one product or surface</span>
        </div>
      </div>
      <div className={tier}>
        <span className={label}>Who</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link href="/concepts#actors" className={chip}>
            <ProductIcon name="actor" className="text-foreground/70 h-4 w-4" />
            Actor
          </Link>
          <span className="text-muted-foreground text-sm">
            an AI user with instructions and knowledge, driving a real browser
          </span>
        </div>
      </div>
      <div className={tier}>
        <span className={label}>Work</span>
        <ul className="grid gap-3 sm:grid-cols-3">
          {CONCEPT_WORK.map((w) => (
            <li key={w.name}>
              <Link href={w.href} className={chip}>
                <ProductIcon name={w.icon} className="text-foreground/70 h-4 w-4" />
                {w.name}
              </Link>
              <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">{w.does}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={tier}>
        <span className={label}>Evidence</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link href="/concepts#recordings-and-replays" className={chip}>
            <ProductIcon name="run" className="text-foreground/70 h-4 w-4" />
            Run
          </Link>
          <span className="text-muted-foreground text-sm">recording, screenshots and steps, which roll up into</span>
          <Link href="/concepts#insights" className={chip}>
            <ProductIcon name="insight" className="text-foreground/70 h-4 w-4" />
            Insights
          </Link>
        </div>
      </div>
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
    Screenshot,
    Steps,
    Step,
    PageFacts,
    ConceptMap,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
