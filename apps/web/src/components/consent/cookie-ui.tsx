'use client';

import type { CookieCopy } from '@/sanity/queries/global';
import type { Consent } from './consent-context';

export type CookieUiProps = {
  view: 'banner' | 'settings' | 'saved';
  consent: Consent | null;
  copy: CookieCopy;
  onSave: (consent: Consent) => void;
  onViewChange: (view: 'hidden' | 'banner' | 'settings' | 'saved') => void;
};

// Implemented in the consent milestone.
export function CookieUi(_props: CookieUiProps) {
  return null;
}
