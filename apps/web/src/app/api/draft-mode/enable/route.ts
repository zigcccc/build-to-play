import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { serverEnv } from '@/env/server';
import { client } from '@/sanity/client';

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: serverEnv.SANITY_API_READ_TOKEN }),
});
