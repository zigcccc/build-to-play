import { cacheTag } from '@b2p/shared';
import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { serverEnv } from '@/env/server';

/** Target of the Sanity GROQ webhook (projection: `{_type}`). */
export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, serverEnv.SANITY_REVALIDATE_SECRET);
  if (!isValidSignature) {
    return Response.json({ message: 'Invalid signature' }, { status: 401 });
  }

  const tag = cacheTag.safeParse(body?._type);
  if (!tag.success) {
    return Response.json({ message: 'Unknown or missing _type' }, { status: 400 });
  }

  revalidateTag(tag.data, 'max');
  return Response.json({ revalidated: tag.data });
}
