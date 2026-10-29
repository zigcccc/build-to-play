import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { Suspense } from 'react';
import { BookingProvider } from '@/components/booking/booking-context';
import { ConsentProvider } from '@/components/consent/consent-context';
import { JsonLd } from '@/components/json-ld';
import { DraftTools } from '@/components/layout/draft-tools';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { InlineText } from '@/components/portable-text';
import { siteUrl } from '@/env/client';
import { siteGraph } from '@/lib/json-ld';
import { plain } from '@/lib/metadata';
import { getGlobal } from '@/sanity/queries/global';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' });
const barlow = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  variable: '--font-barlow',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#040506',
  colorScheme: 'dark',
};

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getGlobal(false);
  const siteName = plain(settings.siteName);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: plain(settings.seo?.title ?? siteName), template: `%s | ${siteName}` },
    description: plain(settings.seo?.description ?? settings.description),
    applicationName: siteName,
    openGraph: { siteName, locale: 'sl_SI', type: 'website' },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const global = await getGlobal();
  const { forms, cookies, programs, locations, settings } = global;

  return (
    <html className={`${inter.variable} ${barlow.variable}`} lang="sl">
      <body>
        <JsonLd data={siteGraph(global)} />
        <ConsentProvider copy={cookies}>
          <BookingProvider
            consent={<InlineText value={forms.labels.consent} />}
            copy={forms}
            locations={locations.map(({ _id, name }) => ({ _id, name }))}
            programs={programs.map((p) => ({ key: p.key, label: p.shortLabel }))}
            socials={{ instagram: settings.socials.find((s) => s.platform === 'instagram')?.url }}
          >
            <Header />
            {children}
            <Footer />
          </BookingProvider>
        </ConsentProvider>
        <Suspense>
          <DraftTools />
        </Suspense>
      </body>
    </html>
  );
}
