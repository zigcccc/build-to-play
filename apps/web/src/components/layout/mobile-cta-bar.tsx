'use client';

import { Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookingTrigger } from '@/components/booking/booking-trigger';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';

/**
 * Fixed bottom bar on ≤900 px. Hidden while the page hero (`[data-hero]`) is in view,
 * so it never competes with the hero CTAs.
 */
export function MobileCtaBar({ cta, callLabel, phone }: { cta: string; callLabel: string; phone: string }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-observe the new page's hero after navigation
  useEffect(() => {
    const hero = document.querySelector('[data-hero]');
    if (!hero) {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setShow(!entry?.isIntersecting), {
      rootMargin: '0px 0px -20% 0px',
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 px-3 pb-3 transition-[transform,visibility] duration-250 nav:hidden',
        show ? 'visible translate-y-0' : 'invisible translate-y-[130%] delay-[0s,250ms]'
      )}
      data-show={show}
    >
      <div className="glass flex gap-2 p-2">
        <BookingTrigger className={cn(buttonStyles({ size: 'md' }), 'flex-1')}>{cta}</BookingTrigger>
        <a
          aria-label={callLabel}
          className="inline-flex size-[52px] flex-none items-center justify-center border border-control text-ink"
          href={`tel:${phone}`}
        >
          <Phone aria-hidden size={20} />
        </a>
      </div>
    </div>
  );
}
