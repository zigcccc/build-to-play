import { aboutPage } from './about-page';
import { articlesPage } from './articles-page';
import { comingSoonPage } from './coming-soon-page';
import { contactPage } from './contact-page';
import { cookieConsent } from './cookie-consent';
import { forms } from './forms';
import { homePage } from './home-page';
import { layout } from './layout';
import { notFoundPage } from './not-found-page';
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
  comingSoonPage,
  forms,
  cookieConsent,
];
