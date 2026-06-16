'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/app/lib/utils';
import { docsNav } from '../_lib/nav';

/**
 * Docs sidebar navigation. Renders the shared `docsNav` tree and highlights the
 * link matching the current pathname. Used inside the docs layout on desktop
 * (a sticky rail) and at the top of the page on small screens.
 */
export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className={cn('text-sm', className)}>
      <Link
        href="/support"
        className="text-muted-foreground hover:text-foreground mb-7 inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Support
      </Link>
      <ul className="flex flex-col gap-7">
        {docsNav.map((section) => (
          <li key={section.title}>
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              {section.title}
            </p>
            <ul className="border-border/60 flex flex-col gap-0.5 border-l">
              {section.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        '-ml-px block border-l py-1.5 pl-4 transition-colors',
                        active
                          ? 'border-foreground text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground border-transparent hover:border-foreground/40'
                      )}
                    >
                      {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
