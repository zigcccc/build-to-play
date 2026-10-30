import Link from 'next/link';
import { routes } from '@/lib/routes';

/** Site-wide values the form wording mentions (from Nastavitve strani). Plain strings, so they cross to the client. */
export type FormVars = {
  /** Response time, e.g. "24 urah". */
  rok: string;
  /** Consultation length, e.g. "30 minut". */
  trajanje: string;
  email: string;
};

/**
 * Fixed wording of the contact form and the booking flow. It describes how the forms work, so it lives in code;
 * only the options a visitor picks from (contact subjects, booking goals) are edited in the CMS.
 */
export const formsCopy = ({ rok, trajanje, email }: FormVars) => ({
  labels: {
    name: 'Ime in priimek',
    email: 'E-pošta',
    phone: 'Telefon',
    subject: 'Zadeva',
    program: 'Program',
    message: 'Sporočilo',
    goal: 'Kaj želiš doseči?',
    bookingMessage: 'Še kaj, kar naj vem?',
    optional: '(neobvezno)',
    requiredNote: 'Polja z * so obvezna.',
  },
  placeholders: {
    name: 'Janez Novak',
    email: 'janez@primer.si',
    phone: '041 123 456',
    program: 'Izberi program',
    message: 'Kako ti lahko pomagam?',
    goal: 'Npr. želim se pripraviti na novo sezono, imam 2 treninga na teden …',
    bookingMessage: 'Npr. poškodbe, izkušnje s treningom, šport …',
  },
  errors: {
    name: 'Vpiši ime in priimek.',
    emailEmpty: 'Vpiši e-poštni naslov.',
    emailInvalid: 'E-poštni naslov ni pravilen.',
    message: 'Napiši nekaj besed.',
    consent: 'Za pošiljanje potrebujem tvoje soglasje.',
    goal: 'Izberi, kaj želiš doseči.',
    summary: 'Preveri označena polja.',
  },
  states: {
    sending: 'Pošiljam …',
    successTitle: 'Hvala, prejel sem.',
    successText: (sentTo: string) =>
      `Odgovorim v ${rok} na ${sentTo}. Kopija sporočila je na poti v tvoj e-poštni predal.`,
    successTextHome: `Odgovorim v ${rok}. Medtem me lahko spremljaš na Instagramu.`,
    sendAnother: 'Pošlji novo sporočilo',
    failure: `Sporočila ni bilo mogoče poslati. Poskusi znova ali piši na ${email}.`,
    retry: 'Poskusi znova',
  },
  contact: {
    submit: 'Pošlji sporočilo',
    submitHome: 'Pošlji povpraševanje',
    programUnknown: 'Ne vem še',
  },
  booking: {
    title: 'Brezplačen posvet',
    stepLabel: (step: number, total: number) => `korak ${step} od ${total}`,
    next: 'Naprej',
    submit: 'Pošlji povpraševanje',
    step1: {
      title: 'Kaj želiš doseči?',
      subtitle: 'Izberi, kar je najbližje. Podrobnosti doreševa na posvetu.',
      programLabel: 'Program, ki te zanima',
    },
    step2: {
      title: 'Kdaj ti ustreza?',
      subtitle: `Na podlagi tega ti predlagam termin. Posvet traja ${trajanje}.`,
      modeLabel: 'Oblika posveta',
      modeLive: 'V živo',
      modeVideo: 'Video klic',
      locationLabel: 'Lokacija',
      anyLocation: 'Vseeno mi je',
      daysLabel: 'Dnevi, ki ti ustrezajo',
      timesLabel: 'Del dneva',
    },
    step3: { title: 'Kam ti pišem?', subtitle: `Predlog termina pošljem v ${rok}.` },
    success: {
      title: 'Hvala, prejel sem.',
      text: 'Potrdilo je na poti v tvoj e-poštni predal.',
      goalLabel: 'Cilj',
      modeLabel: 'Oblika',
      whenLabel: 'Termini',
      anytime: 'Kadarkoli',
      nextHeading: 'Kaj sledi',
      nextSteps: [
        `V ${rok} ti pošljem predlog termina.`,
        'Termin potrdiva po e-pošti ali telefonu.',
        'Spoznava se — brez obveznosti.',
      ],
      close: 'Nazaj na stran',
    },
    closeConfirm: {
      title: 'Zapreš obrazec?',
      text: 'Vneseni podatki se ne bodo shranili. Posvet lahko rezerviraš tudi kasneje.',
      stay: 'Nadaljuj',
      discard: 'Zapri',
    },
  },
  email: {
    bookingSubject: (sender: string) => `Brezplačen posvet: ${sender}`,
    contactSubject: (sender: string) => `Sporočilo s spletne strani: ${sender}`,
  },
});

export type FormsCopy = ReturnType<typeof formsCopy>;

/** The consent checkbox label, linking to the privacy policy. */
export function ConsentLabel() {
  return (
    <>
      Strinjam se z obdelavo osebnih podatkov v skladu s{' '}
      <Link
        className="cursor-pointer text-accent underline underline-offset-2 hover:text-accent-hover"
        href={routes.privacy}
      >
        politiko zasebnosti
      </Link>
      .
    </>
  );
}
