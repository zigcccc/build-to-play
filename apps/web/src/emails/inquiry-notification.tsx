import { Heading } from 'react-email';
import { colors, EmailLayout, Rows } from './layout';

type Props = { heading: string; rows: [string, string][] };

/** Sent to the trainer; "reply" goes straight to the visitor. */
export function InquiryNotification({ heading, rows }: Props) {
  return (
    <EmailLayout preview={heading}>
      <Heading style={{ margin: '0 0 24px', fontSize: 26, lineHeight: '30px', color: colors.ink }}>{heading}</Heading>
      <Rows rows={rows} />
    </EmailLayout>
  );
}

export default function Preview() {
  return (
    <InquiryNotification
      heading="Brezplačen posvet: Janez Novak"
      rows={[
        ['Ime in priimek', 'Janez Novak'],
        ['E-pošta', 'janez@primer.si'],
        ['Cilj', 'Priprava na šport ali sezono'],
      ]}
    />
  );
}
