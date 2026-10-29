import { pageKey } from '@b2p/shared';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { section, str, txt, VARIABLES_HINT } from '../fields';

export const aiSummary = defineType({
  name: 'aiSummary',
  title: 'Povzetek za AI (llms.txt)',
  type: 'document',
  icon: SparklesIcon,
  description:
    'Besedilo datotek /llms.txt in /llms-full.txt, ki jih berejo AI asistenti. Programi, cene, vprašanja in kontakt se dodajo samodejno.',
  fields: [
    txt('intro', 'Uvod', {
      description: `Kratek opis za AI: kdo si, kje, v katerem jeziku in kaj ponujaš. ${VARIABLES_HINT}`,
    }),
    defineField({
      name: 'pages',
      title: 'Strani',
      type: 'array',
      description: 'Kaj najde AI na posamezni strani. Nasveti se izpišejo samo, ko so vklopljeni.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pageSummary',
          fields: [
            defineField({
              name: 'page',
              title: 'Stran',
              type: 'string',
              options: { list: pageKey.options },
              validation: (r) => r.required(),
            }),
            str('description', 'Opis'),
          ],
          preview: { select: { title: 'page', subtitle: 'description' } },
        }),
      ],
      validation: (r) => r.required(),
    }),
    section('labels', 'Naslovi in oznake', [
      str('programs', 'Programi'),
      str('priceFrom', 'Cena od', { description: 'Npr. »Cena že od«' }),
      str('pages', 'Strani'),
      str('articles', 'Nasveti'),
      str('fullLink', 'Povezava na celotne informacije'),
      str('forWho', 'Za koga'),
      str('includes', 'Kaj dobiš'),
      str('packages', 'Paketi'),
      str('faqs', 'Pogosta vprašanja'),
      str('terms', 'Plačilo in pogoji'),
      str('about', 'O trenerju'),
      str('contact', 'Kontakt'),
      str('phone', 'Telefon'),
      str('email', 'E-pošta'),
      str('responseTime', 'Odzivni čas'),
      str('booking', 'Brezplačen posvet'),
      str('locations', 'Lokacije'),
      str('hours', 'Delovni čas'),
    ]),
  ],
  preview: { prepare: () => ({ title: 'Povzetek za AI (llms.txt)' }) },
});
