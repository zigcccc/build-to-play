import { pageKey, socialPlatform } from '@b2p/shared';
import { defineQuery } from 'next-sanity';
import { z } from 'zod';
import type { FormVars } from '@/components/forms/copy';
import { twoDigit } from '@/lib/number';
import { sanityFetch } from '../fetch';
import { IMAGE, LINK, LINK_TAGS, PROGRAM_CARD, SEO } from '../fragments';
import { cmsEnum, imageModel, labeledValueModel, linkModel, programCardModel, seoModel } from '../models';

const GLOBAL_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    siteName, tagline, description, email, phone, socials, openingHours, companyName, companyAddress,
    vatId, registrationNumber, areaServed, priceRange, responseTime, consultationDuration, notificationEmail,
    "trainer": owner->{ _id, name, role, jobTitle, bio, knowsAbout, sameAs, "avatar": avatar${IMAGE} },
    "seo": seo${SEO}
  },
  "layout": *[_id == "layout"][0]{
    nav, headerCta, programsMenu, mobileMenu, mobileBarCta, labels,
    footer{ ..., brandLinks[]${LINK} }
  },
  "programs": *[_type == "program" && defined(slug.current)] | order(order asc)${PROGRAM_CARD},
  "locations": *[_type == "location"] | order(order asc){ _id, name, street, postalCode, city, tags, geo, mapsUrl },
  "forms": *[_id == "forms"][0]{ subjects, goals },
  "articlesEnabled": coalesce(*[_id == "articlesPage"][0].enabled, false)
}`);

export const globalModel = z.object({
  settings: z.object({
    siteName: z.string(),
    tagline: z.string(),
    description: z.string(),
    email: z.string(),
    phone: z.object({ display: z.string(), e164: z.string() }),
    socials: z.array(z.object({ platform: cmsEnum(socialPlatform), url: z.string(), handle: z.string() })),
    openingHours: z.array(labeledValueModel),
    companyName: z.string(),
    companyAddress: z.string().nullish(),
    vatId: z.string().nullish(),
    registrationNumber: z.string().nullish(),
    areaServed: z.string(),
    priceRange: z.string().nullish(),
    responseTime: z.string(),
    consultationDuration: z.string(),
    notificationEmail: z.string(),
    trainer: z.object({
      _id: z.string(),
      name: z.string(),
      role: z.string(),
      jobTitle: z.string(),
      bio: z.string(),
      knowsAbout: z.array(z.string()).nullish(),
      sameAs: z.array(z.string()).nullish(),
      avatar: imageModel.nullish(),
    }),
    seo: seoModel,
  }),
  layout: z.object({
    nav: z.array(z.object({ label: z.string(), target: cmsEnum(z.union([pageKey, z.literal('programs')])) })),
    headerCta: z.string(),
    programsMenu: z.object({ helperText: z.string(), pricingLabel: z.string(), bookingLabel: z.string() }),
    mobileMenu: z.object({ homeLabel: z.string(), ctaLabel: z.string() }),
    mobileBarCta: z.string(),
    footer: z.object({
      programsCaption: z.string(),
      pricingLabel: z.string(),
      brandCaption: z.string(),
      brandLinks: z.array(linkModel),
      followCaption: z.string(),
      ctaLabel: z.string(),
      privacyLabel: z.string(),
      cookieSettingsLabel: z.string(),
    }),
    labels: z.object({
      breadcrumbHome: z.string(),
      breadcrumbPrograms: z.string(),
      priceFrom: z.string(),
      featured: z.string(),
      moreAboutProgram: z.string(),
      fullPricing: z.string(),
      call: z.string(),
      faqHelp: z.string(),
      faqHelpLink: z.string(),
      directions: z.string(),
    }),
  }),
  // Numbered by position, so gaps or ties in `order` never show as "10" or a second "02".
  programs: z.array(programCardModel).transform((list) => list.map((p, i) => ({ ...p, number: twoDigit(i + 1) }))),
  locations: z.array(
    z.object({
      _id: z.string(),
      name: z.string(),
      street: z.string(),
      postalCode: z.string(),
      city: z.string(),
      tags: z.array(z.string()).nullish(),
      geo: z.object({ lat: z.number().nullish(), lng: z.number().nullish() }).nullish(),
      mapsUrl: z.string().nullish(),
    })
  ),
  // The options visitors pick from; the rest of the form wording is in components/forms/copy.tsx.
  forms: z.object({ subjects: z.array(z.string()), goals: z.array(z.string()) }),
  articlesEnabled: z.boolean(),
});

export type GlobalData = z.infer<typeof globalModel>;
export type LocationValue = GlobalData['locations'][number];

/** The settings the fixed form wording mentions. */
export const formVars = (settings: GlobalData['settings']): FormVars => ({
  rok: settings.responseTime,
  trajanje: settings.consultationDuration,
  email: settings.email,
});

/** Site chrome + settings used on every page. */
export const getGlobal = (stega = true) =>
  sanityFetch({
    query: GLOBAL_QUERY,
    tags: ['siteSettings', 'layout', 'program', 'location', 'forms', 'person', 'articlesPage', ...LINK_TAGS],
    model: globalModel,
    stega,
  });
