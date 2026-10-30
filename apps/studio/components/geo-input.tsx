import { Button, Card, Text } from '@sanity/ui';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type ObjectInputProps, set, useFormValue } from 'sanity';

type Geo = { lat?: number; lng?: number };

// The same dark OpenFreeMap tiles the website's map uses. Free, no API key.
const STYLE = 'https://tiles.openfreemap.org/styles/dark';
const SLOVENIA: [number, number] = [14.82, 46.12];
const GOLD = '#b39a72';

/** OpenStreetMap's geocoder; fine for an editor clicking a button now and then (max 1 request/s). */
async function geocode(street: string, postalCode: string, city: string) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'si',
    street,
    postalcode: postalCode,
    city,
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
  if (!response.ok) return null;
  const [hit] = (await response.json()) as { lat: string; lon: string }[];
  return hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null;
}

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * Places the location's pin without typing coordinates: find it from the address, then drag the pin (or click the
 * map) if it isn't exactly on the entrance.
 */
export function GeoInput({ value, onChange, readOnly }: ObjectInputProps<Geo>) {
  const street = useFormValue(['street']) as string | undefined;
  const postalCode = useFormValue(['postalCode']) as string | undefined;
  const city = useFormValue(['city']) as string | undefined;
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [status, setStatus] = useState<'idle' | 'searching' | 'notFound'>('idle');

  const hasPin = value?.lat !== undefined && value?.lng !== undefined;

  const place = useCallback(
    (lng: number, lat: number) => onChange(set({ lat: round(lat), lng: round(lng) })),
    [onChange]
  );

  useEffect(() => {
    if (!container.current) return;
    maplibregl.setWorkerUrl('/static/vendor/maplibre/maplibre-gl-worker.mjs');
    const instance = new maplibregl.Map({
      container: container.current,
      style: STYLE,
      center: SLOVENIA,
      zoom: 7,
      attributionControl: { compact: true },
    });
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
      marker.current = null;
    };
  }, []);

  // Clicking the map moves the pin there.
  useEffect(() => {
    const instance = map.current;
    if (!instance || readOnly) return;
    const onClick = (event: maplibregl.MapMouseEvent) => place(event.lngLat.lng, event.lngLat.lat);
    instance.on('click', onClick);
    return () => {
      instance.off('click', onClick);
    };
  }, [place, readOnly]);

  // Keep the pin in sync with the stored value (including edits by someone else).
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    if (!hasPin) {
      marker.current?.remove();
      marker.current = null;
      return;
    }
    const lngLat: [number, number] = [value.lng as number, value.lat as number];
    if (!marker.current) {
      marker.current = new maplibregl.Marker({ color: GOLD, draggable: !readOnly }).setLngLat(lngLat).addTo(instance);
      marker.current.on('dragend', () => {
        const at = marker.current?.getLngLat();
        if (at) place(at.lng, at.lat);
      });
      instance.jumpTo({ center: lngLat, zoom: 16 });
    } else {
      marker.current.setLngLat(lngLat);
      if (!instance.getBounds().contains(lngLat)) instance.panTo(lngLat);
    }
  }, [hasPin, value?.lat, value?.lng, readOnly, place]);

  const addressComplete = Boolean(street && postalCode && city);

  const find = async () => {
    if (!street || !postalCode || !city) return;
    setStatus('searching');
    const hit = await geocode(street, postalCode, city).catch(() => null);
    if (!hit) {
      setStatus('notFound');
      return;
    }
    setStatus('idle');
    place(hit.lng, hit.lat);
    map.current?.jumpTo({ center: [hit.lng, hit.lat], zoom: 16 });
  };

  const hint =
    status === 'notFound'
      ? 'Naslova ni bilo mogoče najti. Preveri ulico, poštno številko in kraj ali klikni na zemljevid, kjer je lokacija.'
      : !addressComplete && !hasPin
        ? 'Najprej vpiši ulico, poštno številko in kraj.'
        : hasPin
          ? 'Če oznaka ni točno na mestu, jo povleci ali klikni na pravo mesto na zemljevidu.'
          : 'Poišči lokacijo po naslovu ali klikni na zemljevid.';

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Button
          disabled={readOnly || !addressComplete || status === 'searching'}
          loading={status === 'searching'}
          mode="ghost"
          onClick={find}
          text={hasPin ? 'Ponovno poišči po naslovu' : 'Poišči po naslovu'}
        />
        <Text muted size={1}>
          {hint}
        </Text>
      </div>
      <Card border radius={2} style={{ overflow: 'hidden' }}>
        <div ref={container} style={{ height: 320, width: '100%' }} />
      </Card>
    </div>
  );
}
