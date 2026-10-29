import { notFound } from 'next/navigation';
import { ogContentType, ogSize, renderOg } from '@/lib/og';
import { getGlobal } from '@/sanity/queries/global';
import { getProgramPage, getProgramSlugs } from '@/sanity/queries/program';

export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  return (await getProgramSlugs()).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ program, template }, { settings }] = await Promise.all([getProgramPage(slug, false), getGlobal(false)]);
  if (!program) notFound();
  return renderOg({
    eyebrow: `${template.hero.eyebrowPrefix} ${String(program.order).padStart(2, '0')}`,
    title: program.name,
    tagline: settings.tagline,
  });
}
