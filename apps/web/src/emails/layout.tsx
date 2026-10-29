import type { ReactNode } from 'react';
import { Body, Container, Head, Html, Preview, Section, Text } from 'react-email';

// E-mail clients need inline hex colours; these mirror the site tokens.
export const colors = {
  black: '#040506',
  surface: '#161616',
  ink: '#ffffff',
  muted: '#8f8c86',
  accent: '#b39a72',
  hairline: '#2b2a28',
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="sl">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          backgroundColor: colors.black,
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: colors.ink,
        }}
      >
        <Container style={{ maxWidth: 560, padding: '40px 24px' }}>
          <Text style={{ margin: '0 0 32px', fontSize: 14, letterSpacing: '0.3em', fontWeight: 700 }}>
            BUILD<span style={{ color: colors.accent }}>2</span>PLAY
          </Text>
          {children}
          <Section style={{ marginTop: 40, borderTop: `1px solid ${colors.hairline}`, paddingTop: 16 }}>
            <Text style={{ margin: 0, fontSize: 12, color: colors.muted, letterSpacing: '0.25em' }}>
              TRAIN. BUILD. PERFORM.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <Section style={{ backgroundColor: colors.surface, border: `1px solid ${colors.hairline}`, padding: '8px 20px' }}>
      {rows.map(([label, value]) => (
        <Text key={label} style={{ margin: '12px 0', fontSize: 15, lineHeight: '22px' }}>
          <span
            style={{
              display: 'block',
              color: colors.muted,
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
          <span style={{ whiteSpace: 'pre-wrap' }}>{value}</span>
        </Text>
      ))}
    </Section>
  );
}
