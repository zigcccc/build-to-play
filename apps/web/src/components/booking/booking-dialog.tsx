'use client';

import { bookingDay, bookingDayLabel, bookingTime, bookingTimeLabel } from '@b2p/shared';
import { AlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog } from '@base-ui/react/dialog';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { ArrowLeft, ArrowRight, Check, Loader2, X } from 'lucide-react';
import { type FormEvent, type ReactNode, useEffect, useRef, useState, useTransition } from 'react';
import { submitBooking } from '@/actions/inquiry';
import { ErrorSummary, Field, FieldError, Select, SpamTraps, TextArea, TextInput } from '@/components/forms/fields';
import { useValidatedForm } from '@/components/forms/use-validated-form';
import { SocialIcon } from '@/components/icons';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { bookingSchema, type FieldErrors, SPAM_FIELDS } from '@/lib/forms/schemas';
import { interpolate } from '@/lib/interpolate';
import { twoDigit } from '@/lib/number';
import type { FormsCopy, LocationValue } from '@/sanity/queries/global';
import type { BookingProgram } from './booking-context';

export type BookingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProgram?: string;
  copy: FormsCopy;
  programs: BookingProgram[];
  locations: Pick<LocationValue, '_id' | 'name'>[];
  socials: { instagram?: string };
  consent: ReactNode;
};

type Step = 1 | 2 | 3 | 4;
type Mode = 'live' | 'video';
type Day = (typeof bookingDay.options)[number];
type Time = (typeof bookingTime.options)[number];

const UNKNOWN = 'unknown';
const ANY_LOCATION = 'any';

/** Which step holds each field, so a server-side error can send the visitor back to it. */
const fieldStep: Record<string, Step> = { goal: 1, program: 1, mode: 2, location: 2, days: 2, times: 2 };
const firstErrorStep = (errors: FieldErrors) =>
  Math.min(3, ...Object.keys(errors).map((field) => fieldStep[field] ?? 3)) as Step;

const optionClass =
  'flex min-h-14 w-full cursor-pointer items-center gap-3.5 border border-hairline bg-black px-4 py-3 text-left text-base leading-[22px] text-ink hover:border-control data-checked:border-accent data-checked:bg-accent/8';
const dotClass =
  'size-[18px] flex-none border-[1.5px] border-control in-data-checked:border-accent in-data-checked:bg-accent in-data-checked:shadow-[inset_0_0_0_3px_#161616]';
const chipClass =
  'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-control px-4 font-medium text-ink text-sm hover:border-ink data-checked:border-accent data-checked:bg-accent data-checked:text-black data-pressed:border-accent data-pressed:bg-accent data-pressed:text-black';

const initial = (program?: string) => ({
  step: 1 as Step,
  goal: '',
  program: (program ?? UNKNOWN) as string,
  mode: 'live' as Mode,
  location: ANY_LOCATION,
  days: [] as Day[],
  times: [] as Time[],
  name: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
});

