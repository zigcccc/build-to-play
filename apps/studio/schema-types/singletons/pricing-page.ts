import { CreditCardIcon } from '@sanity/icons/CreditCard';
import { defineType } from 'sanity';
import { groups, list, refs, section, seoField, str, txt, typed, VARIABLES_HINT } from '../fields';

export const pricingPage = defineType({
  name: 'pricingPage',
  title: 'Cenik',
  type: 'document',
  icon: CreditCardIcon,
  groups: groups(['content', 'Vsebina'], ['seo', 'SEO']),
  fields: [
    section('hero', 'Uvod', [str('eyebrow', 'Nadnaslov'), str('heading', 'Naslov'), txt('lead', 'Uvod')], {
      group: 'content',
    }),
    section(
      'consultation',
      'Kartica brezplačnega posveta',
      [
        str('price', 'Cena', { description: 'Npr. 0 €' }),
        str('title', 'Naslov'),
        txt('text', 'Besedilo', { description: VARIABLES_HINT }),
        typed('cta', 'Gumb', 'link'),
      ],
      { group: 'content' }
    ),
    section(
      'packages',
      'Paketi',
      [
        str('heading', 'Naslov (samo za bralnike zaslona)'),
        str('programLinkLabel', 'Povezava na program', {
          description: 'Npr. »O programu:«',
        }),
      ],
      { group: 'content' }
    ),
    section(
      'conditions',
      'Pogoji',
      [str('eyebrow', 'Nadnaslov'), str('heading', 'Naslov'), list('items', 'Pogoji', 'iconItem')],
      { group: 'content' }
    ),
    section(
      'faq',
      'Pogosta vprašanja',
      [str('eyebrow', 'Nadnaslov'), str('heading', 'Naslov'), refs('items', 'Vprašanja', ['faq'])],
      { group: 'content' }
    ),
    typed('cta', 'CTA kartica', 'ctaCard', { group: 'content' }),
    seoField(),
  ],
  preview: { prepare: () => ({ title: 'Cenik' }) },
});
