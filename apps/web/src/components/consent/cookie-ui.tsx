'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Switch } from '@base-ui/react/switch';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { routes } from '@/lib/routes';
import type { CookieCopy } from '@/sanity/queries/global';
import type { Consent } from './consent-context';

type View = 'hidden' | 'banner' | 'settings' | 'saved';

export type CookieUiProps = {
  view: View;
  consent: Consent | null;
  copy: CookieCopy;
  onSave: (consent: Consent) => void;
  onViewChange: (view: View) => void;
};

const small = 'min-h-12 px-5 text-xs';

function CookieSwitch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <Switch.Root
      aria-label={label}
      checked={checked}
      className="relative h-7 w-12 flex-none cursor-pointer border border-control bg-black data-checked:border-accent data-checked:bg-accent data-disabled:cursor-not-allowed data-disabled:opacity-60"
      disabled={disabled}
      onCheckedChange={onChange}
    >
      <Switch.Thumb className="absolute top-1 left-1 size-[18px] bg-muted transition-transform duration-150 data-checked:translate-x-5 data-checked:bg-black" />
    </Switch.Root>
  );
}

/** Banner (Zavrni/Sprejmi with equal weight), settings dialog and the "saved" toast. */
export function CookieUi({ view, consent, copy, onSave, onViewChange }: CookieUiProps) {
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [external, setExternal] = useState(consent?.external ?? false);

  // Sync switches with the stored choice whenever settings reopen.
  useEffect(() => {
    if (view === 'settings') {
      setAnalytics(consent?.analytics ?? false);
      setExternal(consent?.external ?? false);
    }
  }, [view, consent]);

  // The toast disappears on its own.
  useEffect(() => {
    if (view !== 'saved') return;
    const t = setTimeout(() => onViewChange('hidden'), 5000);
    return () => clearTimeout(t);
  }, [view, onViewChange]);

  const all = (value: boolean) => onSave({ analytics: value, external: value });

  return (
    <>
      {view === 'banner' && (
        <section
          aria-label={copy.banner.title}
          className="fixed inset-x-0 bottom-0 z-[55] flex flex-wrap items-center gap-x-8 gap-y-4 border-white/12 border-t bg-black/82 p-5 backdrop-blur-[16px] sheet:bottom-4 sheet:left-1/2 sheet:w-[min(1040px,calc(100%-32px))] sheet:-translate-x-1/2 sheet:border sheet:px-6"
        >
          <div className="flex flex-[1_1_380px] flex-col gap-1">
            <h2 className="m-0 font-semibold text-base">{copy.banner.title}</h2>
            <p className="text-muted text-sm leading-[22px]">
              {copy.banner.text}{' '}
              <Link className="text-link" href={routes.privacy}>
                {copy.banner.moreLabel}
              </Link>
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sheet:flex sheet:w-auto sheet:flex-wrap sheet:items-center">
            <button
              className={cn(buttonStyles({ variant: 'text' }), 'order-3 col-span-2 px-3 text-xs sheet:order-none')}
              onClick={() => onViewChange('settings')}
              type="button"
            >
              {copy.buttons.settings}
            </button>
            <button className={cn(buttonStyles({ variant: 'line' }), small)} onClick={() => all(false)} type="button">
              {copy.buttons.rejectAll}
            </button>
            <button className={cn(buttonStyles({ variant: 'line' }), small)} onClick={() => all(true)} type="button">
              {copy.buttons.acceptAll}
            </button>
          </div>
        </section>
      )}

      <Dialog.Root
        onOpenChange={(open) => !open && onViewChange(consent ? 'hidden' : 'banner')}
        open={view === 'settings'}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/70" />
          <Dialog.Popup className="fixed inset-x-0 bottom-0 z-[60] max-h-[94dvh] overflow-auto border-hairline border-t bg-surface shadow-[0_24px_80px_rgb(0_0_0/0.6)] outline-none sheet:inset-x-auto sheet:top-1/2 sheet:bottom-auto sheet:left-1/2 sheet:max-h-[calc(100dvh-48px)] sheet:w-[min(560px,calc(100%-32px))] sheet:-translate-x-1/2 sheet:-translate-y-1/2 sheet:border">
            <div className="flex items-center justify-between gap-4 pt-6 pr-5 pb-2 pl-7">
              <Dialog.Title className="m-0 font-bold font-display text-4xl uppercase leading-9">
                {copy.dialog.title}
              </Dialog.Title>
              <Dialog.Close
                aria-label="Zapri"
                className="inline-flex size-11 cursor-pointer items-center justify-center text-ink hover:bg-white/8"
              >
                <X aria-hidden size={22} />
              </Dialog.Close>
            </div>
            <div className="px-7 pb-2">
              <Dialog.Description className="mb-4 text-muted text-sm leading-[22px]">
                {copy.dialog.intro}
              </Dialog.Description>
              <div className="rows">
                {[
                  { key: 'necessary', text: copy.necessary, checked: true, disabled: true },
                  { key: 'analytics', text: copy.analytics, checked: analytics, onChange: setAnalytics },
                  { key: 'external', text: copy.external, checked: external, onChange: setExternal },
                ].map((row) => (
                  <div className="flex items-start justify-between gap-5 py-[18px]" key={row.key}>
                    <span>
                      <strong className="block font-semibold text-[15px]">{row.text.title}</strong>
                      <span className="text-muted text-sm">{row.text.text}</span>
                    </span>
                    <CookieSwitch
                      checked={row.checked}
                      disabled={row.disabled}
                      label={row.text.title}
                      onChange={row.onChange}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid-fit px-7 pt-5 pb-7 [--gap:8px] [--min:140px]">
              <button className={cn(buttonStyles({ variant: 'line' }), small)} onClick={() => all(false)} type="button">
                {copy.buttons.rejectAll}
              </button>
              <button className={cn(buttonStyles({ variant: 'line' }), small)} onClick={() => all(true)} type="button">
                {copy.buttons.acceptAll}
              </button>
              <button
                className={cn(buttonStyles(), small)}
                onClick={() => onSave({ analytics, external })}
                type="button"
              >
                {copy.buttons.save}
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {view === 'saved' && (
        <div
          className="fixed bottom-24 left-1/2 z-[55] flex w-max max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-3 border border-hairline bg-surface px-[18px] py-3.5 text-sm nav:bottom-6"
          role="status"
        >
          <Check aria-hidden className="text-accent" size={18} />
          {copy.toast.text}
          <button
            className={cn(buttonStyles({ variant: 'text' }), 'min-h-8 px-3 text-xs')}
            onClick={() => onViewChange('settings')}
            type="button"
          >
            {copy.toast.change}
          </button>
        </div>
      )}
    </>
  );
}
