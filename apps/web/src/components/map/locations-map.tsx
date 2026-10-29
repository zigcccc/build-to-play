'use client';

import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useConsent } from '@/components/consent/consent-context';
import { buttonStyles } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import type { LocationValue } from '@/sanity/queries/global';

// MapLibre (~200 kB) is only downloaded after consent and once the map is near the viewport.
const MapCanvas = dynamic(() => import('./map-canvas'), { ssr: false });

type Props = { locations: LocationValue[]; className?: string; copy: { text: string; button: string } };

export function LocationsMap({ locations, className, copy }: Props) {
  const { consent, openSettings } = useConsent();
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && setNear(true), {
      rootMargin: '300px',
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="Zemljevid"
      className={cn('relative overflow-hidden border border-hairline bg-surface', className)}
      ref={ref}
    >
      {consent?.external && near ? (
        <MapCanvas locations={locations} />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin aria-hidden className="text-accent" size={28} />
          <p className="max-w-[320px] text-muted text-sm">{copy.text}</p>
          {!consent?.external && (
            <button className={cn(buttonStyles({ variant: 'line', size: 'sm' }))} onClick={openSettings} type="button">
              {copy.button}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
