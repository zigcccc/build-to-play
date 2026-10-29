import 'server-only';
import type { InquiryKind } from '@b2p/shared';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import { InquiryConfirmation } from '@/emails/inquiry-confirmation';
import { InquiryNotification } from '@/emails/inquiry-notification';
import { serverEnv } from '@/env/server';
import { interpolate } from '@/lib/interpolate';
import { client } from '@/sanity/client';
import { getGlobal } from '@/sanity/queries/global';

export type InquiryRecord = {
  kind: InquiryKind;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  goal?: string;
  mode?: string;
  location?: string;
  days?: string[];
  times?: string[];
  source?: string;
};

/** Which spam trap a stored inquiry tripped (shown in the Studio). */
export type SpamReason = 'honeypot' | 'tooFast' | 'bot';

const writeClient = client.withConfig({ token: serverEnv.SANITY_API_WRITE_TOKEN, perspective: 'raw' });
const resend = serverEnv.RESEND_API_KEY ? new Resend(serverEnv.RESEND_API_KEY) : null;

const present = (rows: [string, string | undefined][]) => rows.filter((row): row is [string, string] => !!row[1]);

/** Everything the sender entered, for the trainer's notification (Slovene labels match the form). */
export function inquiryRows(record: InquiryRecord): [string, string][] {
  return present([
    ['Ime in priimek', record.name],
    ['E-pošta', record.email],
    ['Telefon', record.phone],
    ...choiceRows(record),
    ['Sporočilo', record.message],
  ]);
}

/**
 * Only the choices made from CMS-defined options. The confirmation goes to whatever address was typed in, so it
 * must never echo free text (name, phone, message): that would let anyone send their own words from our domain.
 */
function choiceRows(record: InquiryRecord): [string, string | undefined][] {
  return [
    ['Zadeva / program', record.subject],
    ['Cilj', record.goal],
    ['Oblika', record.mode],
    ['Lokacija', record.location],
    ['Dnevi', record.days?.join(', ')],
    ['Del dneva', record.times?.join(', ')],
  ];
}

/**
 * Persists the inquiry first (so nothing is lost), then e-mails the trainer and the sender. Inquiries flagged as spam
 * are stored for review but never e-mailed. Throws only if the inquiry could not be stored.
 */
export async function deliverInquiry(record: InquiryRecord, spam?: SpamReason) {
  const doc = await writeClient.create({
    _type: 'inquiry',
    status: spam ? 'spam' : 'new',
    spamReason: spam,
    submittedAt: new Date().toISOString(),
    emailStatus: spam ? 'skipped' : 'pending',
    ...record,
  });
  if (spam) return;

  const { settings, forms } = await getGlobal(false);
  const rows = inquiryRows(record);
  const isBooking = record.kind === 'booking';
  const subject = isBooking ? `Brezplačen posvet: ${record.name}` : `Sporočilo s spletne strani: ${record.name}`;
  const confirmationText = isBooking
    ? forms.booking.success.text
    : interpolate(forms.states.successText, { poslano: record.email });

  let emailStatus = 'sent';
  try {
    if (!resend) {
      console.info('[inquiry] RESEND_API_KEY missing – e-mails skipped', { subject, to: settings.notificationEmail });
      emailStatus = 'skipped';
    } else {
      const [notification, confirmation] = await Promise.all([
        render(InquiryNotification({ heading: subject, rows })),
        render(
          InquiryConfirmation({
            heading: forms.states.successTitle,
            text: confirmationText,
            nextSteps: isBooking ? forms.booking.success.nextSteps : [],
            rows: present(choiceRows(record)),
            signature: settings.trainer.name,
            siteName: settings.siteName,
          })
        ),
      ]);
      const results = await resend.batch.send([
        {
          from: serverEnv.EMAIL_FROM,
          to: settings.notificationEmail,
          replyTo: record.email,
          subject,
          html: notification,
        },
        {
          from: serverEnv.EMAIL_FROM,
          to: record.email,
          replyTo: settings.email,
          subject: `${forms.states.successTitle} – ${settings.siteName}`,
          html: confirmation,
        },
      ]);
      if (results.error) throw results.error;
    }
  } catch (error) {
    // The inquiry is stored; the trainer sees it in the Studio even if e-mail fails.
    console.error('[inquiry] e-mail delivery failed', error);
    emailStatus = 'failed';
  }

  // The inquiry is stored and the e-mails are out: a failed status update must not make the sender resubmit.
  try {
    await writeClient.patch(doc._id).set({ emailStatus }).commit();
  } catch (error) {
    console.error('[inquiry] could not record the e-mail status', error);
  }
}
