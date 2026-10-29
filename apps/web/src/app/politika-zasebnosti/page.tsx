import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { LegalText } from '@/components/legal-text';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { formatDate } from '@/lib/date';
import { breadcrumbs, graph, webPage } from '@/lib/json-ld';
import { buildMetadata } from '@/lib/metadata';
import { routes } from '@/lib/routes';
import { getGlobal } from '@/sanity/queries/global';
import { getPrivacy } from '@/sanity/queries/legal';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPrivacy(false);
  return buildMetadata({ seo: page.seo, title: page.title, description: page.title, path: routes.privacy });
}

const num = (i: number) => String(i + 1).padStart(2, '0');

export default async function PrivacyPage() {
  const [page, { layout }] = await Promise.all([getPrivacy(), getGlobal()]);
  const crumbs = [{ name: layout.labels.breadcrumbHome, href: routes.home }, { name: page.title }];

  return (
    <main>
      <JsonLd
        data={graph(
          webPage(routes.privacy, page.title, page.seo?.description ?? page.title, { dateModified: page.updatedAt }),
          breadcrumbs(crumbs.map((c) => ({ name: c.name, path: c.href ?? routes.privacy })))
        )}
      />
      <section
        aria-labelledby="page-title"
        className="border-hairline border-b pt-[168px] pb-[clamp(40px,5vw,64px)]"
        data-hero
      >
        <div className="wrap flex flex-col gap-6">
          <Breadcrumbs className="mb-1" items={crumbs} />
          <p className="eyebrow">{page.eyebrow}</p>
          <h1
            className="m-0 text-balance font-bold font-display text-[clamp(52px,8vw,112px)] uppercase leading-[0.9] tracking-[0.005em]"
            id="page-title"
          >
            {page.title}
          </h1>
          <p className="text-[15px] text-muted">
            {page.updatedLabel} <time dateTime={page.updatedAt}>{formatDate(page.updatedAt)}</time>
          </p>
        </div>
      </section>

      <div className="wrap flex flex-wrap items-start gap-x-[clamp(40px,6vw,96px)] gap-y-10 pt-[clamp(48px,6vw,80px)] pb-[clamp(72px,10vw,120px)]">
        <aside className="flex-[1_1_220px] nav:sticky nav:top-[110px] nav:max-w-[280px]">
          <nav aria-label={page.tocLabel}>
            <p className="eyebrow mb-2">{page.tocLabel}</p>
            {page.sections.map((s, i) => (
              <a
                className="flex gap-3 py-2 text-[15px] text-muted leading-[22px] hover:text-ink"
                href={`#${s.anchor}`}
                key={s._key}
              >
                <span className="w-[22px] flex-none font-display font-semibold text-accent">{num(i)}</span>
                {s.title}
              </a>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 max-w-[760px] flex-[999_1_560px] text-[17px] text-body leading-7">
          {page.sections.map((s, i) => (
            <section
              aria-labelledby={s.anchor}
              className="border-hairline border-t pt-7 first:border-0 first:pt-0 [&+&]:mt-14"
              key={s._key}
            >
              <h2
                className="mb-5 scroll-mt-[110px] font-bold font-display text-[clamp(28px,3vw,36px)] text-ink uppercase leading-none"
                id={s.anchor}
              >
                {num(i)} · {s.title}
              </h2>
              <div className="[&>*+*]:mt-5">
                <LegalText value={s.body} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
