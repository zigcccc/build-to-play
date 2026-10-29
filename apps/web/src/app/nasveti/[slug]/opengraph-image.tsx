import { ogContentType, ogSize, renderOg } from '@/lib/og';
import { getArticle, getArticleSlugs } from '@/sanity/queries/articles';

export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  return (await getArticleSlugs()).articles.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug, false);
  return renderOg({ eyebrow: article?.category.title ?? 'Nasveti', title: article?.title ?? 'Build 2 Play' });
}
