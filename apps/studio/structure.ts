import { EnvelopeIcon } from '@sanity/icons/Envelope';
import { WarningOutlineIcon } from '@sanity/icons/WarningOutline';
import type { StructureResolver } from 'sanity/structure';

const pages = [
  'homePage',
  'aboutPage',
  'programPage',
  'pricingPage',
  'articlesPage',
  'contactPage',
  'privacyPage',
  'notFoundPage',
  'comingSoonPage',
];
const settings = ['siteSettings', 'layout', 'forms', 'aiSummary'];

export const structure: StructureResolver = (S) =>
  S.list()
    .id('__root__')
    .title('Vsebina')
    .items([
      S.listItem()
        .id('inquiries')
        .title('Povpraševanja')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('inquiry')
            .title('Povpraševanja')
            .filter('_type == "inquiry" && status != "spam"')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
        ),
      // Caught by the spam traps: kept for review, never e-mailed.
      S.listItem()
        .id('inquiries-spam')
        .title('Neželeno')
        .icon(WarningOutlineIcon)
        .child(
          S.documentTypeList('inquiry')
            .title('Neželeno')
            .filter('_type == "inquiry" && status == "spam"')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
        ),
      S.divider(),
      S.listItem()
        .id('pages')
        .title('Strani')
        .child(
          S.list()
            .id('pages-list')
            .title('Strani')
            .items(pages.map((id) => S.listItem().singleton(id)))
        ),
      S.documentTypeListItem('program').title('Programi'),
      S.documentTypeListItem('faq').title('Pogosta vprašanja'),
      S.documentTypeListItem('location').title('Lokacije'),
      S.documentTypeListItem('testimonial').title('Mnenja strank'),
      S.divider(),
      S.documentTypeListItem('article').title('Nasveti'),
      S.documentTypeListItem('category').title('Kategorije'),
      S.documentTypeListItem('person').title('Osebe'),
      S.divider(),
      ...settings.map((id) => S.listItem().singleton(id)),
    ]);
