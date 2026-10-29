import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { Suspense } from 'react';
import { DraftTools } from '@/components/layout/draft-tools';
import { siteUrl } from '@/env/client';
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

// Only the document; the site itself (consent, booking, header, footer) lives in SiteShell so the coming-soon page can
// stand without it.
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html className={`${inter.variable} ${barlow.variable}`} lang="sl">
      <body>
        {children}
        <Suspense>
          <DraftTools />
        </Suspense>
      </body>
    </html>
  );
}
