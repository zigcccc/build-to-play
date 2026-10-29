import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';
import { urlFor } from '@/sanity/image';
import type { SeoValue } from '@/sanity/models';

type Options = {
  seo: SeoValue;
  /** Fallbacks when the editor left the SEO fields empty. */
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
};

/** Strips stega markers and non-breaking spaces from text destined for <head>. */
export const plain = (text: string) => stegaClean(text).replace(/\u00a0/g, ' ');

/** One place that turns CMS SEO fields into Next metadata (canonical, OG, robots). */
export function buildMetadata({ seo, title, description, path, type = 'website', ...article }: Options): Metadata {
  const finalTitle = plain(seo?.title || title);
  const finalDescription = plain(seo?.description || description);
  const ogImage = seo?.ogImage ? urlFor(seo.ogImage).width(1200).height(630).fit('crop').url() : undefined;

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
      locale: 'sl_SI',
      ...(type === 'article' ? article : {}),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
  };
}
