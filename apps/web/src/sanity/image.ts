import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { clientEnv } from '@/env/client';

const builder = createImageUrlBuilder({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
});

export const urlFor = (source: SanityImageSource) => builder.image(source).auto('format');
