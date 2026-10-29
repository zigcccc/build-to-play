import { WarningOutlineIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { list, str, txt, typed } from '../fields';

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: 'Stran 404',
  type: 'document',
  icon: WarningOutlineIcon,
  fields: [
    str('eyebrow', 'Nadnaslov'),
    str('heading', 'Naslov'),
    txt('text', 'Besedilo'),
    typed('primaryCta', 'Glavni gumb', 'link'),
    typed('secondaryCta', 'Drugi gumb', 'link'),
    list('quickLinks', 'Hitre povezave', 'link'),
  ],
  preview: { prepare: () => ({ title: 'Stran 404' }) },
});
