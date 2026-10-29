import type { ProgramKey } from '@b2p/shared';
import { Check } from 'lucide-react';
import { BookingTrigger } from '@/components/booking/booking-trigger';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/price';
import type { PackageValue } from '@/sanity/models';

type Props = { packages: PackageValue[]; program: ProgramKey; featuredLabel: string };

export function PackageCards({ packages, program, featuredLabel }: Props) {
  return (
    <div className="grid-fit items-stretch [--gap:24px] [--min:300px]">
      {packages.map((pk) => (
        <article className="card relative flex flex-col gap-6 p-[clamp(24px,3vw,36px)]" key={pk._key}>
          {pk.featured && <div aria-hidden className="-inset-x-px -top-px absolute h-[3px] bg-accent" />}
          <div className="flex min-h-[26px] items-center justify-between gap-3">
            <h3 className="m-0 font-bold font-display text-[28px] uppercase leading-7">{pk.name}</h3>
            {pk.featured && <span className="cat">{featuredLabel}</span>}
          </div>
          <div>
            <span className="flex flex-wrap items-baseline gap-2">
              <span className="font-bold font-display text-[56px] leading-[56px]">{formatPrice(pk)}</span>
              {pk.unit && <span className="text-muted text-sm">{pk.unit}</span>}
            </span>
            {pk.note && <p className="mt-2 text-muted text-sm">{pk.note}</p>}
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 border-hairline border-t p-0 pt-5">
            {pk.features.map((f) => (
              <li className="flex gap-3 text-[15px] leading-[22px]" key={f}>
                <Check aria-hidden className="mt-0.5 shrink-0 text-accent" size={18} />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex">
            <BookingTrigger
              className={cn(buttonStyles({ variant: pk.featured ? 'gold' : 'line' }), 'flex-1')}
              program={program}
            >
              {pk.ctaLabel}
            </BookingTrigger>
          </div>
        </article>
      ))}
    </div>
  );
}
