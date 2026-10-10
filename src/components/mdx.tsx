import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { docsHref } from '@/lib/links';

/**
 * The blocks the docs and guides MDX uses, ported from the marketing site as
 * plain markup styled in `global.css` with CSS variables. All are server-safe
 * (no hooks), take `currentColor` for ink, and follow the Fumadocs theme.
 */

const icon = (d: string) =>
  function Icon() {
    return (
      <svg
        className="sd-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
    );
  };

const UsersIcon = icon(
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'
);
const LightbulbIcon = icon(
  'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2'
);
const InfoIcon = icon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 16v-4M12 8h.01');
const ArrowIcon = icon('M5 12h14M13 6l6 6-6 6');
const RepeatIcon = icon('M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5');

const CALLOUT_VARIANTS = {
  who: { Icon: UsersIcon, label: 'Who this is for' },
  tip: { Icon: LightbulbIcon, label: 'Tip' },
  note: { Icon: InfoIcon, label: 'Note' },
} as const;

/** An aside between hairlines, with a title and a quiet icon. */
export function Callout({
  variant = 'note',
  title,
  children,
}: {
  variant?: keyof typeof CALLOUT_VARIANTS;
  title?: string;
  children: ReactNode;
}) {
  const { Icon, label } = CALLOUT_VARIANTS[variant];
  return (
    <aside className="sd-block sd-callout not-prose">
      <div className="sd-callout-title">
        <Icon />
        <span>{title ?? label}</span>
      </div>
      <div className="sd-callout-body">{children}</div>
    </aside>
  );
}

export interface CardGridItem {
  title: string;
  description: string;
  href: string;
}

/** A hub page's "read next" list: hairline rows, each whole row a link. */
export function CardGrid({ items, columns = 2 }: { items: CardGridItem[]; columns?: 2 | 3 }) {
  return (
    <ul className="sd-block sd-cardgrid not-prose" data-columns={columns}>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={docsHref(item.href)} className="sd-card">
            <span className="sd-card-title">
              {item.title}
              <ArrowIcon />
            </span>
            <span className="sd-card-description">{item.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** A pipeline of numbered steps, side by side from `sm`, stacked below it. */
export function FlowStrip({
  nodes,
  loop = false,
}: {
  nodes: { label: string; sub?: string }[];
  loop?: boolean;
}) {
  return (
    <div className="sd-block not-prose">
      <ol className="sd-flow">
        {nodes.map((node, i) => (
          <li key={node.label}>
            <span className="sd-flow-number">{String(i + 1).padStart(2, '0')}</span>
            <span className="sd-flow-label">{node.label}</span>
            {node.sub && <span className="sd-flow-sub">{node.sub}</span>}
          </li>
        ))}
      </ol>
      {loop && (
        <p className="sd-flow-loop">
          <RepeatIcon />
          Repeat each round
        </p>
      )}
    </div>
  );
}

/** The roles or surfaces a guide touches, as a three-column set divided by hairlines. */
export function RoleGrid({ items }: { items: { role: string; gets: string }[] }) {
  return (
    <div className="sd-block sd-rolegrid not-prose">
      {items.map((item) => (
        <div key={item.role}>
          <div className="sd-role">{item.role}</div>
          <div className="sd-role-gets">{item.gets}</div>
        </div>
      ))}
    </div>
  );
}

/** A typographic pull quote, the opening mark hung in the margin. */
export function Pullquote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="sd-block sd-pullquote not-prose">
      <blockquote>
        <div className="sd-pullquote-body">
          <span aria-hidden="true" className="sd-pullquote-open">
            &ldquo;
          </span>
          {children}
          <span aria-hidden="true">&rdquo;</span>
        </div>
      </blockquote>
      {cite && <figcaption>{cite}</figcaption>}
    </figure>
  );
}

/** A quiet band of wave lines between major sections. */
export function TextureBreak() {
  return (
    <div className="sd-block sd-texture not-prose" aria-hidden="true">
      <svg viewBox="0 0 600 60" preserveAspectRatio="none">
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

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    a: DocsLink,
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
