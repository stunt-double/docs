import type { ReactNode } from 'react';

import { Container } from '../../components/layout';
import { DocsSidebar } from './_components/docs-sidebar';

/** Prose styling for docs bodies. Headings use the Geist Pixel display
 * voice (`font-pixel`, the same face that powers `.font-display`) rather
 * than the blog's editorial serif, tuned for reference material. Pixel
 * glyphs sit on a fixed square grid, so headings keep normal tracking and
 * weight 400 (negative tracking collapses the cells). */
const docsProse =
  'prose dark:prose-invert max-w-none ' +
  'prose-headings:font-pixel prose-headings:font-normal prose-headings:tracking-normal prose-headings:scroll-mt-28 ' +
  'prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-3 ' +
  'prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 ' +
  'prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 ' +
  'prose-p:font-sans prose-p:text-[1.0625rem] prose-p:leading-[1.75] prose-p:my-4 ' +
  'prose-a:text-foreground prose-a:font-medium prose-a:underline prose-a:underline-offset-[3px] prose-a:decoration-foreground/30 hover:prose-a:decoration-foreground ' +
  'prose-strong:font-semibold prose-strong:text-foreground ' +
  'prose-code:text-sm prose-code:font-mono prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-secondary prose-code:text-secondary-foreground prose-code:before:content-none prose-code:after:content-none ' +
  'prose-pre:bg-muted prose-pre:text-muted-foreground prose-pre:rounded-md prose-pre:p-4 prose-pre:border prose-pre:border-border prose-pre:overflow-x-auto prose-pre:text-sm ' +
  'prose-li:my-1.5 prose-li:font-sans prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 ' +
  'prose-table:text-sm prose-th:text-left prose-hr:border-border';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background">
      <Container className="pt-28 pb-24 md:pt-32 md:pb-32">
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <aside className="mb-12 lg:mb-0">
            <div className="lg:sticky lg:top-28">
              <DocsSidebar />
            </div>
          </aside>
          <main className={docsProse}>{children}</main>
        </div>
      </Container>
    </div>
  );
}
