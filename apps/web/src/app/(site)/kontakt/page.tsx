import { Mail, Navigation, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/forms/contact-form';
import { SocialIcon, socialLabel } from '@/components/icons';
import { JsonLd } from '@/components/json-ld';
import { LocationsMap } from '@/components/map/locations-map';
import { InlineText } from '@/components/portable-text';
import { PageHero } from '@/components/ui/page-hero';
import { breadcrumbs, graph, ids, webPage } from '@/lib/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { pageName } from '@/lib/nav-label';
import { toPlainText } from '@/lib/portable-text';
import { routes } from '@/lib/routes';
import { getContactPage } from '@/sanity/queries/contact';
import { formVars, getGlobal } from '@/sanity/queries/global';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage(false);
  return buildMetadata({
    seo: page.seo,
    title: page.hero.heading,
    description: toPlainText(page.hero.lead),
    path: routes.contact,
  });
}

const rowClass = 'flex min-h-16 items-center gap-4 text-ink hover:text-accent';

export default async function ContactPage() {
  const [page, global] = await Promise.all([getContactPage(), getGlobal()]);
  const { settings, layout, forms, programs, locations } = global;
  const crumbs = [{ name: layout.labels.breadcrumbHome, href: routes.home }, { name: pageName(layout, 'contact') }];

  return (
    <main>
      <JsonLd
        data={graph(
          webPage(routes.contact, page.hero.heading, toPlainText(page.hero.lead), {
            '@type': 'ContactPage',
            mainEntity: { '@id': ids.business },
          }),
          breadcrumbs(crumbs, routes.contact)
        )}
      />
      <PageHero
        className="pb-[clamp(40px,5vw,64px)]"
        crumbs={crumbs}
        eyebrow={page.hero.eyebrow}
        lead={
          <p className="max-w-[600px] text-muted">
            <InlineText value={page.hero.lead} />
          </p>
        }
        title={page.hero.heading}
      />

      <section aria-label={page.formHeading} className="pb-[clamp(72px,10vw,120px)]">
        <div className="wrap flex flex-wrap items-start gap-x-[clamp(40px,6vw,96px)] gap-y-12">
          <div className="card min-w-0 flex-[999_1_520px] p-[clamp(24px,4vw,44px)]">
            <ContactForm
              heading={page.formHeading}
              programs={programs.map((p) => ({ key: p.slug, label: p.name }))}
              subjects={forms.subjects}
              variant="contact"
              vars={formVars(settings)}
            />
          </div>

          <aside className="flex flex-[1_1_320px] flex-col gap-10">
            <div>
              <h2 className="eyebrow mb-3">{page.directHeading}</h2>
              <ul className="rows m-0 list-none p-0">
                <li>
                  <a className={rowClass} href={`tel:${settings.phone.e164}`}>
                    <Phone aria-hidden className="text-accent" size={20} />
                    <span className="font-medium">{settings.phone.display}</span>
                  </a>
                </li>
                <li>
                  <a className={rowClass} href={`mailto:${settings.email}`}>
                    <Mail aria-hidden className="text-accent" size={20} />
                    <span className="font-medium">{settings.email}</span>
                  </a>
                </li>
                {settings.socials.map((s) => (
                  <li key={s.platform}>
                    <a
                      aria-label={`${socialLabel[s.platform]}: ${s.handle}`}
                      className={rowClass}
                      href={s.url}
                      rel="noopener"
                      target="_blank"
                    >
                      <span className="text-accent">
                        <SocialIcon platform={s.platform} />
                      </span>
                      <span className="font-medium">{s.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="eyebrow mb-3">{page.hoursHeading}</h2>
              <dl className="rows m-0">
                {settings.openingHours.map((row) => (
                  <div className="flex justify-between gap-4 py-3.5" key={row.label}>
                    <dt className="text-muted">{row.label}</dt>
                    <dd className="m-0 font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h2 className="eyebrow mb-3">{page.locationsHeading}</h2>
              <ul className="rows m-0 list-none p-0">
                {locations.map((l) => (
                  <li className="flex items-center justify-between gap-4 py-4" key={l._id}>
                    <span>
                      <strong className="block font-semibold">{l.name}</strong>
                      <address className="text-muted text-sm not-italic">
                        {l.street}, {l.city}
                      </address>
                    </span>
                    {l.mapsUrl && (
                      <a
                        aria-label={`${layout.labels.directions}: ${l.name}`}
                        className="inline-flex size-11 flex-none items-center justify-center border border-control text-ink hover:border-ink"
                        href={l.mapsUrl}
                        rel="noopener"
                        target="_blank"
                      >
                        <Navigation aria-hidden size={18} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section aria-label={page.locationsHeading} className="pb-[clamp(72px,10vw,120px)]">
        <div className="wrap">
          <LocationsMap className="h-[clamp(280px,36vw,480px)] w-full" locations={locations} />
        </div>
      </section>
    </main>
  );
}
