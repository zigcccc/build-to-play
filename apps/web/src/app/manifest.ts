import type { MetadataRoute } from 'next';
import { plain } from '@/lib/metadata';
import { getGlobal } from '@/sanity/queries/global';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings } = await getGlobal(false);
  return {
    name: plain(settings.siteName),
    short_name: plain(settings.siteName),
    description: plain(settings.description),
    start_url: '/',
    display: 'standalone',
    background_color: '#040506',
    theme_color: '#040506',
    lang: 'sl',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
