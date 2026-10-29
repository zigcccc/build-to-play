import { CmsLink } from '@/components/cms-link';
import { AccentHeading } from '@/components/ui/accent-heading';
import { Arrow } from '@/components/ui/arrow';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import type { CtaCardValue } from '@/sanity/models';

/** Closing "Brezplačen posvet" card with the outlined decorative 2. */
export function CtaCard({ cta, program }: { cta: CtaCardValue; program?: string }) {
  return (
    <section aria-labelledby="cta-title" className="pb-[clamp(72px,10vw,136px)]">
      <div className="wrap">
        <div className="card relative grid-fit items-end overflow-hidden p-[clamp(32px,6vw,80px)] [--gap:32px] [--min:420px]">
          <div aria-hidden className="deco2 right-[-2%] bottom-[-12%] text-[520px]">
            2
          </div>
          <div className="relative flex flex-col gap-5">
            <p className="eyebrow">{cta.eyebrow}</p>
            <h2 className="h2" id="cta-title">
              <AccentHeading value={cta.heading} />
            </h2>
          </div>
          <div className="relative flex flex-col gap-6">
            <p className="lead text-muted">{cta.text}</p>
            <div className="flex flex-wrap gap-3">
              <CmsLink
                className={cn(buttonStyles(), 'group flex-[1_1_100%] cta:flex-none')}
                link={cta.primary}
                program={program}
              >
                {cta.primary.label}
                <Arrow />
              </CmsLink>
              {cta.secondary && (
                <CmsLink
                  className={cn(buttonStyles({ variant: 'line' }), 'flex-[1_1_100%] cta:flex-none')}
                  link={cta.secondary}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
