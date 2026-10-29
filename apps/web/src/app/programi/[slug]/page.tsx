import { Check } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CmsLink } from '@/components/cms-link';
import { JsonLd } from '@/components/json-ld';
import { CtaCard } from '@/components/sections/cta-card';
import { FaqSection } from '@/components/sections/faq-section';
import { PackageCards } from '@/components/sections/package-cards';
import { Arrow } from '@/components/ui/arrow';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { buttonStyles } from '@/components/ui/button';
import { SanityImage } from '@/components/ui/sanity-image';
import { cn } from '@/lib/cn';
import { absolute, breadcrumbs, faqPage, graph, ids, webPage } from '@/lib/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { toPlainText } from '@/lib/portable-text';
import { formatPrice } from '@/lib/price';
import { routes } from '@/lib/routes';
import { getGlobal } from '@/sanity/queries/global';
import { getProgramPage, getProgramSlugs } from '@/sanity/queries/program';

export async function generateStaticParams() {
  const slugs = await getProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/programi/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const { program } = await getProgramPage(slug, false);
  if (!program) return {};
  return buildMetadata({
    seo: program.seo,
    title: program.name,
    description: program.lead,
    path: routes.program(slug),
  });
}

export default function ProgramPage({ params }: PageProps<'/programi/[slug]'>) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <ProgramContent params={params} />
    </Suspense>
  );
}

