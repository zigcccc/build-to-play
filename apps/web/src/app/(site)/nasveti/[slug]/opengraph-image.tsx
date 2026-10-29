import { notFound } from 'next/navigation';
import { ogContentType, ogSize, renderOg } from '@/lib/og';
import { getArticle, getArticleSlugs } from '@/sanity/queries/articles';
import { getGlobal } from '@/sanity/queries/global';

export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  return (await getArticleSlugs()).articles.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, { settings }] = await Promise.all([getArticle(slug, false), getGlobal(false)]);
  if (!article) notFound();
  return renderOg({ eyebrow: article.category.title, title: article.title, tagline: settings.tagline });
}
