'use client';

import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import type { LocationValue } from '@/sanity/queries/global';

const STYLE = 'https://tiles.openfreemap.org/styles/dark';

/** MapLibre with OpenFreeMap's dark tiles, recoloured to the brand black with gold pins. */
export default function MapCanvas({ locations }: { locations: LocationValue[] }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const points = locations.filter((l) => l.geo?.lat && l.geo?.lng);
    if (!container.current || points.length === 0) return;

    maplibregl.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs');
    const map = new maplibregl.Map({
      container: container.current,
      style: STYLE,
      center: [points[0]?.geo?.lng ?? 14.5, points[0]?.geo?.lat ?? 46.05],
      zoom: 12,
      attributionControl: { compact: true },
      cooperativeGestures: true,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('style.load', () => {
      if (map.getLayer('background')) map.setPaintProperty('background', 'background-color', '#040506');
    });

    for (const l of points) {
      const pin = document.createElement('div');
      pin.className = 'size-4 border-2 border-black bg-accent outline outline-accent';
      pin.setAttribute('aria-label', l.name);
      new maplibregl.Marker({ element: pin })
        .setLngLat([l.geo?.lng as number, l.geo?.lat as number])
        .setPopup(
          new maplibregl.Popup({ offset: 16, closeButton: false }).setText(`${l.name} – ${l.street}, ${l.city}`)
        )
        .addTo(map);
    }

    if (points.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      for (const l of points) bounds.extend([l.geo?.lng as number, l.geo?.lat as number]);
      map.fitBounds(bounds, { padding: 64, maxZoom: 14, duration: 0 });
    }

    return () => map.remove();
  }, [locations]);

  return <div className="size-full" ref={container} />;
}
