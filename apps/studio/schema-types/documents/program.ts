import { iconName, programKey } from '@b2p/shared';
import { RocketIcon } from '@sanity/icons/Rocket';
import { defineField, defineType } from 'sanity';
import { groups, list, refs, section, seoField, str, strList, txt, typed } from '../fields';

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  icon: RocketIcon,
  groups: groups(['basics', 'Osnovno'], ['page', 'Stran programa'], ['packages', 'Paketi'], ['seo', 'SEO']),
  fields: [
    defineField({
      name: 'key',
      title: 'Vrsta programa',
      type: 'string',
      group: 'basics',
      options: {
        list: [...programKey.options],
        layout: 'radio',
        direction: 'horizontal',
      },
      description: 'Določa ikono in predizbiro v obrazcu za posvet.',
      validation: (r) => r.required(),
    }),
    str('name', 'Ime programa', { group: 'basics' }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'basics',
      options: { source: 'key' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Vrstni red',
      type: 'number',
      group: 'basics',
      validation: (r) => r.required().integer().min(1),
    }),
    str('shortLabel', 'Kratko ime', {
      group: 'basics',
      description: 'Za zavihke in izbirne gumbe, npr. »Fitnes«.',
    }),
    str('pricingLabel', 'Ime v ceniku', {
      group: 'basics',
      description: 'Npr. »Fitnes in osebno«.',
    }),
    defineField({
      name: 'icon',
      title: 'Ikona',
      type: 'string',
      group: 'basics',
      options: { list: [...iconName.options] },
      validation: (r) => r.required(),
    }),
    str('tagline', 'Kratek opis v meniju', { group: 'basics' }),
    txt('cardDescription', 'Opis na kartici (domača stran)', {
      group: 'basics',
    }),
    strList('cardBullets', 'Alineje na kartici (domača stran)', {
      group: 'basics',
    }),
    str('otherShort', 'Opis v razdelku »Drugi programi«', { group: 'basics' }),
    section(
      'priceFrom',
      'Cena »že od«',
      [
        defineField({ name: 'amount', title: 'Znesek (€)', type: 'number' }),
        str('label', 'Prikaz (neobvezno)', {
          optional: true,
          description: 'Če je izpolnjeno, se prikaže namesto zneska.',
        }),
        str('unit', 'Enota', { description: 'Npr. / trening' }),
      ],
      { group: 'basics' }
    ),
    txt('lead', 'Uvod (hero)', { group: 'page' }),
    typed('heroImage', 'Fotografija', 'altImage', {
      group: 'page',
      optional: true,
    }),
    list('forWho', 'Za koga', 'titledText', { group: 'page' }),
    txt('includesLead', 'Kaj dobiš – uvod', { group: 'page' }),
    strList('includes', 'Kaj dobiš – seznam', { group: 'page' }),
    txt('assessmentStep', 'Korak 02 »Ocena izhodišča« – besedilo', {
      group: 'page',
    }),
    refs('faqs', 'Pogosta vprašanja', ['faq'], { group: 'page' }),
    list('packages', 'Paketi', 'pricePackage', { group: 'packages' }),
    seoField(),
  ],
  orderings: [
    {
      title: 'Vrstni red',
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: { select: { title: 'name', subtitle: 'shortLabel' } },
});
