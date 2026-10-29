import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getGlobal } from '@/sanity/queries/global';

/** The whole Nasveti section can be switched off in the Studio (Nasveti → "Nasveti so vklopljeni"). */
export default async function ArticlesLayout({ children }: { children: ReactNode }) {
  if (!(await getGlobal()).articlesEnabled) notFound();
  return children;
}
