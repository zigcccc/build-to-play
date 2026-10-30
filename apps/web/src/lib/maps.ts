import { stegaClean } from 'next-sanity';

type Address = { street: string; postalCode: string; city: string };

/** Google Maps directions for a location, searched by its address (works in the app and the browser). */
export const directionsUrl = ({ street, postalCode, city }: Address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stegaClean(`${street}, ${postalCode} ${city}`))}`;
