import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import { PORTABLE_TEXT, PORTABLE_TEXT_TAGS, SEO } from '../fragments';
import { portableTextModel, seoModel } from '../models';

const CONTACT_QUERY = defineQuery(`*[_id == "contactPage"][0]{
  hero{ eyebrow, heading, lead${PORTABLE_TEXT} },
  formHeading, directHeading, hoursHeading, locationsHeading,
  "seo": seo${SEO}
}`);

const contactModel = z.object({
  hero: z.object({ eyebrow: z.string(), heading: z.string(), lead: portableTextModel }),
  formHeading: z.string(),
  directHeading: z.string(),
  hoursHeading: z.string(),
  locationsHeading: z.string(),
  seo: seoModel,
});

export const getContactPage = (stega = true) =>
  sanityFetch({ query: CONTACT_QUERY, tags: ['contactPage', ...PORTABLE_TEXT_TAGS], model: contactModel, stega });
