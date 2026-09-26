import type { ReactNode } from 'react';

import { Container } from '../../components/layout';
import { DocsSidebar } from './_components/docs-sidebar';

/** Prose styling for docs bodies. Headings are Tiempos Headline
 * (`font-serif`, weight 400), the same voice as every headline below a page
 * title: Geist Pixel is for the page h1 only, once per page. Tiempos is drawn
 * for 20px and up, so `h3` (a sub-topic inside a section, set smaller) is a
 * sans 500 title rather than a small serif.
 *
 * `max-w-none` hands width control to the layout below rather than
 * Typography's own 65ch cap: the wrapper around `{children}` in `DocsLayout`
 * sets the actual reading measure, so this class only ever governs the type
 * scale. A border-top on `h2` doubles as the section divider that gives each
 * new topic room to breathe, rather than letting one heading style run into
 * the next. */
const docsProse =
  'prose dark:prose-invert max-w-none ' +
  'prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-normal prose-headings:text-balance prose-headings:scroll-mt-28 ' +
  'prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:mb-4 ' +
  'prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-16 prose-h2:mb-5 prose-h2:pt-10 prose-h2:border-t prose-h2:border-border ' +
  'prose-h3:font-sans prose-h3:font-medium prose-h3:tracking-[-0.012em] prose-h3:text-base prose-h3:sm:text-lg prose-h3:mt-10 prose-h3:mb-3 ' +
  'prose-p:font-sans prose-p:text-[0.9375rem] prose-p:leading-[1.8] prose-p:my-5 ' +
  'prose-a:text-foreground prose-a:font-medium prose-a:underline prose-a:underline-offset-[3px] prose-a:decoration-foreground/30 hover:prose-a:decoration-foreground ' +
  'prose-strong:font-medium prose-strong:text-foreground ' +
  'prose-code:text-sm prose-code:font-mono prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-secondary prose-code:text-secondary-foreground prose-code:before:content-none prose-code:after:content-none ' +
  'prose-pre:bg-muted prose-pre:text-muted-foreground prose-pre:rounded-md prose-pre:p-5 prose-pre:border prose-pre:border-border prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:my-6 ' +
  'prose-li:my-2 prose-li:font-sans prose-li:text-[0.9375rem] prose-li:leading-[1.8] prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-5 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-5 ' +
  'prose-table:text-sm prose-table:my-6 prose-th:text-left prose-hr:border-border prose-hr:my-12';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background w-full">
      <Container size="wide" className="pt-32 pb-28 md:pt-40 md:pb-40">
        <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <aside className="mb-14 lg:mb-0">
            <div className="lg:sticky lg:top-28">
              <DocsSidebar />
            </div>
          </aside>
          {/* The grid column can stretch a long way on a wide viewport, so the
           * prose itself is capped to a sensible reading measure rather than
           * filling it; the extra room becomes right-hand breathing space. */}
          <main className="min-w-0">
            <div className={`max-w-[42rem] ${docsProse}`}>{children}</div>
          </main>
        </div>
      </Container>
    </div>
  );
}
