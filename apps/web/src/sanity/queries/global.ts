import { pageKey, socialPlatform } from '@b2p/shared';
import { defineQuery } from 'next-sanity';
import { cache } from 'react';
import { z } from 'zod';
import { sanityFetch } from '../fetch';
import { IMAGE, LINK, LINK_TAGS, PORTABLE_TEXT, PORTABLE_TEXT_TAGS, PROGRAM_CARD, SEO } from '../fragments';
import {
  cmsEnum,
  imageModel,
  labeledValueModel,
  linkModel,
  portableTextModel,
  programCardModel,
  seoModel,
} from '../models';

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
  "forms": *[_id == "forms"][0]{ ..., labels{ ..., consent${PORTABLE_TEXT} } },
  "cookies": *[_id == "cookieConsent"][0],
  "articlesEnabled": coalesce(*[_id == "articlesPage"][0].enabled, false)
}`);

const titleText = z.object({ title: z.string(), text: z.string() });

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
  programs: z.array(programCardModel),
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
  forms: z.object({
    labels: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      subject: z.string(),
      program: z.string(),
      message: z.string(),
      goal: z.string(),
      bookingMessage: z.string(),
      optional: z.string(),
      requiredNote: z.string(),
      consent: portableTextModel,
    }),
    placeholders: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      program: z.string(),
      message: z.string(),
      goal: z.string(),
      bookingMessage: z.string(),
    }),
    errors: z.object({
      name: z.string(),
      emailEmpty: z.string(),
      emailInvalid: z.string(),
      message: z.string(),
      consent: z.string(),
      summary: z.string(),
    }),
    states: z.object({
      sending: z.string(),
      successTitle: z.string(),
      successText: z.string(),
      successTextHome: z.string(),
      sendAnother: z.string(),
      failure: z.string(),
      retry: z.string(),
    }),
    contact: z.object({
      submit: z.string(),
      submitHome: z.string(),
      subjects: z.array(z.string()),
      programUnknown: z.string(),
    }),
    booking: z.object({
      title: z.string(),
      stepLabel: z.string(),
      next: z.string(),
      submit: z.string(),
      step1: z.object({
        title: z.string(),
        subtitle: z.string(),
        goals: z.array(z.string()),
        programLabel: z.string(),
      }),
      step2: z.object({
        title: z.string(),
        subtitle: z.string(),
        modeLabel: z.string(),
        modeLive: z.string(),
        modeVideo: z.string(),
        locationLabel: z.string(),
        anyLocation: z.string(),
        daysLabel: z.string(),
        timesLabel: z.string(),
      }),
      step3: z.object({ title: z.string(), subtitle: z.string() }),
      success: z.object({
        title: z.string(),
        text: z.string(),
        goalLabel: z.string(),
        modeLabel: z.string(),
        whenLabel: z.string(),
        anytime: z.string(),
        nextHeading: z.string(),
        nextSteps: z.array(z.string()),
        close: z.string(),
      }),
      closeConfirm: z.object({ title: z.string(), text: z.string(), stay: z.string(), discard: z.string() }),
    }),
  }),
  articlesEnabled: z.boolean(),
  cookies: z.object({
    banner: z.object({ title: z.string(), text: z.string(), moreLabel: z.string() }),
    buttons: z.object({ settings: z.string(), rejectAll: z.string(), acceptAll: z.string(), save: z.string() }),
    dialog: z.object({ title: z.string(), intro: z.string() }),
    necessary: titleText,
    analytics: titleText,
  }),
});

export type GlobalData = z.infer<typeof globalModel>;
export type FormsCopy = GlobalData['forms'];
export type CookieCopy = GlobalData['cookies'];
export type LocationValue = GlobalData['locations'][number];

/** Site chrome + settings used on every page. Deduped per request. */
export const getGlobal = cache((stega = true) =>
  sanityFetch({
    query: GLOBAL_QUERY,
    tags: [
      'siteSettings',
      'layout',
      'program',
      'location',
      'forms',
      'cookieConsent',
      'person',
      'articlesPage',
      ...LINK_TAGS,
      ...PORTABLE_TEXT_TAGS,
    ],
    model: globalModel,
    stega,
  })
);
