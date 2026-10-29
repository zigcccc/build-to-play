import { type NextRequest, NextResponse } from 'next/server';
import { routes } from '@/lib/routes';
import { GATE_COOKIE, gateCookie, gateKey } from '@/lib/site-gate';

/** The private link that lets someone in: /predogled?k=<SITE_GATE_KEY>. */
const ENTRY_PATH = '/predogled';

const noindex = (response: NextResponse) => {
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
};

/**
 * Pre-launch gate. With SITE_GATE_KEY set, only holders of the gate cookie see the site: the client via the private
 * link, editors via Presentation (the draft-mode route hands it out). Everyone else gets the coming-soon page.
 */
export function proxy(request: NextRequest) {
  if (!gateKey) return NextResponse.next();

  if (request.nextUrl.pathname === ENTRY_PATH && request.nextUrl.searchParams.get('k') === gateKey) {
    const response = NextResponse.redirect(new URL(routes.home, request.url));
    response.cookies.set(gateCookie(request));
    return noindex(response);
  }
  if (request.cookies.get(GATE_COOKIE)?.value === gateKey) return noindex(NextResponse.next());
  return noindex(NextResponse.rewrite(new URL(routes.comingSoon, request.url)));
}

export const config = {
  // Open to all: the API (webhook, draft mode), Next and Vercel internals, static files, robots.txt and the privacy
  // policy the cookie banner links to.
  matcher: [
    '/((?!api/|_next/|_vercel/|brand/|icons/|vendor/|icon\\.svg|apple-icon\\.png|manifest\\.webmanifest|robots\\.txt|politika-zasebnosti).*)',
  ],
};
