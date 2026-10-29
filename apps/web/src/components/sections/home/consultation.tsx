import { Phone } from 'lucide-react';
import { CmsLink } from '@/components/cms-link';
import { AccentHeading } from '@/components/ui/accent-heading';
import { Arrow } from '@/components/ui/arrow';
import { buttonStyles } from '@/components/ui/button';
import { NumberedList } from '@/components/ui/numbered-list';
import { cn } from '@/lib/cn';
import type { HomeData } from '@/sanity/queries/home';

export function Consultation({ data }: { data: HomeData['consultation'] }) {
  return (
    <section aria-labelledby="posvet-title" className="sec border-hairline border-y bg-surface">
      <div className="wrap grid-fit items-start [--gap:clamp(40px,6vw,96px)] [--min:460px]">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2
            className="m-0 text-balance font-bold font-display text-[clamp(56px,8vw,112px)] uppercase leading-[0.9] tracking-[0.005em]"
            id="posvet-title"
          >
            <AccentHeading value={data.heading} />
          </h2>
          <p className="lead max-w-[480px] text-muted">{data.lead}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <CmsLink
              className={cn(buttonStyles({ size: 'lg' }), 'group flex-[1_1_100%] cta:flex-none')}
              link={data.primaryCta}
            >
              {data.primaryCta.label}
              <Arrow />
            </CmsLink>
            {data.secondaryCta && (
              <CmsLink
                className={cn(buttonStyles({ variant: 'line', size: 'lg' }), 'flex-[1_1_100%] px-6 cta:flex-none')}
                link={data.secondaryCta}
              >
                <Phone aria-hidden size={18} />
                {data.secondaryCta.label}
              </CmsLink>
            )}
          </div>
        </div>
        <NumberedList items={data.steps} size="lg" />
      </div>
    </section>
  );
}
