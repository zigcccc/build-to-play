import { Heading, Text } from 'react-email';
import { twoDigit } from '@/lib/number';
import { colors, EmailLayout, Rows } from './layout';

type Props = {
  heading: string;
  text: string;
  nextSteps: string[];
  rows: [string, string][];
  signature: string;
  siteName: string;
};

/** Copy of the submission sent to the visitor; texts come from the CMS form copy. */
export function InquiryConfirmation({ heading, text, nextSteps, rows, signature, siteName }: Props) {
  return (
    <EmailLayout preview={text}>
      <Heading
        style={{ margin: '0 0 16px', fontSize: 32, lineHeight: '34px', textTransform: 'uppercase', color: colors.ink }}
      >
        {heading}
      </Heading>
      <Text style={{ margin: '0 0 24px', fontSize: 16, lineHeight: '24px', color: colors.muted }}>{text}</Text>
      {nextSteps.map((step, i) => (
        <Text key={step} style={{ margin: '0 0 8px', fontSize: 15, lineHeight: '22px' }}>
          <span style={{ color: colors.accent, fontWeight: 700, marginRight: 12 }}>{twoDigit(i + 1)}</span>
          {step}
        </Text>
      ))}
      <div style={{ height: 16 }} />
      <Rows rows={rows} />
      <Text style={{ margin: '24px 0 0', fontSize: 15 }}>
        {signature}
        <br />
        <span style={{ color: colors.muted }}>{siteName}</span>
      </Text>
    </EmailLayout>
  );
}

export default function Preview() {
  return (
    <InquiryConfirmation
      heading="Hvala, prejel sem."
      nextSteps={['V 24 urah ti pošljem predlog termina.', 'Termin potrdiva po e-pošti ali telefonu.']}
      rows={[['Ime in priimek', 'Janez Novak']]}
      signature="Ime Priimek"
      siteName="Build 2 Play"
      text="Potrdilo je na poti v tvoj e-poštni predal."
    />
  );
}
