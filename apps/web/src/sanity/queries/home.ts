import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import { IMAGE, LINK, LINK_TAGS, SEO } from '../fragments';
import { accentHeadingModel, imageModel, linkModel, seoModel, statModel, titledTextModel } from '../models';

const HOME_QUERY = defineQuery(`*[_id == "homePage"][0]{
  hero{ badge, heading, lead, primaryCta${LINK}, secondaryCta${LINK}, stats, "image": image${IMAGE} },
  marquee,
  about{ eyebrow, heading, lead, text, "portrait": portrait${IMAGE}, items, link${LINK} },
  programs{ eyebrow, heading, intro, link${LINK} },
  consultation{ eyebrow, heading, lead, primaryCta${LINK}, secondaryCta${LINK}, steps },
  results{
    eyebrow, heading, intro, steps, reportEyebrow, reportTitle, chartLabels, caption,
    tabs[]{ _key, "program": program->slug.current, "label": program->shortLabel, description, points, metrics[]{ _key, label, from, to, delta } },
    "testimonials": testimonials[]->{ _id, quote, name, program, place },
    moreTestimonials${LINK}
  },
  locations{ eyebrow, heading, online },
  contact{ eyebrow, heading, lead, formHeading, labels },
  "seo": seo${SEO}
}`);

const homeModel = z.object({
  hero: z.object({
    badge: z.string(),
    heading: accentHeadingModel,
    lead: z.string(),
    primaryCta: linkModel,
    secondaryCta: linkModel.nullish(),
    stats: z.array(statModel),
    image: imageModel,
  }),
  marquee: z.array(z.string()),
  about: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    lead: z.string(),
    text: z.string(),
    portrait: imageModel.nullish(),
    items: z.array(titledTextModel),
    link: linkModel,
  }),
  programs: z.object({ eyebrow: z.string(), heading: z.string(), intro: z.string(), link: linkModel }),
  consultation: z.object({
    eyebrow: z.string(),
    heading: accentHeadingModel,
    lead: z.string(),
    primaryCta: linkModel,
    secondaryCta: linkModel.nullish(),
    steps: z.array(titledTextModel),
  }),
  results: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    intro: z.string(),
    steps: z.array(titledTextModel),
    reportEyebrow: z.string(),
    reportTitle: z.string(),
    chartLabels: z.array(z.string()),
    caption: z.string(),
    tabs: z.array(
      z.object({
        _key: z.string(),
        program: z.string(),
        label: z.string(),
        description: z.string(),
        points: z.array(z.number()),
        metrics: z.array(
          z.object({ _key: z.string(), label: z.string(), from: z.string(), to: z.string(), delta: z.string() })
        ),
      })
    ),
    testimonials: z
      .array(
        z.object({
          _id: z.string(),
          quote: z.string(),
          name: z.string(),
          program: z.string().nullish(),
          place: z.string().nullish(),
        })
      )
      .nullish(),
    moreTestimonials: linkModel.nullish(),
  }),
  locations: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    online: z.object({ name: z.string(), text: z.string(), tag: z.string() }),
  }),
  contact: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    lead: z.string(),
    formHeading: z.string(),
    labels: z.object({ phone: z.string(), email: z.string() }),
  }),
  seo: seoModel,
});

export type HomeData = z.infer<typeof homeModel>;

export const getHome = (stega = true) =>
  sanityFetch({
    query: HOME_QUERY,
    tags: ['homePage', 'program', 'testimonial', 'article', ...LINK_TAGS],
    model: homeModel,
    stega,
  });
