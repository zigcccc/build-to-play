'use server';

import { bookingDayLabel, bookingTimeLabel } from '@b2p/shared';
import { checkBotId } from 'botid/server';
import {
  bookingSchema,
  contactSchema,
  type FieldErrors,
  fieldErrors,
  homeContactSchema,
  MIN_FILL_MS,
  SPAM_FIELDS,
} from '@/lib/forms/schemas';
import { deliverInquiry, type InquiryRecord } from '@/lib/inquiry.server';
import { getGlobal } from '@/sanity/queries/global';

export type FormState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: FieldErrors }
  | { status: 'success'; email: string }
  | { status: 'error' };

/** Bots get a fake success so they learn nothing; humans never hit this. */
async function isSpam(honeypot: unknown, startedAt: unknown) {
  if (typeof honeypot === 'string' && honeypot.length > 0) return true;
  if (Date.now() - Number(startedAt) < MIN_FILL_MS) return true;
  const { isBot } = await checkBotId();
  return isBot;
}

async function store(record: InquiryRecord): Promise<FormState> {
  try {
    await deliverInquiry(record);
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
  if (await isSpam(raw[SPAM_FIELDS.honeypot], raw[SPAM_FIELDS.startedAt])) {
    return { status: 'success', email: String(raw.email ?? '') };
  }

  const parsed = (variant === 'home' ? homeContactSchema : contactSchema).safeParse(raw);
  if (!parsed.success) return { status: 'invalid', errors: fieldErrors(parsed.error) };

  const data = parsed.data;
  return store({
    kind: 'contact',
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: 'subject' in data ? data.subject : 'program' in data ? data.program : undefined,
    message: data.message,
    source: variant === 'home' ? '/' : '/kontakt',
  });
}

export async function submitBooking(input: unknown, meta: { honeypot: string; startedAt: number; source: string }) {
  if (await isSpam(meta.honeypot, meta.startedAt)) return { status: 'success' } as FormState;

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { status: 'invalid', errors: fieldErrors(parsed.error) } as FormState;

  const data = parsed.data;
  const { forms, programs, locations } = await getGlobal(false);
  const state = await store({
    kind: 'booking',
    name: data.name,
    email: data.email,
    phone: data.phone,
    goal: data.goal,
    subject: programs.find((p) => p.key === data.program)?.name,
    mode: data.mode === 'live' ? forms.booking.step2.modeLive : forms.booking.step2.modeVideo,
    location:
      data.mode === 'live'
        ? (locations.find((l) => l._id === data.location)?.name ?? forms.booking.step2.anyLocation)
        : undefined,
    days: data.days.map((d) => bookingDayLabel[d]),
    times: data.times.map((t) => bookingTimeLabel[t]),
    message: data.message,
    source: meta.source,
  });
  return state;
}
