'use client';

import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { LocationValue } from '@/sanity/queries/global';

// MapLibre (~200 kB) is only downloaded once the map is near the viewport.
const MapCanvas = dynamic(() => import('./map-canvas'), { ssr: false });

type Props = { locations: LocationValue[]; className?: string };

export function LocationsMap({ locations, className }: Props) {
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
      <MapPin aria-hidden className="absolute top-1/2 left-1/2 -translate-1/2 text-accent" size={28} />
      {near && <MapCanvas locations={locations} />}
    </section>
  );
}
