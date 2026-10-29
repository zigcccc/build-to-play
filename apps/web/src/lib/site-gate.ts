import 'server-only';
import type { NextRequest } from 'next/server';
import { serverEnv } from '@/env/server';

/** While set, the public only sees the coming-soon page; see src/proxy.ts. */
export const gateKey = serverEnv.SITE_GATE_KEY;

export const GATE_COOKIE = 'b2p_preview';

/** Lets the bearer past the gate. It holds the key itself, so rotating SITE_GATE_KEY locks everyone out again. */
export function gateCookie(request: NextRequest) {
  const secure = request.nextUrl.protocol === 'https:';
  // Like next-sanity's draft cookie, so it also survives in Presentation's iframe when the Studio is on another site.
  const crossSiteFrame =
    request.headers.get('sec-fetch-dest') === 'iframe' && request.headers.get('sec-fetch-site') === 'cross-site';
  return {
    name: GATE_COOKIE,
    value: gateKey ?? '',
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
    secure,
    sameSite: secure ? 'none' : 'lax',
    partitioned: secure && crossSiteFrame,
  } as const;
}
