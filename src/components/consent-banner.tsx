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

const buttonClass =
  'rounded-md border border-fd-border px-3 py-1.5 text-sm font-medium hover:bg-fd-accent hover:text-fd-accent-foreground';

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
      className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-lg border border-fd-border bg-fd-card p-3 text-fd-card-foreground shadow-lg sm:inset-x-auto sm:right-4 sm:bottom-4 sm:gap-4 sm:pl-4"
    >
      <p className="min-w-0 flex-1 text-xs text-fd-muted-foreground sm:text-sm">
        We use cookies as described in our{' '}
        <a href={PRIVACY_HREF} className="text-fd-foreground underline underline-offset-4 hover:no-underline">
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
      className="text-left text-sm text-fd-muted-foreground hover:text-fd-foreground"
    >
      Cookie settings
    </button>
  );
}
