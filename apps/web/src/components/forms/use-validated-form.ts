'use client';

import { useState } from 'react';
import type { z } from 'zod';
import { type ErrorKey, type FieldErrors, fieldErrors } from '@/lib/forms/schemas';

/**
 * Design rule: validate on submit, then live on every corrected field;
 * focus the first invalid field after a failed submit.
 */
export function useValidatedForm(schema: z.ZodType, messages: Record<ErrorKey, string>) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);

  const validate = (values: Record<string, unknown>) => {
    const result = schema.safeParse(values);
    return result.success ? {} : fieldErrors(result.error);
  };

  /** Returns true when the form is valid; otherwise shows errors and focuses the first invalid field. */
  const check = (form: HTMLFormElement, values: Record<string, unknown>) => {
    setAttempted(true);
    const next = validate(values);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      (form.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
      return false;
    }
    return true;
  };

  /** Re-validate live once the user has tried to submit. */
  const revalidate = (values: Record<string, unknown>) => {
    if (attempted) setErrors(validate(values));
  };

  const message = (field: string) => {
    const key = errors[field];
    return key ? messages[key] : undefined;
  };

  /** Back to a pristine form (e.g. when a dialog reopens). */
  const reset = () => {
    setErrors({});
    setAttempted(false);
  };

  return { errors, setErrors, check, revalidate, reset, message, hasErrors: Object.keys(errors).length > 0 };
}