export function BookingDialog({
  open,
  onOpenChange,
  initialProgram,
  copy,
  programs,
  locations,
  socials,
  consent,
}: BookingDialogProps) {
  const [state, setState] = useState(() => initial(initialProgram));
  const [confirmClose, setConfirmClose] = useState(false);
  // "Nadaljuj" sits on the right but stays the safe default focus.
  const stayRef = useRef<HTMLButtonElement>(null);
  const form = useValidatedForm(bookingSchema, copy.errors);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [startedAt, setStartedAt] = useState(0);
  const body = useRef<HTMLDivElement>(null);
  const b = copy.booking;

  // A fresh flow every time it opens (with the program of the page it was opened from).
  // biome-ignore lint/correctness/useExhaustiveDependencies: form.reset only clears state
  useEffect(() => {
    if (open) {
      setState(initial(initialProgram));
      form.reset();
      setFailed(false);
      setStartedAt(Date.now());
    }
  }, [open, initialProgram]);

  // Each step starts at the top of the scrollable body.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on step change only
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [state.step]);

  const set = <K extends keyof typeof state>(key: K, value: (typeof state)[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const close = () => {
    setConfirmClose(false);
    onOpenChange(false);
  };

  // X, Esc and backdrop clicks ask for confirmation unless the flow is finished.
  const requestClose = (next: boolean) => {
    if (next) return onOpenChange(true);
    if (state.step === 4) close();
    else setConfirmClose(true);
  };

  const payload = () => ({
    name: state.name,
    email: state.email,
    phone: state.phone,
    consent: state.consent ? 'on' : undefined,
    goal: state.goal,
    program: state.program === UNKNOWN ? undefined : state.program,
    mode: state.mode,
    location: state.mode === 'live' && state.location !== ANY_LOCATION ? state.location : undefined,
    days: state.days,
    times: state.times,
    message: state.message,
  });

  // Step 3 is a real form, so it shares validation and spam traps with the contact form.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.check(event.currentTarget, payload())) return;
    const traps = new FormData(event.currentTarget);
    setFailed(false);
    startTransition(async () => {
      const result = await submitBooking(payload(), {
        honeypot: String(traps.get(SPAM_FIELDS.honeypot) ?? ''),
        startedAt: Number(traps.get(SPAM_FIELDS.startedAt)),
        source: window.location.pathname,
      });
      if (result.status === 'success') set('step', 4);
      else if (result.status === 'invalid') {
        form.setErrors(result.errors);
        set('step', firstErrorStep(result.errors));
      } else setFailed(true);
    });
  };

  // Live re-validation once a submit has been tried.
  // biome-ignore lint/correctness/useExhaustiveDependencies: payload derives from state
  useEffect(() => form.revalidate(payload()), [state]);

  const message = form.message;
  // Only the errors of the step on screen; a server-side error elsewhere already moved the visitor there.
  const stepHasErrors = Object.keys(form.errors).some((field) => (fieldStep[field] ?? 3) === state.step);

  const when = [
    state.days.length ? state.days.map((d) => bookingDayLabel[d]).join(', ') : b.success.anytime,
    state.times.length
      ? state.times
          .map((t) => bookingTimeLabel[t])
          .join(', ')
          .toLowerCase()
      : b.success.anytime.toLowerCase(),
  ].join(' · ');

  const title = { 1: b.step1.title, 2: b.step2.title, 3: b.step3.title, 4: b.success.title }[state.step];

  return (
    <>
      <Dialog.Root onOpenChange={requestClose} open={open}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-[6px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Dialog.Popup
            className={cn(
              'fixed z-[60] flex flex-col border-hairline bg-surface shadow-[0_24px_80px_rgb(0_0_0/0.6)] transition-[transform,opacity] duration-250 outline-none',
              // Bottom sheet up to 640 px, centred modal above.
              'inset-x-0 bottom-0 max-h-[94dvh] border-t data-ending-style:translate-y-full data-starting-style:translate-y-full',
              'sheet:inset-x-auto sheet:bottom-auto sheet:top-1/2 sheet:left-1/2 sheet:max-h-[calc(100dvh-48px)] sheet:w-[min(600px,calc(100%-32px))] sheet:-translate-x-1/2 sheet:-translate-y-1/2 sheet:border sheet:data-ending-style:translate-y-[-45%] sheet:data-ending-style:opacity-0 sheet:data-starting-style:translate-y-[-45%] sheet:data-starting-style:opacity-0'
            )}
          >
            <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 bg-control sheet:hidden" />
            <div className="flex items-center justify-between gap-4 py-4 pr-3 pl-5 sheet:pt-6 sheet:pr-6 sheet:pb-5 sheet:pl-8">
              {state.step < 4 ? (
                <div className="flex flex-1 flex-col gap-2.5">
                  <span className="text-[13px] text-muted">
                    {b.title} · {interpolate(b.stepLabel, { n: String(state.step), total: '3' })}
                  </span>
                  <div aria-hidden className="grid max-w-60 grid-cols-3 gap-1">
                    {[1, 2, 3].map((n) => (
                      <span className={cn('h-[3px]', n <= state.step ? 'bg-accent' : 'bg-hairline')} key={n} />
                    ))}
                  </div>
                </div>
              ) : (
                <span className="flex-1 text-[13px] text-muted">{b.title}</span>
              )}
              <Dialog.Close
                aria-label="Zapri"
                className="inline-flex size-11 cursor-pointer items-center justify-center text-ink hover:bg-white/8"
              >
                <X aria-hidden size={22} />
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-6 overflow-auto px-5 pb-2 sheet:px-8" ref={body}>
              <div className="flex flex-col gap-2">
                {state.step === 4 && (
                  <span className="mb-2 inline-flex size-14 items-center justify-center bg-accent text-black">
                    <Check aria-hidden size={28} />
                  </span>
                )}
                <Dialog.Title className="m-0 text-balance font-bold font-display text-[clamp(34px,5vw,44px)] uppercase leading-[0.95]">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="text-[15px] text-muted leading-[22px]">
                  {{ 1: b.step1.subtitle, 2: b.step2.subtitle, 3: b.step3.subtitle, 4: b.success.text }[state.step]}
                </Dialog.Description>
              </div>

              {state.step === 1 && (
                <>
                  <RadioGroup
                    aria-label="Cilj"
                    className="flex flex-col gap-2"
                    onValueChange={(v) => set('goal', String(v))}
                    value={state.goal}
                  >
                    {b.step1.goals.map((goal) => (
                      <Radio.Root className={optionClass} key={goal} value={goal}>
                        <span aria-hidden className={dotClass} />
                        {goal}
                      </Radio.Root>
                    ))}
                  </RadioGroup>
                  <div>
                    <p className="mb-2.5 font-semibold text-sm" id="bk-program-label">
                      {b.step1.programLabel}
                    </p>
                    <RadioGroup
                      aria-labelledby="bk-program-label"
                      className="flex flex-wrap gap-2"
                      onValueChange={(v) => set('program', String(v))}
                      value={state.program}
                    >
                      {[{ key: UNKNOWN, label: copy.contact.programUnknown }, ...programs].map((p) => (
                        <Radio.Root className={chipClass} key={p.key} value={p.key}>
                          {p.label}
                        </Radio.Root>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              )}

              {state.step === 2 && (
                <>
                  <div>
                    <p className="mb-2.5 font-semibold text-sm" id="bk-mode-label">
                      {b.step2.modeLabel}
                    </p>
                    <RadioGroup
                      aria-labelledby="bk-mode-label"
                      className="grid grid-cols-2 gap-2"
                      onValueChange={(v) => set('mode', v as Mode)}
                      value={state.mode}
                    >
                      {(
                        [
                          ['live', b.step2.modeLive],
                          ['video', b.step2.modeVideo],
                        ] as const
                      ).map(([value, label]) => (
                        <Radio.Root className={optionClass} key={value} value={value}>
                          <span aria-hidden className={dotClass} />
                          {label}
                        </Radio.Root>
                      ))}
                    </RadioGroup>
                  </div>
                  {state.mode === 'live' && locations.length > 0 && (
                    <Field id="bk-location" label={b.step2.locationLabel}>
                      <Select
                        defaultValue={state.location}
                        id="bk-location"
                        name="location"
                        onValueChange={(v) => set('location', v)}
                        options={[
                          ...locations.map((l) => ({ value: l._id, label: l.name })),
                          { value: ANY_LOCATION, label: b.step2.anyLocation },
                        ]}
                        placeholder={b.step2.anyLocation}
                      />
                    </Field>
                  )}
                  <div>
                    <p className="mb-2.5 font-semibold text-sm" id="bk-days-label">
                      {b.step2.daysLabel}
                    </p>
                    <ToggleGroup
                      aria-labelledby="bk-days-label"
                      className="flex flex-wrap gap-2"
                      multiple
                      onValueChange={(v) => set('days', v as Day[])}
                      value={state.days}
                    >
                      {bookingDay.options.map((day) => (
                        <Toggle className={cn(chipClass, 'min-w-14')} key={day} value={day}>
                          {bookingDayLabel[day]}
                        </Toggle>
                      ))}
                    </ToggleGroup>
                  </div>
                  <div>
                    <p className="mb-2.5 font-semibold text-sm" id="bk-times-label">
                      {b.step2.timesLabel}
                    </p>
                    <ToggleGroup
                      aria-labelledby="bk-times-label"
                      className="flex flex-wrap gap-2"
                      multiple
                      onValueChange={(v) => set('times', v as Time[])}
                      value={state.times}
                    >
                      {bookingTime.options.map((time) => (
                        <Toggle className={chipClass} key={time} value={time}>
                          {bookingTimeLabel[time]}
                        </Toggle>
                      ))}
                    </ToggleGroup>
                  </div>
                </>
              )}

              {state.step < 3 && stepHasErrors && (
                <ErrorSummary>
                  {copy.errors.summary} {message('goal')}
                </ErrorSummary>
              )}

              {state.step === 3 && (
                <form aria-busy={pending} className="flex flex-col gap-5" id="bk-form" noValidate onSubmit={submit}>
                  {stepHasErrors && <ErrorSummary>{copy.errors.summary}</ErrorSummary>}
                  {failed && <ErrorSummary>{copy.states.failure}</ErrorSummary>}
                  <fieldset className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0" disabled={pending}>
                    <Field error={message('name')} id="bk-name" label={copy.labels.name} required>
                      <TextInput
                        autoComplete="name"
                        error={message('name')}
                        id="bk-name"
                        name="name"
                        onChange={(e) => set('name', e.target.value)}
                        placeholder={copy.placeholders.name}
                        value={state.name}
                      />
                    </Field>
                    <div className="grid-fit [--gap:16px] [--min:200px]">
                      <Field error={message('email')} id="bk-email" label={copy.labels.email} required>
                        <TextInput
                          autoComplete="email"
                          error={message('email')}
                          id="bk-email"
                          name="email"
                          onChange={(e) => set('email', e.target.value)}
                          placeholder={copy.placeholders.email}
                          type="email"
                          value={state.email}
                        />
                      </Field>
                      <Field id="bk-phone" label={copy.labels.phone} optionalLabel={copy.labels.optional}>
                        <TextInput
                          autoComplete="tel"
                          id="bk-phone"
                          name="phone"
                          onChange={(e) => set('phone', e.target.value)}
                          placeholder={copy.placeholders.phone}
                          type="tel"
                          value={state.phone}
                        />
                      </Field>
                    </div>
                    <Field id="bk-message" label={copy.labels.bookingMessage} optionalLabel={copy.labels.optional}>
                      <TextArea
                        id="bk-message"
                        name="message"
                        onChange={(e) => set('message', e.target.value)}
                        placeholder={copy.placeholders.bookingMessage}
                        rows={3}
                        value={state.message}
                      />
                    </Field>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-3">
                        <input
                          aria-describedby={message('consent') ? 'bk-consent-err' : undefined}
                          aria-invalid={message('consent') ? true : undefined}
                          checked={state.consent}
                          className="mt-0.5 size-5 flex-none accent-accent"
                          id="bk-consent"
                          name="consent"
                          onChange={(e) => set('consent', e.target.checked)}
                          type="checkbox"
                        />
                        <label className="text-muted text-sm leading-[22px]" htmlFor="bk-consent">
                          {consent} *
                        </label>
                      </div>
                      {message('consent') && (
                        <FieldError className="pl-8" id="bk-consent-err">
                          {message('consent')}
                        </FieldError>
                      )}
                    </div>
                  </fieldset>
                  <SpamTraps startedAt={startedAt} />
                </form>
              )}

              {state.step === 4 && (
                <>
                  <dl className="m-0 border-hairline border-t">
                    {[
                      [b.success.goalLabel, state.goal],
                      [b.success.modeLabel, state.mode === 'live' ? b.step2.modeLive : b.step2.modeVideo],
                      [b.success.whenLabel, when],
                    ].map(([label, value]) => (
                      <div className="flex justify-between gap-4 border-hairline border-b py-3" key={label}>
                        <dt className="text-muted">{label}</dt>
                        <dd className="m-0 text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div>
                    <p className="eyebrow mb-3">{b.success.nextHeading}</p>
                    <ol className="m-0 flex list-none flex-col gap-3 p-0">
                      {b.success.nextSteps.map((step, i) => (
                        <li className="grid grid-cols-[36px_1fr] gap-2" key={step}>
                          <span className="font-bold font-display text-[22px] text-accent">{twoDigit(i + 1)}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex gap-3 border-hairline border-t px-5 pt-4 pb-5 sheet:px-8 sheet:pt-5 sheet:pb-7">
              {(state.step === 2 || state.step === 3) && (
                <button
                  aria-label="Nazaj"
                  className={buttonStyles({ variant: 'line' })}
                  disabled={pending}
                  onClick={() => set('step', (state.step - 1) as Step)}
                  type="button"
                >
                  <ArrowLeft aria-hidden size={18} />
                </button>
              )}
              {state.step < 4 ? (
                <button
                  className={cn(buttonStyles(), 'flex-1 disabled:bg-hairline disabled:text-muted disabled:opacity-100')}
                  disabled={(state.step === 1 && !state.goal) || pending}
                  form={state.step === 3 ? 'bk-form' : undefined}
                  onClick={state.step === 3 ? undefined : () => set('step', (state.step + 1) as Step)}
                  type={state.step === 3 ? 'submit' : 'button'}
                >
                  {pending ? (
                    <>
                      <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" size={18} />
                      {copy.states.sending}
                    </>
                  ) : (
                    <>
                      {state.step === 3 ? (failed ? copy.states.retry : b.submit) : b.next}
                      <ArrowRight aria-hidden size={18} />
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button className={cn(buttonStyles(), 'flex-1')} onClick={close} type="button">
                    {b.success.close}
                  </button>
                  {socials.instagram && (
                    <a
                      aria-label="Instagram"
                      className={buttonStyles({ variant: 'line' })}
                      href={socials.instagram}
                      rel="noopener"
                      target="_blank"
                    >
                      <SocialIcon platform="instagram" />
                    </a>
                  )}
                </>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <AlertDialog.Root onOpenChange={setConfirmClose} open={confirmClose}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-[6px]" />
          <AlertDialog.Popup
            className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-[80] flex w-[min(440px,calc(100%-32px))] flex-col gap-3 border border-hairline bg-surface p-7 shadow-[0_24px_80px_rgb(0_0_0/0.6)] outline-none"
            initialFocus={stayRef}
          >
            <AlertDialog.Title className="m-0 font-bold font-display text-[32px] uppercase leading-8">
              {b.closeConfirm.title}
            </AlertDialog.Title>
            <AlertDialog.Description className="text-[15px] text-muted leading-[22px]">
              {b.closeConfirm.text}
            </AlertDialog.Description>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className={cn(buttonStyles({ variant: 'line' }), 'flex-[1_1_140px]')}
                onClick={close}
                type="button"
              >
                {b.closeConfirm.discard}
              </button>
              <AlertDialog.Close className={cn(buttonStyles(), 'flex-[1_1_180px]')} ref={stayRef}>
                {b.closeConfirm.stay}
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}
