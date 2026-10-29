'use client';

import dynamic from 'next/dynamic';
import { createContext, type ReactNode, use, useEffect, useState } from 'react';
import type { FormsCopy, LocationValue } from '@/sanity/queries/global';

// The flow is only downloaded once someone actually opens it.
const BookingDialog = dynamic(() => import('./booking-dialog').then((m) => m.BookingDialog));

export type BookingProgram = { key: string; label: string };

type BookingContextValue = { open: (program?: string) => void };

const BookingContext = createContext<BookingContextValue | null>(null);

export const useBooking = () => {
  const ctx = use(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
};

type Props = {
  children: ReactNode;
  copy: FormsCopy;
  programs: BookingProgram[];
  locations: Pick<LocationValue, '_id' | 'name'>[];
  socials: { instagram?: string };
  /** Server-rendered consent label (contains the privacy-policy link). */
  consent: ReactNode;
};

export function BookingProvider({ children, ...dialogProps }: Props) {
  const [state, setState] = useState<{ open: boolean; program?: string; mounted: boolean }>({
    open: false,
    mounted: false,
  });

  const open = (program?: string) => setState({ open: true, program, mounted: true });

  // Deep link: any URL with ?posvet=1 opens the flow (once the page has finished hydrating).
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('posvet') !== '1') return;
    const show = () => setState({ open: true, mounted: true });
    // Safari has no requestIdleCallback; a short timer stands in for it there.
    if (!('requestIdleCallback' in window)) {
      const timer = setTimeout(show, 300);
      return () => clearTimeout(timer);
    }
    const id = requestIdleCallback(show, { timeout: 1500 });
    return () => cancelIdleCallback(id);
  }, []);

  return (
    <BookingContext value={{ open }}>
      {children}
      {state.mounted && (
        <BookingDialog
          {...dialogProps}
          initialProgram={state.program}
          onOpenChange={(next) => setState((s) => ({ ...s, open: next }))}
          open={state.open}
        />
      )}
    </BookingContext>
  );
}
