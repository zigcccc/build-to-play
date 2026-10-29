import { cookies, draftMode } from 'next/headers';
import type { NextRequest } from 'next/server';
import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { serverEnv } from '@/env/server';
import { gateCookie, gateKey } from '@/lib/site-gate';
import { client } from '@/sanity/client';

const { GET: enableDraftMode } = defineEnableDraftMode({
  client: client.withConfig({ token: serverEnv.SANITY_API_READ_TOKEN }),
});

export async function GET(request: NextRequest) {
  try {
    return await enableDraftMode(request);
  } finally {
    // Draft mode is only on after a valid Studio secret, so Presentation may pass the pre-launch gate too.
    if (gateKey && (await draftMode()).isEnabled) (await cookies()).set(gateCookie(request));
  }
}
