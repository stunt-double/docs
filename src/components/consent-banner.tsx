'use client';

import { useEffect, useState } from 'react';

import {
  CONSENT_OPEN_EVENT,
  consentRequired,
  effectiveConsent,
  openConsentSettings,
  readConsent,
  setConsent,
  type ConsentChoice,
} from '@/lib/consent';

const PRIVACY_HREF = 'https://www.stuntdouble.io/privacy#website-analytics';

// The design system's `Button size="sm" variant="outline"`, as classes: two
// outline buttons of equal weight, colour on hover at `quick`, no press scale.
const buttonClass =
  'inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-[0.8125rem] font-medium text-foreground transition-colors duration-(--duration-quick) ease-snap hover:border-foreground/30 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-input/15 dark:hover:bg-input/30';

/**
 * The marketing site's consent strip: non-modal, client-only (no layout shift),
 * and Allow and Decline carry equal weight. Opens on its own only where the
 * visitor has to be asked first.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (consentRequired() && readConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    const withdrawing = choice === 'denied' && effectiveConsent() === 'granted';
    setConsent(choice);
    setOpen(false);
    if (withdrawing) window.location.reload();
  };

  return (
    <section
      aria-label="Cookie preferences"
      className="bg-card text-card-foreground border-border shadow-floating animate-rise fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-lg border p-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-[calc(100%-2rem)] sm:gap-4 sm:pl-4"
    >
      <p className="text-muted-foreground min-w-0 flex-1 text-xs text-pretty sm:text-sm">
        We use cookies as described in our{' '}
        <a
          href={PRIVACY_HREF}
          className="text-foreground underline underline-offset-4 hover:no-underline"
        >
          privacy policy
        </a>
        .
      </p>
      <div className="flex shrink-0 gap-2">
        <button type="button" className={buttonClass} onClick={() => choose('denied')}>
          Decline
        </button>
        <button type="button" className={buttonClass} onClick={() => choose('granted')}>
          Allow
        </button>
      </div>
    </section>
  );
}

/** Reopens the banner, so a choice can be changed or withdrawn at any time. */
export function ConsentSettingsButton() {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="text-muted-foreground hover:text-foreground ease-snap text-left text-sm transition-colors duration-(--duration-quick)"
    >
      Cookie settings
    </button>
  );
}
