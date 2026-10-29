import { ToggleArrowRightIcon } from '@sanity/icons/ToggleArrowRight';
import { defineType } from 'sanity';
import { section, str, txt } from '../fields';

const category = (name: string, title: string) => section(name, title, [str('title', 'Naslov'), txt('text', 'Opis')]);

export const cookieConsent = defineType({
  name: 'cookieConsent',
  title: 'Piškotki',
  type: 'document',
  icon: ToggleArrowRightIcon,
  fields: [
    section('banner', 'Pasica', [
      str('title', 'Naslov'),
      txt('text', 'Besedilo'),
      str('moreLabel', 'Povezava »več o piškotkih«'),
    ]),
    section('buttons', 'Gumbi', [
      str('settings', 'Nastavitve'),
      str('rejectAll', 'Zavrni vse'),
      str('acceptAll', 'Sprejmi vse'),
      str('save', 'Shrani izbiro'),
    ]),
    section('dialog', 'Nastavitve', [str('title', 'Naslov'), txt('intro', 'Uvod')]),
    category('necessary', 'Nujni piškotki'),
    category('analytics', 'Analitični piškotki'),
  ],
  preview: { prepare: () => ({ title: 'Piškotki' }) },
});
