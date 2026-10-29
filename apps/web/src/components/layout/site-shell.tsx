import type { ReactNode } from 'react';
import { BookingProvider } from '@/components/booking/booking-context';
import { JsonLd } from '@/components/json-ld';
import { InlineText } from '@/components/portable-text';
import { ConsentProvider } from '@/components/preferences/preferences-context';
import { siteGraph } from '@/lib/json-ld';
import { getGlobal } from '@/sanity/queries/global';
import { Footer } from './footer';
import { Header } from './header';

/**
 * Everything around a public page: site JSON-LD, cookie consent, the booking flow, header and footer.
 * The coming-soon page (app/kmalu) is the one page without it.
 */
export async function SiteShell({ children }: { children: ReactNode }) {
  const global = await getGlobal();
  const { forms, cookies, programs, locations, settings } = global;

  return (
    <>
      <JsonLd data={siteGraph(global)} />
      <ConsentProvider copy={cookies}>
        <BookingProvider
          consent={<InlineText value={forms.labels.consent} />}
          copy={forms}
          locations={locations.map(({ _id, name }) => ({ _id, name }))}
          programs={programs.map((p) => ({ key: p.slug, label: p.shortLabel }))}
          socials={{ instagram: settings.socials.find((s) => s.platform === 'instagram')?.url }}
        >
          <Header />
          {children}
          <Footer />
        </BookingProvider>
      </ConsentProvider>
    </>
  );
}
