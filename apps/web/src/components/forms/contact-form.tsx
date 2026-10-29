'use client';

import { Check, Loader2, Send } from 'lucide-react';
import { type FormEvent, type ReactNode, startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { type FormState, submitContact } from '@/actions/inquiry';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { contactSchema, homeContactSchema } from '@/lib/forms/schemas';
import type { FormsCopy } from '@/sanity/queries/global';
import { ErrorSummary, Field, FieldError, Select, SpamTraps, TextArea, TextInput } from './fields';
import { useValidatedForm } from './use-validated-form';

export type ContactFormProps = {
  variant: 'home' | 'contact';
  heading: string;
  copy: FormsCopy;
  programs: { key: string; label: string }[];
  email: string;
  consent: ReactNode;
};

export function ContactForm({ variant, heading, copy, programs, email, consent }: ContactFormProps) {
  const isHome = variant === 'home';
  const [state, formAction, pending] = useActionState(submitContact.bind(null, variant), {
    status: 'idle',
  } as FormState);
  const [startedAt, setStartedAt] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const form = useValidatedForm(isHome ? homeContactSchema : contactSchema, copy.errors);

  useEffect(() => setStartedAt(Date.now()), []);

  // Server-side validation errors (if client validation was bypassed) use the same keys.
  useEffect(() => {
    if (state.status === 'invalid') form.setErrors(state.errors);
  }, [state, form.setErrors]);

  const values = () => Object.fromEntries(new FormData(formRef.current ?? undefined));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // With JS we validate first and keep the typed values on failure (no automatic form reset).
    event.preventDefault();
    if (!form.check(event.currentTarget, values())) return;
    setDismissed(false);
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  };

  const id = (name: string) => `${variant}-${name}`;
  const t = copy.labels;
  const p = copy.placeholders;

  if (state.status === 'success' && !dismissed) {
    const text = (isHome ? copy.states.successTextHome : copy.states.successText).replace('{poslano}', state.email);
    return (
      <div className="flex flex-col items-start gap-4 py-6" role="status">
        <span className="inline-flex size-14 items-center justify-center bg-accent text-black">
          <Check aria-hidden size={28} />
        </span>
        <h3 className="m-0 font-bold font-display text-[44px] uppercase leading-[44px]">{copy.states.successTitle}</h3>
        <p className="text-muted">{text}</p>
        <button
          className={isHome ? buttonStyles({ variant: 'text' }) : buttonStyles({ variant: 'line' })}
          onClick={() => {
            setDismissed(true);
            formRef.current?.reset();
          }}
          type="button"
        >
          {copy.states.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      aria-busy={pending}
      className="flex flex-col gap-5"
      noValidate
      onChange={() => form.revalidate(values())}
      onSubmit={onSubmit}
      ref={formRef}
    >
      <div>
        <h3 className="m-0 font-semibold text-[22px] leading-7">{heading}</h3>
        <p className="mt-1.5 text-muted text-sm">{t.requiredNote}</p>
      </div>

      {form.hasErrors && <ErrorSummary>{copy.errors.summary}</ErrorSummary>}
      {state.status === 'error' && (
        <ErrorSummary>
          {copy.states.failure.split(email)[0]}
          <a className="text-link underline" href={`mailto:${email}`}>
            {email}
          </a>
          {copy.states.failure.split(email)[1]}
        </ErrorSummary>
      )}

      <fieldset className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0" disabled={pending}>
        <div className="grid-fit [--gap:20px_16px] [--min:220px]">
          <Field error={form.message('name')} id={id('name')} label={t.name} required>
            <TextInput
              autoComplete="name"
              error={form.message('name')}
              id={id('name')}
              name="name"
              placeholder={p.name}
              type="text"
            />
          </Field>
          <Field error={form.message('email')} id={id('email')} label={t.email} required>
            <TextInput
              autoComplete="email"
              error={form.message('email')}
              id={id('email')}
              name="email"
              placeholder={p.email}
              type="email"
            />
          </Field>
          <Field id={id('phone')} label={t.phone}>
            <TextInput autoComplete="tel" id={id('phone')} name="phone" placeholder={p.phone} type="tel" />
          </Field>
          {isHome ? (
            <Field id={id('program')} label={t.program}>
              <Select
                disabled={pending}
                id={id('program')}
                name="program"
                options={[
                  ...programs.map((pr) => ({ value: pr.label, label: pr.label })),
                  { value: copy.contact.programUnknown, label: copy.contact.programUnknown },
                ]}
                placeholder={p.program}
              />
            </Field>
          ) : (
            <Field id={id('subject')} label={t.subject}>
              <Select
                defaultValue={copy.contact.subjects[0]}
                disabled={pending}
                id={id('subject')}
                name="subject"
                options={copy.contact.subjects.map((s) => ({ value: s, label: s }))}
                placeholder={copy.contact.subjects[0] ?? ''}
              />
            </Field>
          )}
        </div>

        <Field
          error={form.message('message')}
          id={id('message')}
          label={isHome ? t.goal : t.message}
          required={!isHome}
        >
          <TextArea
            error={form.message('message')}
            id={id('message')}
            name="message"
            placeholder={isHome ? p.goal : p.message}
            rows={isHome ? 4 : 5}
          />
        </Field>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <input
              aria-describedby={form.message('consent') ? id('consent-err') : undefined}
              aria-invalid={form.message('consent') ? true : undefined}
              className="mt-0.5 size-5 flex-none accent-accent"
              id={id('consent')}
              name="consent"
              type="checkbox"
            />
            <label className="text-muted text-sm leading-[22px]" htmlFor={id('consent')}>
              {consent} *
            </label>
          </div>
          {form.message('consent') && (
            <FieldError className="pl-8" id={id('consent-err')}>
              {form.message('consent')}
            </FieldError>
          )}
        </div>
      </fieldset>

      <SpamTraps startedAt={startedAt} />

      <button className={cn(buttonStyles({ size: 'lg', block: true }))} disabled={pending} type="submit">
        {pending ? (
          <>
            <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" size={18} />
            {copy.states.sending}
          </>
        ) : state.status === 'error' ? (
          copy.states.retry
        ) : (
          <>
            {isHome ? copy.contact.submitHome : copy.contact.submit}
            <Send aria-hidden size={18} />
          </>
        )}
      </button>
    </form>
  );
}
