import { accentHeadingText } from '@/components/ui/accent-heading';
import { ogContentType, ogSize, renderOg } from '@/lib/og';
import { getGlobal } from '@/sanity/queries/global';
import { getHome } from '@/sanity/queries/home';

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const [{ settings }, home] = await Promise.all([getGlobal(false), getHome(false)]);
  return renderOg({ eyebrow: home.hero.badge, title: accentHeadingText(home.hero.heading), tagline: settings.tagline });
}
