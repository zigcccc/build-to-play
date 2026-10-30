'use server';

import { bookingDayLabel, bookingTimeLabel } from '@b2p/shared';
import { checkBotId } from 'botid/server';
import { stegaClean } from 'next-sanity';
import { formsCopy } from '@/components/forms/copy';
import {
  bookingSchema,
  contactSchema,
  type FieldErrors,
  fieldErrors,
  homeContactSchema,
  MIN_FILL_MS,
  SPAM_FIELDS,
} from '@/lib/forms/schemas';
import { deliverInquiry, type InquiryRecord, type SpamReason } from '@/lib/inquiry.server';
import { formVars, getGlobal } from '@/sanity/queries/global';

export type FormState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: FieldErrors }
  | { status: 'success'; email: string }
  | { status: 'error' };

/**
 * Why a submission looks automated. Flagged inquiries are still stored (status "spam", no e-mails) and the sender
 * sees the normal success: a false positive must not lose a lead, and BotID always flags a submit without JavaScript.
 */
async function spamReason(honeypot: unknown, startedAt: unknown): Promise<SpamReason | undefined> {
  if (typeof honeypot === 'string' && honeypot.length > 0) return 'honeypot';
  if (Date.now() - Number(startedAt) < MIN_FILL_MS) return 'tooFast';
  const { isBot } = await checkBotId();
  return isBot ? 'bot' : undefined;
}

// The form renders its options from visible copy (brand nbsp, stega in draft mode); compare them as plain text.
const normalize = (text: string) => stegaClean(text).replace(/\u00a0/g, ' ');

/** A submitted choice only counts if it is one the CMS offers; anything else was not sent by our form. */
const pick = (value: string | undefined, allowed: string[]) =>
  value ? allowed.find((option) => option === normalize(value)) : undefined;

async function store(record: InquiryRecord, spam: SpamReason | undefined): Promise<FormState> {
  try {
    await deliverInquiry(record, spam);
    return { status: 'success', email: record.email };
  } catch (error) {
    console.error('[inquiry] could not be stored', error);
    return { status: 'error' };
  }
}

export async function submitContact(
  variant: 'home' | 'contact',
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = (variant === 'home' ? homeContactSchema : contactSchema).safeParse(raw);
  if (!parsed.success) return { status: 'invalid', errors: fieldErrors(parsed.error) };

  const data = parsed.data;
  const { forms, programs, settings } = await getGlobal(false);
  const copy = formsCopy(formVars(settings));
  const subject =
    'subject' in data
      ? pick(data.subject, forms.subjects)
      : pick(data.program, [...programs.map((p) => p.name), copy.contact.programUnknown]);
  return store(
    {
      kind: 'contact',
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject,
      message: data.message,
      source: variant === 'home' ? '/' : '/kontakt',
    },
    await spamReason(raw[SPAM_FIELDS.honeypot], raw[SPAM_FIELDS.startedAt])
  );
}

export async function submitBooking(input: unknown, meta: { honeypot: string; startedAt: number; source: string }) {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { status: 'invalid', errors: fieldErrors(parsed.error) } as FormState;

  const data = parsed.data;
  const { forms, programs, locations, settings } = await getGlobal(false);
  const { step2 } = formsCopy(formVars(settings)).booking;
  return store(
    {
      kind: 'booking',
      name: data.name,
      email: data.email,
      phone: data.phone,
      goal: pick(data.goal, forms.goals),
      subject: programs.find((p) => p.slug === data.program)?.name,
      mode: data.mode === 'live' ? step2.modeLive : step2.modeVideo,
      location:
        data.mode === 'live' ? (locations.find((l) => l._id === data.location)?.name ?? step2.anyLocation) : undefined,
      days: data.days.map((d) => bookingDayLabel[d]),
      times: data.times.map((t) => bookingTimeLabel[t]),
      message: data.message,
      source: meta.source,
    },
    await spamReason(meta.honeypot, meta.startedAt)
  );
}
