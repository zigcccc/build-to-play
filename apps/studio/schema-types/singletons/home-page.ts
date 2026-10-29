import { HomeIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { groups, list, refs, section, seoField, str, strList, txt, typed, VARIABLES_HINT } from '../fields';

export const homePage = defineType({
  name: 'homePage',
  title: 'Domača stran',
  type: 'document',
  icon: HomeIcon,
  groups: groups(
    ['hero', 'Uvod'],
    ['about', 'O meni'],
    ['programs', 'Programi'],
    ['consultation', 'Posvet'],
    ['results', 'Rezultati'],
    ['locations', 'Lokacije'],
    ['contact', 'Kontakt'],
    ['seo', 'SEO']
  ),
  fields: [
    section(
      'hero',
      'Uvod',
      [
        str('badge', 'Značka'),
        typed('heading', 'Naslov', 'accentHeading'),
        txt('lead', 'Uvodno besedilo'),
        typed('primaryCta', 'Glavni gumb', 'link'),
        typed('secondaryCta', 'Drugi gumb', 'link', { optional: true }),
        list('stats', 'Številke', 'stat'),
        typed('image', 'Fotografija', 'altImage'),
      ],
      { group: 'hero' }
    ),
    strList('marquee', 'Tekoči trak', { group: 'hero' }),
    section(
      'about',
      'O meni',
      [
        str('eyebrow', 'Nadnaslov'),
        str('heading', 'Naslov'),
        txt('lead', 'Uvod'),
        txt('text', 'Besedilo'),
        typed('portrait', 'Portret', 'altImage', { optional: true }),
        list('items', 'Koraki', 'titledText'),
        typed('link', 'Povezava', 'link'),
      ],
      { group: 'about' }
    ),
    section(
      'programs',
      'Programi in cenik',
      [
        str('eyebrow', 'Nadnaslov'),
        str('heading', 'Naslov'),
        txt('intro', 'Besedilo'),
        typed('link', 'Povezava', 'link'),
      ],
      { group: 'programs' }
    ),
    section(
      'consultation',
      'Brezplačen posvet',
      [
        str('eyebrow', 'Nadnaslov'),
        typed('heading', 'Naslov', 'accentHeading'),
        txt('lead', 'Besedilo'),
        typed('primaryCta', 'Glavni gumb', 'link'),
        typed('secondaryCta', 'Drugi gumb', 'link', { optional: true }),
        list('steps', 'Koraki', 'titledText', { description: VARIABLES_HINT }),
      ],
      { group: 'consultation' }
    ),
    section(
      'results',
      'Rezultati',
      [
        str('eyebrow', 'Nadnaslov'),
        str('heading', 'Naslov'),
        txt('intro', 'Besedilo', { description: VARIABLES_HINT }),
        list('steps', 'Koraki', 'titledText'),
        str('reportEyebrow', 'Poročilo – nadnaslov'),
        str('reportTitle', 'Poročilo – naslov'),
        strList('chartLabels', 'Oznake na grafu'),
        str('caption', 'Opomba pod grafom'),
        list('tabs', 'Zavihki', 'resultTab'),
        refs('testimonials', 'Mnenja strank', ['testimonial'], {
          optional: true,
        }),
        typed('moreTestimonials', 'Povezava »Več mnenj«', 'link', {
          optional: true,
        }),
      ],
      { group: 'results' }
    ),
    section(
      'locations',
      'Lokacije',
      [
        str('eyebrow', 'Nadnaslov'),
        str('heading', 'Naslov'),
        section('online', 'Vrstica »Online«', [str('name', 'Ime'), txt('text', 'Besedilo'), str('tag', 'Oznaka')]),
      ],
      { group: 'locations' }
    ),
    section(
      'contact',
      'Kontakt',
      [
        str('eyebrow', 'Nadnaslov'),
        str('heading', 'Naslov'),
        txt('lead', 'Besedilo', { description: VARIABLES_HINT }),
        str('formHeading', 'Naslov obrazca'),
        section('labels', 'Oznake kontaktov', [str('phone', 'Telefon'), str('email', 'E-pošta')]),
      ],
      { group: 'contact' }
    ),
    seoField(),
  ],
  preview: { prepare: () => ({ title: 'Domača stran' }) },
});
