import { CmsLink } from '@/components/cms-link';
import { SiteShell } from '@/components/layout/site-shell';
import { Arrow } from '@/components/ui/arrow';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { getNotFound } from '@/sanity/queries/legal';

export default async function NotFound() {
  const page = await getNotFound();

  // The root not-found sits outside the (site) group, so it brings the site shell itself.
  return (
    <SiteShell>
      <main className="relative overflow-hidden" data-hero>
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-2%] bottom-[-6%] select-none font-bold font-display text-[clamp(300px,46vw,760px)] text-transparent leading-[0.8] tracking-[-0.02em] [-webkit-text-stroke:1.5px_rgb(179_154_114/0.35)]"
        >
          404
        </div>
        <div className="wrap relative flex min-h-[80vh] flex-wrap items-end gap-x-[clamp(40px,6vw,96px)] gap-y-12 pt-40 pb-[clamp(48px,7vw,96px)]">
          <div className="flex flex-[999_1_480px] flex-col gap-6">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="m-0 text-balance font-bold font-display text-[clamp(52px,8vw,112px)] uppercase leading-[0.9]">
              {page.heading}
            </h1>
            <p className="lead max-w-[480px] text-muted">{page.text}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <CmsLink className={cn(buttonStyles(), 'flex-[1_1_100%] cta:flex-none')} link={page.primaryCta} />
              <CmsLink
                className={cn(buttonStyles({ variant: 'line' }), 'flex-[1_1_100%] cta:flex-none')}
                link={page.secondaryCta}
              />
            </div>
          </div>
          <nav aria-label="Hitre povezave" className="max-w-[360px] flex-[1_1_260px] bg-black/60 backdrop-blur-[16px]">
            {page.quickLinks.map((link, i) => (
              <CmsLink
                className={cn(
                  'group flex min-h-14 items-center justify-between gap-3 border-hairline border-t font-bold font-display text-2xl text-ink uppercase hover:text-accent',
                  i === page.quickLinks.length - 1 && 'border-b'
                )}
                key={link.label}
                link={link}
              >
                {link.label}
                <Arrow />
              </CmsLink>
            ))}
          </nav>
        </div>
      </main>
    </SiteShell>
  );
}
