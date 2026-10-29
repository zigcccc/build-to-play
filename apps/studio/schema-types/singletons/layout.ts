import { pageKey } from '@b2p/shared';
import { MenuIcon } from '@sanity/icons/Menu';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { groups, list, section, str, txt } from '../fields';

const navItem = defineArrayMember({
  name: 'navItem',
  title: 'Element menija',
  type: 'object',
  fields: [
    str('label', 'Besedilo'),
    defineField({
      name: 'target',
      title: 'Cilj',
      type: 'string',
      options: { list: [...pageKey.options, 'programs'] },
      description: '»programs« odpre spustni meni s programi.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'target' } },
});

export const layout = defineType({
  name: 'layout',
  title: 'Glava in noga',
  type: 'document',
  icon: MenuIcon,
  groups: groups(['header', 'Glava'], ['footer', 'Noga'], ['labels', 'Skupna besedila']),
  fields: [
    defineField({
      name: 'nav',
      title: 'Glavni meni',
      type: 'array',
      group: 'header',
      of: [navItem],
      validation: (r) => r.required(),
    }),
    str('headerCta', 'Gumb v glavi', { group: 'header' }),
    section(
      'programsMenu',
      'Spustni meni »programi«',
      [
        txt('helperText', 'Besedilo v zadnjem stolpcu'),
        str('pricingLabel', 'Povezava na cenik'),
        str('bookingLabel', 'Povezava na posvet'),
      ],
      { group: 'header' }
    ),
    section('mobileMenu', 'Mobilni meni', [str('homeLabel', 'Domov'), str('ctaLabel', 'Gumb')], { group: 'header' }),
    section(
      'footer',
      'Noga',
      [
        str('programsCaption', 'Naslov stolpca s programi'),
        str('pricingLabel', 'Povezava na cenik'),
        str('brandCaption', 'Naslov stolpca z linki'),
        list('brandLinks', 'Linki', 'link'),
        str('followCaption', 'Naslov stolpca »Sledi«'),
        str('ctaLabel', 'Gumb'),
        str('privacyLabel', 'Politika zasebnosti'),
        str('cookieSettingsLabel', 'Nastavitve piškotkov'),
      ],
      { group: 'footer' }
    ),
    str('mobileBarCta', 'Gumb v spodnji vrstici (mobilno)', {
      group: 'footer',
    }),
    section(
      'labels',
      'Skupna besedila',
      [
        str('breadcrumbHome', 'Drobtinice – Domov'),
        str('breadcrumbPrograms', 'Drobtinice – Programi'),
        str('priceFrom', 'Že od'),
        str('featured', 'Oznaka priporočenega paketa'),
        str('moreAboutProgram', 'Več o programu'),
        str('fullPricing', 'Celoten cenik'),
        str('call', 'Pokliči'),
        str('faqHelp', 'Ne najdeš odgovora?'),
        str('faqHelpLink', 'Piši mi.'),
        str('directions', 'Navodila za pot'),
      ],
      { group: 'labels' }
    ),
  ],
  preview: { prepare: () => ({ title: 'Glava in noga' }) },
});
