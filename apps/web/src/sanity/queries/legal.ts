import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import { LINK, LINK_TAGS, PORTABLE_TEXT, PORTABLE_TEXT_TAGS, SEO } from '../fragments';
import { linkModel, portableTextModel, seoModel } from '../models';

const PRIVACY_QUERY = defineQuery(`*[_id == "privacyPage"][0]{
  eyebrow, title, updatedAt, updatedLabel, tocLabel, _updatedAt,
  sections[]{ _key, title, "anchor": anchor.current, body${PORTABLE_TEXT} },
  "seo": seo${SEO}
}`);

export const getPrivacy = (stega = true) =>
  sanityFetch({
    query: PRIVACY_QUERY,
    tags: ['privacyPage', ...PORTABLE_TEXT_TAGS],
    model: z.object({
      eyebrow: z.string(),
      title: z.string(),
      updatedAt: z.string(),
      updatedLabel: z.string(),
      tocLabel: z.string(),
      _updatedAt: z.string(),
      sections: z.array(z.object({ _key: z.string(), title: z.string(), anchor: z.string(), body: portableTextModel })),
      seo: seoModel,
    }),
    stega,
  });

const NOT_FOUND_QUERY = defineQuery(`*[_id == "notFoundPage"][0]{
  eyebrow, heading, text, primaryCta${LINK}, secondaryCta${LINK}, quickLinks[]${LINK}
}`);

export const getNotFound = () =>
  sanityFetch({
    query: NOT_FOUND_QUERY,
    tags: ['notFoundPage', ...LINK_TAGS],
    model: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      text: z.string(),
      primaryCta: linkModel,
      secondaryCta: linkModel,
      quickLinks: z.array(linkModel),
    }),
  });

const COMING_SOON_QUERY = defineQuery(`*[_id == "comingSoonPage"][0]{ eyebrow, heading, text }`);

export const getComingSoon = () =>
  sanityFetch({
    query: COMING_SOON_QUERY,
    tags: ['comingSoonPage'],
    model: z.object({ eyebrow: z.string(), heading: z.string(), text: z.string() }),
  });
