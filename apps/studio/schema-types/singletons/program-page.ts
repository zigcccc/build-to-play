import { RocketIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { section, str, txt, typed, VARIABLES_HINT } from '../fields';

const header = (name: string, title: string) =>
  section(name, title, [str('eyebrow', 'Nadnaslov'), str('heading', 'Naslov')]);

/** Copy shared by all three program pages; per-program content lives on each program. */
export const programPage = defineType({
  name: 'programPage',
  title: 'Predloga programov',
  type: 'document',
  icon: RocketIcon,
  fields: [
    section('hero', 'Uvod', [
      str('eyebrowPrefix', 'Nadnaslov', {
        description: 'Pred številko, npr. »Program« → Program 01',
      }),
      typed('primaryCta', 'Glavni gumb', 'link'),
      str('pricesLabel', 'Drugi gumb (skok na cene)'),
    ]),
    header('forWho', 'Za koga'),
    header('includes', 'Kaj dobiš'),
    section('steps', 'Kako poteka', [
      str('eyebrow', 'Nadnaslov'),
      str('heading', 'Naslov'),
      typed('step1', 'Korak 01', 'titledText'),
      str('step2Title', 'Korak 02 – naslov', {
        description: 'Besedilo je pri vsakem programu.',
      }),
      typed('step3', 'Korak 03', 'titledText'),
      typed('step4', 'Korak 04', 'titledText', { description: VARIABLES_HINT }),
    ]),
    section('pricing', 'Cene', [str('eyebrow', 'Nadnaslov'), str('heading', 'Naslov'), txt('vatNote', 'Opomba o DDV')]),
    header('faq', 'Pogosta vprašanja'),
    section('others', 'Drugi programi', [str('eyebrow', 'Nadnaslov')]),
    typed('cta', 'CTA kartica', 'ctaCard'),
  ],
  preview: { prepare: () => ({ title: 'Predloga programov' }) },
});
