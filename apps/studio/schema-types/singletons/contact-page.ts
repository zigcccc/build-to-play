import { EnvelopeIcon } from '@sanity/icons/Envelope';
import { defineType } from 'sanity';
import { groups, section, seoField, str, typed, VARIABLES_HINT } from '../fields';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Kontakt',
  type: 'document',
  icon: EnvelopeIcon,
  groups: groups(['content', 'Vsebina'], ['seo', 'SEO']),
  fields: [
    section(
      'hero',
      'Uvod',
      [
        str('eyebrow', 'Nadnaslov'),
        str('heading', 'Naslov'),
        typed('lead', 'Uvod', 'simpleText', {
          description: `Povezava vrste »Odpri obrazec za brezplačen posvet« odpre obrazec. ${VARIABLES_HINT}`,
        }),
      ],
      { group: 'content' }
    ),
    str('formHeading', 'Naslov obrazca', { group: 'content' }),
    str('directHeading', 'Naslov »Neposredno«', { group: 'content' }),
    str('hoursHeading', 'Naslov »Delovni čas«', { group: 'content' }),
    str('locationsHeading', 'Naslov »Lokacije«', { group: 'content' }),
    seoField(),
  ],
  preview: { prepare: () => ({ title: 'Kontakt' }) },
});
