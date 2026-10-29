import { aboutPage } from './about-page';
import { articlesPage } from './articles-page';
import { contactPage } from './contact-page';
import { forms } from './forms';
import { homePage } from './home-page';
import { layout } from './layout';
import { notFoundPage } from './not-found-page';
import { cookieConsent } from './piskotki';
import { pricingPage } from './pricing-page';
import { privacyPage } from './privacy-page';
import { programPage } from './program-page';
import { siteSettings } from './site-settings';

export const singletonTypes = [
  siteSettings,
  layout,
  homePage,
  aboutPage,
  programPage,
  pricingPage,
  articlesPage,
  contactPage,
  privacyPage,
  notFoundPage,
  forms,
  cookieConsent,
];
