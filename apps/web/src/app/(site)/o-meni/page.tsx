import type { Metadata } from 'next';
import { CmsLink } from '@/components/cms-link';
import { JsonLd } from '@/components/json-ld';
import { CtaCard } from '@/components/sections/cta-card';
import { Arrow } from '@/components/ui/arrow';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { buttonStyles } from '@/components/ui/button';
import { Placeholder } from '@/components/ui/placeholder';
import { SanityImage } from '@/components/ui/sanity-image';
import { cn } from '@/lib/cn';
import { breadcrumbs, graph, ids, webPage } from '@/lib/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { pageName } from '@/lib/nav-label';
import { twoDigit } from '@/lib/number';
import { routes } from '@/lib/routes';
import { getAbout } from '@/sanity/queries/about';
import { getGlobal } from '@/sanity/queries/global';

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout(false);
  return buildMetadata({
    seo: about.seo,
    title: about.hero.heading,
    description: about.hero.lead,
    path: routes.about,
    type: 'profile',
  });
}

export default async function AboutPage() {
  const [about, { layout }] = await Promise.all([getAbout(), getGlobal()]);
  const { hero, story, approach, credentials } = about;
  const crumbs = [{ name: layout.labels.breadcrumbHome, href: routes.home }, { name: pageName(layout, 'about') }];
  const [leadParagraph, ...paragraphs] = story.paragraphs;

  return (
    <main>
      <JsonLd
        data={graph(
          webPage(routes.about, hero.heading, hero.lead, {
            '@type': 'ProfilePage',
            mainEntity: { '@id': ids.trainer },
            dateModified: about._updatedAt,
          }),
          {
            '@type': 'Person',
            '@id': ids.trainer,
            hasCredential: credentials.items.map((c) => ({
              '@type': 'EducationalOccupationalCredential',
              name: c.title,
              dateCreated: c.year,
              recognizedBy: { '@type': 'Organization', name: c.institution },
            })),
          },
          breadcrumbs([
            { name: layout.labels.breadcrumbHome, path: routes.home },
            { name: pageName(layout, 'about'), path: routes.about },
          ])
        )}
      />

      <section
        aria-labelledby="om-title"
        className="relative overflow-hidden border-hairline border-b pt-[168px] pb-[clamp(64px,8vw,112px)]"
        data-hero
      >
        <div aria-hidden className="deco2 top-10 right-[-3%] text-[clamp(420px,50vw,820px)]">
          2
        </div>
        <div className="wrap relative grid-fit items-end [--gap:clamp(40px,6vw,96px)] [--min:460px]">
          <div className="flex flex-col gap-6">
            <Breadcrumbs className="mb-1" items={crumbs} />
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="d1" id="om-title">
              {hero.heading}
            </h1>
            <p className="lead max-w-[560px]">{hero.lead}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <CmsLink className={cn(buttonStyles(), 'group flex-[1_1_100%] cta:flex-none')} link={hero.primaryCta}>
                {hero.primaryCta.label}
                <Arrow />
              </CmsLink>
              {hero.secondaryCta && (
                <CmsLink
                  className={cn(buttonStyles({ variant: 'line' }), 'flex-[1_1_100%] cta:flex-none')}
                  link={hero.secondaryCta}
                />
              )}
            </div>
          </div>
          <figure className="relative m-0">
            <SanityImage
              aspect={4 / 5}
              className="aspect-4/5 w-full"
              image={hero.portrait}
              preload
              sizes="(min-width: 960px) 45vw, 100vw"
            />
            <figcaption className="glass absolute inset-x-4 bottom-4 grid grid-cols-2">
              {hero.stats.map((stat, i) => (
                <span className={cn('px-4 py-3.5', i > 0 && 'border-white/10 border-l')} key={stat.value}>
                  <span className="block font-bold font-display text-[28px] leading-[30px]">{stat.value}</span>
                  <span className="text-[13px] text-muted">{stat.label}</span>
                </span>
              ))}
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="zgodba-title" className="sec">
        <div className="wrap grid-fit items-start [--gap:clamp(32px,6vw,96px)] [--min:380px]">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{story.eyebrow}</p>
            <h2 className="h2" id="zgodba-title">
              {story.heading}
            </h2>
          </div>
          <div className="flex max-w-[680px] flex-col gap-5">
            {leadParagraph && <p className="lead">{leadParagraph}</p>}
            {paragraphs.map((p) => (
              <p className="text-muted leading-[26px]" key={p}>
                {p}
              </p>
            ))}
            <blockquote className="m-0 mt-4 border-hairline border-t pt-6 font-display font-semibold text-[clamp(28px,3vw,40px)] uppercase leading-[1.1]">
              „{story.quote}“
            </blockquote>
          </div>
        </div>
      </section>

      <section aria-labelledby="pristop-title" className="sec border-hairline border-t" id="pristop">
        <div className="wrap">
          <div className="mb-[clamp(40px,5vw,64px)] flex max-w-[720px] flex-col gap-5">
            <p className="eyebrow">{approach.eyebrow}</p>
            <h2 className="h2" id="pristop-title">
              {approach.heading}
            </h2>
          </div>
          <ol className="m-0 grid-fit list-none border border-hairline bg-hairline p-0 [--gap:1px] [--min:260px]">
            {approach.items.map((item, i) => (
              <li className="flex flex-col gap-4 bg-black p-[clamp(24px,3vw,36px)]" key={item.title}>
                <span className="num">{twoDigit(i + 1)}</span>
                <h3 className="h3c">{item.title}</h3>
                <p className="text-[15px] text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="izobrazba-title" className="sec border-hairline border-t">
        <div className="wrap grid-fit items-start [--gap:clamp(32px,6vw,96px)] [--min:380px]">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{credentials.eyebrow}</p>
            <h2 className="h2" id="izobrazba-title">
              {credentials.heading}
            </h2>
          </div>
          <ul className="rows m-0 list-none p-0">
            {credentials.items.map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: entries may share placeholder text
              <li className="grid grid-cols-[88px_1fr] gap-4 py-5" key={i}>
                <span className="num">{c.year}</span>
                <span>
                  <strong className="block font-semibold text-[17px]">{c.title}</strong>
                  <span className="text-muted text-sm">{c.institution}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Galerija" className="pb-[clamp(72px,10vw,136px)]">
        <div className="wrap grid-fit [--gap:16px] [--min:280px]">
          {about.gallery?.length
            ? about.gallery.map((image) => (
                <SanityImage
                  aspect={4 / 5}
                  className="aspect-4/5 w-full"
                  image={image}
                  key={image.asset._id}
                  sizes="(min-width: 960px) 30vw, 100vw"
                />
              ))
            : [1, 2, 3].map((n) => <Placeholder className="aspect-4/5" key={n} />)}
        </div>
      </section>

      <CtaCard cta={about.cta} />
    </main>
  );
}
