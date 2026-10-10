import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const LINKS = [
  { label: "Getting started", href: "/getting-started" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Guides", href: "/guides" },
  { label: "API", href: "/api" },
];

/**
 * Every unmatched URL renders this with a 404 status. The docs catch-all
 * matches every path, so it renders inside the docs layout (nav, sidebar and
 * search are already there).
 */
export default function NotFound() {
  return (
    <main className="flex w-full max-w-2xl min-w-0 flex-col justify-self-center px-4 py-10 [grid-area:main] md:px-6 md:pt-14">

      <p className="text-muted-foreground font-mono text-xs tracking-[0.16em] uppercase">
        404
      </p>
      <h1 className="sd-title mt-3">This page is not here</h1>
      <p className="text-muted-foreground mt-4 max-w-[60ch] text-base leading-relaxed">
        The link may be out of date, or the page has moved. Search the docs, or start
        from one of these.
      </p>

      <ul className="border-border/60 mt-10 border-t">
        {LINKS.map((link) => (
          <li key={link.href} className="border-border/60 border-b">
            <Link
              href={link.href}
              className="text-foreground focus-visible:outline-ring flex py-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </main>
  );
}
