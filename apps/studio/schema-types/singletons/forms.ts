import { ComposeIcon } from '@sanity/icons/Compose';
import { defineType } from 'sanity';
import { strList } from '../fields';

/** Only the options visitors choose from; the forms' own wording is fixed in the website code. */
export const forms = defineType({
  name: 'forms',
  title: 'Obrazci',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    strList('subjects', 'Kontaktni obrazec – možnosti »Zadeva«', {
      description: 'Prva možnost je izbrana vnaprej.',
    }),
    strList('goals', 'Brezplačen posvet – cilji', {
      description: 'Med temi izbira obiskovalec v prvem koraku.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Obrazci' }) },
});
