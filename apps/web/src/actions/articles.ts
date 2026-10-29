'use server';

import { z } from 'zod';
import { getMoreArticles } from '@/sanity/queries/articles';

const input = z.object({ category: z.string().max(100), from: z.number().int().min(0).max(10_000) });

export async function loadMoreArticles(category: string, from: number) {
  const parsed = input.parse({ category, from });
  return getMoreArticles(parsed.category, parsed.from);
}