async function ProgramContent({ params }: Pick<PageProps<'/programi/[slug]'>, 'params'>) {
  const { slug } = await params;
  const [{ program, template: t }, { layout, programs }] = await Promise.all([getProgramPage(slug), getGlobal()]);
  if (!program) notFound();

  const path = routes.program(slug);
  const num = String(program.order).padStart(2, '0');
  const others = programs.filter((p) => p._id !== program._id);
  const steps = [
    t.steps.step1,
    { title: t.steps.step2Title, text: program.assessmentStep },
    t.steps.step3,
    t.steps.step4,
  ];
  const crumbs = [
    { name: layout.labels.breadcrumbHome, href: routes.home },
    { name: layout.labels.breadcrumbPrograms, href: `${routes.home}#programi` },
    { name: program.name },
  ];

  return (
    <main>
      <JsonLd
        data={graph(
          webPage(path, program.name, program.lead, {
            mainEntity: { '@id': `${absolute(path)}#service` },
            dateModified: program._updatedAt,
          }),
          {
            '@type': 'Service',
            '@id': `${absolute(path)}#service`,
            name: program.name,
            description: program.lead,
            serviceType: program.name,
            url: absolute(path),
            provider: { '@id': ids.business },
            areaServed: { '@id': ids.business },
            audience: { '@type': 'Audience', audienceType: program.forWho.map((w) => w.title).join(', ') },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: program.name,
              itemListElement: program.packages.map((pk) => ({
                '@type': 'Offer',
                name: pk.name,
                description: [pk.note, ...pk.features].filter(Boolean).join(' · '),
                priceCurrency: 'EUR',
                ...(pk.price != null
                  ? {
                      price: pk.price,
                      priceSpecification: {
                        '@type': 'UnitPriceSpecification',
                        price: pk.price,
                        priceCurrency: 'EUR',
                        unitText: pk.unit ?? undefined,
                      },
                    }
                  : {}),
                seller: { '@id': ids.business },
              })),
            },
          },
          faqPage(program.faqs.map((f) => ({ question: f.question, answerText: toPlainText(f.answer) }))),
          breadcrumbs(crumbs.map((c) => ({ name: c.name, path: c.href ?? path })))
        )}
      />

      <section
        aria-labelledby="pg-title"
        className="relative overflow-hidden border-hairline border-b pt-[168px] pb-[clamp(64px,8vw,112px)]"
        data-hero
      >
        <div className="wrap grid-fit items-end [--gap:clamp(40px,6vw,96px)] [--min:460px]">
          <div className="flex flex-col gap-6">
            <Breadcrumbs className="mb-1" items={crumbs} />
            <p className="eyebrow">
              {t.hero.eyebrowPrefix} {num}
            </p>
            <h1 className="d1" id="pg-title">
              {program.name}
            </h1>
            <p className="lead max-w-[560px]">{program.lead}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <CmsLink
                className={cn(buttonStyles(), 'group flex-[1_1_100%] cta:flex-none')}
                link={t.hero.primaryCta}
                program={program.key}
              >
                {t.hero.primaryCta.label}
                <Arrow />
              </CmsLink>
              <a className={cn(buttonStyles({ variant: 'line' }), 'flex-[1_1_100%] cta:flex-none')} href="#cene">
                {t.hero.pricesLabel}
              </a>
            </div>
          </div>
          <div className="relative">
            <SanityImage
              aspect={4 / 5}
              className="aspect-4/5 w-full object-cover"
              image={program.heroImage}
              preload
              sizes="(min-width: 960px) 45vw, 100vw"
            />
            <div className="glass absolute bottom-4 left-4 flex items-baseline gap-2 px-[18px] py-3.5">
              <span className="label">{layout.labels.priceFrom}</span>
              <span className="font-bold font-display text-[32px] leading-8">{formatPrice(program.priceFrom)}</span>
              <span className="text-muted text-sm">{program.priceFrom.unit}</span>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="zakoga-title" className="sec">
        <div className="wrap">
          <div className="mb-[clamp(40px,5vw,64px)] flex max-w-[720px] flex-col gap-5">
            <p className="eyebrow">{t.forWho.eyebrow}</p>
            <h2 className="h2" id="zakoga-title">
              {t.forWho.heading}
            </h2>
          </div>
          <ul className="m-0 grid-fit list-none border border-hairline bg-hairline p-0 [--gap:1px] [--min:260px]">
            {program.forWho.map((w) => (
              <li className="flex flex-col gap-3.5 bg-black p-[clamp(24px,3vw,32px)]" key={w.title}>
                <Check aria-hidden className="text-accent" size={24} />
                <h3 className="m-0 font-semibold text-lg">{w.title}</h3>
                <p className="text-[15px] text-muted">{w.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="dobis-title" className="sec border-hairline border-t">
        <div className="wrap grid-fit items-start [--gap:clamp(32px,6vw,96px)] [--min:400px]">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{t.includes.eyebrow}</p>
            <h2 className="h2" id="dobis-title">
              {t.includes.heading}
            </h2>
            <p className="lead max-w-[440px] text-muted">{program.includesLead}</p>
          </div>
          <ul className="rows m-0 list-none p-0">
            {program.includes.map((item, i) => (
              <li className="flex min-h-16 items-center gap-4 py-3 text-[17px]" key={item}>
                <span className="num w-8 flex-none">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="potek-title" className="sec border-hairline border-t bg-surface">
        <div className="wrap">
          <div className="mb-[clamp(40px,5vw,64px)] flex max-w-[720px] flex-col gap-5">
            <p className="eyebrow">{t.steps.eyebrow}</p>
            <h2 className="h2" id="potek-title">
              {t.steps.heading}
            </h2>
          </div>
          <ol className="m-0 grid-fit list-none p-0 [--gap:32px] [--min:220px]">
            {steps.map((step, i) => (
              <li className="flex flex-col gap-3 border-accent border-t pt-6" key={step.title}>
                <span className="font-bold font-display text-[56px] text-accent leading-[52px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="m-0 font-semibold text-lg">{step.title}</h3>
                <p className="text-[15px] text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cene-title" className="sec border-hairline border-t" id="cene">
        <div className="wrap">
          <div className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <div className="flex flex-col gap-5">
              <p className="eyebrow">{t.pricing.eyebrow}</p>
              <h2 className="h2" id="cene-title">
                {t.pricing.heading}
              </h2>
            </div>
            <Link className={`${buttonStyles({ variant: 'text' })} group`} href={routes.pricing}>
              {layout.labels.fullPricing}
              <Arrow />
            </Link>
          </div>
          <PackageCards featuredLabel={layout.labels.featured} packages={program.packages} program={program.key} />
          <p className="mt-6 text-muted text-sm">{t.pricing.vatNote}</p>
        </div>
      </section>

      <FaqSection
        eyebrow={t.faq.eyebrow}
        faqs={program.faqs}
        heading={t.faq.heading}
        help={{ text: layout.labels.faqHelp, link: layout.labels.faqHelpLink }}
      />

      <section aria-labelledby="drugi-title" className="pb-[clamp(72px,10vw,136px)]">
        <div className="wrap">
          <p className="eyebrow mb-6" id="drugi-title">
            {t.others.eyebrow}
          </p>
          <div className="grid-fit border border-hairline bg-hairline [--gap:1px] [--min:320px]">
            {others.map((o) => (
              <Link
                className="group flex flex-col gap-4 bg-black p-[clamp(24px,3vw,36px)] text-ink transition-colors hover:bg-surface hover:text-ink"
                href={routes.program(o.slug)}
                key={o._id}
              >
                <span className="num">{String(o.order).padStart(2, '0')}</span>
                <span className="font-bold font-display text-4xl uppercase leading-9">{o.name}</span>
                <span className="text-[15px] text-muted">{o.otherShort}</span>
                <span className={`${buttonStyles({ variant: 'text' })} self-start`}>
                  {layout.labels.moreAboutProgram}
                  <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaCard cta={t.cta} program={program.key} />
    </main>
  );
}
