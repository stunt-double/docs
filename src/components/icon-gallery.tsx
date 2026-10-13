import { GALLERY_BRANDS, GALLERY_ICONS, ICON_CATEGORIES } from '@/components/icon-gallery-data';

/*
 * Previews of `@stunt-double/icons` for /stuntkit/icons, drawn from the
 * geometry `scripts/sync-icons.mjs` copies out of StuntKit. Server-safe (no
 * hooks). The markup is StuntKit's own SVG files, so it is set as HTML.
 */

function categoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/** Every Continuity icon at 24px, grouped by category, each with its kebab-case name. */
export function IconGallery({ categories }: { categories?: string[] }) {
  const shown = categories ?? ICON_CATEGORIES;
  return (
    <div className="not-prose my-10">
      {shown.map((category) => {
        const icons = GALLERY_ICONS.filter((icon) => icon.category === category);
        if (!icons.length) return null;
        return (
          <section key={category} className="mb-8">
            <h3 className="text-muted-foreground mb-3 flex items-baseline justify-between font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
              {categoryLabel(category)}
              <span className="tabular-nums">{icons.length}</span>
            </h3>
            <ul className="border-border/60 grid grid-cols-3 border-t border-l sm:grid-cols-4 lg:grid-cols-6">
              {icons.map((icon) => (
                <li
                  key={icon.name}
                  title={`${icon.component} (${icon.name}.svg)`}
                  className="border-border/60 flex flex-col items-center gap-2 border-r border-b px-1 pt-4 pb-3"
                >
                  <svg
                    className="text-foreground h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  <span className="text-muted-foreground w-full truncate text-center font-mono text-[0.625rem]">
                    {icon.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/**
 * Every AI provider mark in both variants: `color` on a white tile, since
 * several marks are black, and `mono` in the page's text colour.
 */
export function BrandGallery() {
  return (
    <ul className="not-prose border-border/60 my-10 grid grid-cols-2 border-t border-l sm:grid-cols-3 lg:grid-cols-4">
      {GALLERY_BRANDS.map((brand) => (
        <li
          key={brand.name}
          title={brand.component}
          className="border-border/60 flex flex-col items-center gap-3 border-r border-b px-2 pt-4 pb-3"
        >
          <div className="flex items-center gap-3">
            <span className="border-border/60 flex h-10 w-10 items-center justify-center rounded-md border bg-white">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: brand.color }}
              />
            </span>
            <span className="flex h-10 w-10 items-center justify-center">
              <svg
                className="text-foreground h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: brand.mono }}
              />
            </span>
          </div>
          <span className="text-foreground text-xs">{brand.title}</span>
          <span className="text-muted-foreground -mt-2 font-mono text-[0.625rem]">
            {brand.component}
          </span>
        </li>
      ))}
    </ul>
  );
}
