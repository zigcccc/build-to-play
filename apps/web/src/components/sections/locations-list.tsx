import { MapPin, Navigation, Smartphone } from 'lucide-react';
import type { LocationValue } from '@/sanity/queries/global';

type Props = {
  locations: LocationValue[];
  directionsLabel: string;
  online?: { name: string; text: string; tag: string };
};

/** Home "Kje se dobiva" rows: name, address, program tags and a directions link. */
export function LocationsList({ locations, directionsLabel, online }: Props) {
  return (
    <ul className="rows m-0 mt-2 flex list-none flex-col p-0">
      {locations.map((l) => (
        <li className="flex gap-5 py-6" key={l._id}>
          <span className="inline-flex size-11 flex-none items-center justify-center border border-hairline">
            <MapPin aria-hidden className="text-accent" size={20} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3 className="m-0 font-semibold text-lg">{l.name}</h3>
            <address className="text-[15px] text-muted not-italic leading-[22px]">
              {l.street}, {l.postalCode} {l.city}
            </address>
            {l.tags && l.tags.length > 0 && (
              <p className="mt-1 font-medium text-xs uppercase tracking-[0.2em]">{l.tags.join(' · ')}</p>
            )}
          </div>
          {l.mapsUrl && (
            <a
              aria-label={`${directionsLabel}: ${l.name}`}
              className="inline-flex size-11 flex-none items-center justify-center border border-control text-ink hover:border-ink"
              href={l.mapsUrl}
              rel="noopener"
              target="_blank"
            >
              <Navigation aria-hidden size={18} />
            </a>
          )}
        </li>
      ))}
      {online && (
        <li className="flex gap-5 py-6">
          <span className="inline-flex size-11 flex-none items-center justify-center border border-hairline">
            <Smartphone aria-hidden className="text-accent" size={20} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3 className="m-0 font-semibold text-lg">{online.name}</h3>
            <p className="text-[15px] text-muted leading-[22px]">{online.text}</p>
            <p className="mt-1 font-medium text-xs uppercase tracking-[0.2em]">{online.tag}</p>
          </div>
        </li>
      )}
    </ul>
  );
}
