import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';
import { urlFor } from '@/sanity/image';
import type { SeoValue } from '@/sanity/models';
import { getGlobal } from '@/sanity/queries/global';

type Options = {
  seo: SeoValue;
  /** Fallbacks when the editor left the SEO fields empty. */
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  /** The route has its own opengraph-image file, used unless the editor set a share image. */
  ogImageFile?: boolean;
};

/** Strips stega markers from text destined for <head> and other machine-read output. */
export const plain = (text: string) => stegaClean(text);

/** The generated site share card (app/opengraph-image.tsx). */
const DEFAULT_OG_IMAGE = '/opengraph-image';

/**
 * One place that turns CMS SEO fields into Next metadata (canonical, OG, robots).
 * The page's openGraph replaces the layout's wholesale, so it carries siteName and an image itself. The editor's share
 * image wins. Otherwise a route with its own opengraph-image file gets it by leaving `images` unset (Next only uses
 * the file then); every other page gets the site-wide image, else the generated card.
 */
export async function buildMetadata({
  seo,
  title,
  description,
  path,
  type = 'website',
  ogImageFile = false,
  ...article
}: Options): Promise<Metadata> {
  const { settings } = await getGlobal(false);
  const image = seo?.ogImage ?? (ogImageFile ? undefined : settings.seo?.ogImage);
  const images = image
    ? [{ url: urlFor(image).width(1200).height(630).fit('crop').url(), width: 1200, height: 630 }]
    : ogImageFile
      ? undefined
      : [DEFAULT_OG_IMAGE];
  const finalTitle = plain(seo?.title || title);
  const finalDescription = plain(seo?.description || description);

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: path },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: path,
      type,
      siteName: plain(settings.siteName),
      locale: 'sl_SI',
      ...(type === 'article' ? article : {}),
      ...(images ? { images } : {}),
    },
  };
}
