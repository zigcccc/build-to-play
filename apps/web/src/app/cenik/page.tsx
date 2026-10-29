import type { Metadata } from 'next';
import Link from 'next/link';
import { CmsLink } from '@/components/cms-link';
import { CmsIcon } from '@/components/icons';
import { JsonLd } from '@/components/json-ld';
import { CtaCard } from '@/components/sections/cta-card';
import { FaqSection } from '@/components/sections/faq-section';
import { PackageCards } from '@/components/sections/package-cards';
import { Arrow } from '@/components/ui/arrow';
import { buttonStyles } from '@/components/ui/button';
import { PageHero } from '@/components/ui/page-hero';
import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/cn';
import { absolute, breadcrumbs, faqPage, graph, ids, webPage } from '@/lib/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { toPlainText } from '@/lib/portable-text';
import { routes } from '@/lib/routes';
import { getGlobal } from '@/sanity/queries/global';
import { getPricing } from '@/sanity/queries/pricing';

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getPricing(false);
  return buildMetadata({ seo: page.seo, title: page.hero.heading, description: page.hero.lead, path: routes.pricing });
}

export default async function PricingPage() {
  const [{ page, programs }, { layout }] = await Promise.all([getPricing(), getGlobal()]);
  const crumbs = [{ name: layout.labels.breadcrumbHome, href: routes.home }, { name: page.hero.eyebrow }];

  const programLink = (p: (typeof programs)[number], className: string) => (
    <Link className={cn(buttonStyles({ variant: 'text' }), 'group', className)} href={routes.program(p.slug)}>
      {page.packages.programLinkLabel} {p.pricingLabel}
      <Arrow />
    </Link>
  );

  return (
    <main>
      <JsonLd
        data={graph(
          webPage(routes.pricing, page.hero.heading, page.hero.lead, {
            mainEntity: { '@id': `${absolute(routes.pricing)}#catalog` },
          }),
          {
            '@type': 'OfferCatalog',
            '@id': `${absolute(routes.pricing)}#catalog`,
            name: page.hero.heading,
            itemListElement: programs.map((p) => ({
              '@type': 'OfferCatalog',
              name: p.name,
              url: absolute(routes.program(p.slug)),
              itemListElement: p.packages.map((pk) => ({
                '@type': 'Offer',
                name: `${p.name} – ${pk.name}`,
                priceCurrency: 'EUR',
                ...(pk.price != null ? { price: pk.price } : {}),
                seller: { '@id': ids.business },
              })),
            })),
          },
          faqPage(page.faq.items.map((f) => ({ question: f.question, answerText: toPlainText(f.answer) }))),
          breadcrumbs(crumbs.map((c) => ({ name: c.name, path: c.href ?? routes.pricing })))
        )}
      />
      <PageHero crumbs={crumbs} deco eyebrow={page.hero.eyebrow} lead={page.hero.lead} title={page.hero.heading} />

      <section aria-labelledby="posvet-card-title" className="pb-[clamp(48px,6vw,80px)]">
        <div className="wrap">
          <div className="card flex flex-wrap items-center justify-between gap-x-12 gap-y-6 border-accent p-[clamp(24px,3vw,36px)]">
            <div className="flex flex-wrap items-center gap-6">
              <span className="font-bold font-display text-[64px] text-accent leading-[56px]">
                {page.consultation.price}
              </span>
              <span className="flex flex-col gap-1">
                <strong className="font-semibold text-xl" id="posvet-card-title">
                  {page.consultation.title}
                </strong>
                <span className="text-[15px] text-muted leading-[22px]">{page.consultation.text}</span>
              </span>
            </div>
            <CmsLink className={cn(buttonStyles(), 'group')} link={page.consultation.cta}>
              {page.consultation.cta.label}
              <Arrow />
            </CmsLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="paketi-title" className="pb-[clamp(72px,10vw,136px)]">
        <div className="wrap">
          <h2 className="sr-only" id="paketi-title">
            {page.packages.heading}
          </h2>
          <Tabs
            after={Object.fromEntries(programs.map((p) => [p.key, programLink(p, 'mt-6 cta:hidden')]))}
            aside={Object.fromEntries(programs.map((p) => [p.key, programLink(p, 'hidden cta:inline-flex')]))}
            className="flex flex-col gap-8"
            items={programs.map((p) => ({
              value: p.key,
              label: p.shortLabel,
              panel: (
                <>
                  <h3 className="sr-only">{p.name}</h3>
                  <PackageCards featuredLabel={layout.labels.featured} packages={p.packages} program={p.key} />
                </>
              ),
            }))}
            label="Program"
            listClassName="w-[min(100%,520px)]"
          />
        </div>
      </section>

      <section aria-labelledby="pogoji-title" className="sec border-hairline border-t bg-surface">
        <div className="wrap">
          <div className="mb-[clamp(40px,5vw,64px)] flex max-w-[720px] flex-col gap-5">
            <p className="eyebrow">{page.conditions.eyebrow}</p>
            <h2 className="h2" id="pogoji-title">
              {page.conditions.heading}
            </h2>
          </div>
          <ul className="m-0 grid-fit list-none p-0 [--gap:32px] [--min:240px]">
            {page.conditions.items.map((item) => (
              <li className="flex flex-col gap-3 border-hairline border-t pt-6" key={item.title}>
                <CmsIcon className="text-accent" name={item.icon} size={24} />
                <h3 className="m-0 font-semibold text-lg">{item.title}</h3>
                <p className="text-[15px] text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection
        eyebrow={page.faq.eyebrow}
        faqs={page.faq.items}
        heading={page.faq.heading}
        help={{ text: layout.labels.faqHelp, link: layout.labels.faqHelpLink }}
      />

      <CtaCard cta={page.cta} />
    </main>
  );
}
