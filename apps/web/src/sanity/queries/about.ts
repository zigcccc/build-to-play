import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import { CTA_CARD, IMAGE, LINK, SEO } from '../fragments';
import { ctaCardModel, imageModel, linkModel, seoModel, statModel, titledTextModel } from '../models';

const ABOUT_QUERY = defineQuery(`*[_id == "aboutPage"][0]{
  hero{ eyebrow, heading, lead, primaryCta${LINK}, secondaryCta${LINK}, "portrait": portrait${IMAGE}, stats },
  story, approach, credentials,
  "gallery": gallery[]${IMAGE},
  "cta": cta${CTA_CARD},
  _updatedAt,
  "seo": seo${SEO}
}`);

const header = { eyebrow: z.string(), heading: z.string() };

const aboutModel = z.object({
  hero: z.object({
    ...header,
    lead: z.string(),
    primaryCta: linkModel,
    secondaryCta: linkModel.nullish(),
    portrait: imageModel.nullish(),
    stats: z.array(statModel),
  }),
  story: z.object({ ...header, paragraphs: z.array(z.string()), quote: z.string() }),
  approach: z.object({ ...header, items: z.array(titledTextModel) }),
  credentials: z.object({
    ...header,
    items: z.array(z.object({ year: z.string(), title: z.string(), institution: z.string() })),
  }),
  gallery: z.array(imageModel).nullish(),
  cta: ctaCardModel,
  _updatedAt: z.string(),
  seo: seoModel,
});

export const getAbout = (stega = true) =>
  sanityFetch({ query: ABOUT_QUERY, tags: ['aboutPage', 'program', 'article'], model: aboutModel, stega });
