import { bookingDay, bookingMode, bookingTime, programKey } from '@b2p/shared';
import { z } from 'zod';

/** Error keys map to the CMS copy in `forms.errors`, so client and server show the same text. */
export type ErrorKey = 'name' | 'emailEmpty' | 'emailInvalid' | 'message' | 'consent';

// Same rule as the design spec: something@something.tld
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const trimmed = z.string().trim();
const optional = trimmed
  .max(2000)
  .optional()
  .transform((v) => v || undefined);

const contactFields = {
  name: trimmed.min(1, 'name').max(120, 'name'),
  email: trimmed.min(1, 'emailEmpty').regex(EMAIL, 'emailInvalid').max(200, 'emailInvalid'),
  phone: trimmed
    .max(40)
    .optional()
    .transform((v) => v || undefined),
  consent: z.literal('on', { error: 'consent' }),
};

export const contactSchema = z.object({
  ...contactFields,
  subject: optional,
  message: trimmed.min(1, 'message').max(5000, 'message'),
});

/** The home form asks for a program and a goal; the goal is optional there. */
export const homeContactSchema = z.object({
  ...contactFields,
  program: optional,
  message: trimmed
    .max(5000, 'message')
    .optional()
    .transform((v) => v || undefined),
});

export const bookingSchema = z.object({
  ...contactFields,
  goal: trimmed.min(1).max(200),
  program: programKey.optional(),
  mode: bookingMode,
  location: optional,
  days: z.array(bookingDay).max(6),
  times: z.array(bookingTime).max(3),
  message: optional,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type HomeContactInput = z.infer<typeof homeContactSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;

export type FieldErrors = Partial<Record<string, ErrorKey>>;

/** First error per field, as an error key. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0]);
    if (!out[field]) out[field] = issue.message as ErrorKey;
  }
  return out;
}

/** Spam traps shared by every form: a hidden honeypot field and a minimum fill time. */
export const SPAM_FIELDS = { honeypot: 'website', startedAt: 'started_at' } as const;
export const MIN_FILL_MS = 2500;
