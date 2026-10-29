import type { Metadata } from 'next';
import { CmsLink } from '@/components/cms-link';
import { JsonLd } from '@/components/json-ld';
import { LocationsMap } from '@/components/map/locations-map';
import { AboutTeaser } from '@/components/sections/home/about-teaser';
import { Consultation } from '@/components/sections/home/consultation';
import { HomeContact } from '@/components/sections/home/contact';
import { HomeHero } from '@/components/sections/home/hero';
import { Marquee } from '@/components/sections/home/marquee';
import { Results } from '@/components/sections/home/results';
import { LocationsList } from '@/components/sections/locations-list';
import { ProgramCards } from '@/components/sections/program-cards';
import { accentHeadingText } from '@/components/ui/accent-heading';
import { Arrow } from '@/components/ui/arrow';
import { buttonStyles } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { SectionTitle } from '@/components/ui/section-title';
import { graph, ids, webPage } from '@/lib/json-ld';
import { buildMetadata, plain } from '@/lib/metadata';
import { getGlobal } from '@/sanity/queries/global';
import { getHome } from '@/sanity/queries/home';

export async function generateMetadata(): Promise<Metadata> {
  const [home, { settings }] = await Promise.all([getHome(false), getGlobal(false)]);
  return {
    ...(await buildMetadata({
      seo: home.seo,
      title: settings.siteName,
      description: settings.description,
      path: '/',
    })),
    // The home page uses the bare title, not the "%s | Build 2 Play" template.
    title: { absolute: plain(home.seo?.title ?? settings.seo?.title ?? settings.siteName) },
  };
}

export default async function HomePage() {
  const [home, global] = await Promise.all([getHome(), getGlobal()]);
  const { settings, layout, programs, locations } = global;

  return (
    <main>
      <JsonLd
        data={graph(
          webPage('/', accentHeadingText(home.hero.heading), home.seo?.description ?? settings.description, {
            '@type': ['WebPage', 'AboutPage'],
            mainEntity: { '@id': ids.business },
          })
        )}
      />
      <HomeHero hero={home.hero} />
      <Marquee items={home.marquee} />
      <AboutTeaser about={home.about} trainer={settings.trainer} />

      <section aria-labelledby="programi-title" className="sec border-hairline border-t" id="programi">
        <div className="wrap">
          <SectionHeader
            aside={
              <>
                <p>{home.programs.intro}</p>
                <CmsLink className={`${buttonStyles({ variant: 'text' })} group`} link={home.programs.link}>
                  {home.programs.link.label}
                  <Arrow />
                </CmsLink>
              </>
            }
            eyebrow={home.programs.eyebrow}
            heading={home.programs.heading}
            id="programi-title"
          />
        </div>
        <ProgramCards labels={layout.labels} programs={programs} />
      </section>

      <Consultation data={home.consultation} />
      <Results data={home.results} />

      <section aria-labelledby="lokacije-title" className="sec border-hairline border-t" id="lokacije">
        <div className="wrap grid-fit items-start [--gap:clamp(40px,6vw,96px)] [--min:460px]">
          <SectionTitle
            className="gap-6"
            eyebrow={home.locations.eyebrow}
            heading={home.locations.heading}
            id="lokacije-title"
          >
            <LocationsList
              directionsLabel={layout.labels.directions}
              locations={locations}
              online={home.locations.online}
            />
          </SectionTitle>
          <LocationsMap className="aspect-4/3 w-full" locations={locations} />
        </div>
      </section>

      <HomeContact data={home.contact} global={global} />
    </main>
  );
}
