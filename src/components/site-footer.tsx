import { ConsentSettingsButton } from "@/components/consent-banner";

const linkClass =
  "text-muted-foreground hover:text-foreground ease-snap rounded-sm transition-colors duration-(--duration-quick) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const LINKS = [
  { label: "stuntdouble.io", href: "https://www.stuntdouble.io" },
  { label: "Privacy policy", href: "https://www.stuntdouble.io/privacy" },
  { label: "Status", href: "https://status.stuntdouble.io" },
];

/** The site footer under every page: the marketing site, privacy, status and the cookie choice. */
export function SiteFooter() {
  return (
    <footer className="border-border/60 mt-16 border-t pt-6 pb-2">
      <nav aria-label="Footer">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={linkClass}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <ConsentSettingsButton className={`${linkClass} text-left`} />
          </li>
        </ul>
      </nav>
      <p className="text-muted-foreground mt-4 font-mono text-xs">
        © {new Date().getFullYear()} Stunt Double
      </p>
    </footer>
  );
}
