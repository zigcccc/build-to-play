'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import dynamic from 'next/dynamic';
import { createContext, type ReactNode, use, useEffect, useState } from 'react';
import type { CookieCopy } from '@/sanity/queries/global';

const CookieUi = dynamic(() => import('./preferences-ui').then((m) => m.CookieUi));

const COOKIE = 'b2p_consent';
const VERSION = 1;
const MAX_AGE = 60 * 60 * 24 * 365;

export type Consent = { analytics: boolean; external: boolean };
type Stored = Consent & { v: number; ts: number };

type ConsentContextValue = {
  /** `null` until the visitor has decided (or before hydration). */
  consent: Consent | null;
  save: (consent: Consent) => void;
  openSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export const useConsent = () => {
  const ctx = use(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>');
  return ctx;
};

function readConsent(): Consent | null {
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Stored;
    return parsed.v === VERSION ? { analytics: !!parsed.analytics, external: !!parsed.external } : null;
  } catch {
    return null;
  }
}

export function ConsentProvider({ children, copy }: { children: ReactNode; copy: CookieCopy }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [view, setView] = useState<'hidden' | 'banner' | 'settings' | 'saved'>('hidden');
  // Once shown, the UI stays mounted so closing portals can finish their exit cleanly.
  const [uiMounted, setUiMounted] = useState(false);
  useEffect(() => {
    if (view !== 'hidden') setUiMounted(true);
  }, [view]);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    if (!stored) setView('banner');
  }, []);

  const save = (next: Consent) => {
    const value: Stored = { ...next, v: VERSION, ts: Date.now() };
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    // biome-ignore lint/suspicious/noDocumentCookie: consent must be a first-party cookie readable on every page; Cookie Store API isn't universal yet
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    setConsent(next);
    setView('saved');
  };

  return (
    <ConsentContext value={{ consent, save, openSettings: () => setView('settings') }}>
      {children}
      {uiMounted && <CookieUi consent={consent} copy={copy} onSave={save} onViewChange={setView} view={view} />}
      {consent?.analytics && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </ConsentContext>
  );
}
