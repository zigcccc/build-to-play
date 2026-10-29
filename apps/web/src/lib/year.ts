import { cacheLife } from 'next/cache';

/** Cache Components forbid reading the clock during prerender outside a cache scope. */
export async function currentYear() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}
