import { accent, block, key, keyed, link, linkedBlock, listItem, ref, refs, slug, stats, titled } from './seed-helpers';

const booking = (label: string) => link(label, 'booking');
const page = (label: string, p: string, anchor?: string) => link(label, 'page', { page: p, anchor });
const program = (label: string, id: string) => link(label, 'program', { program: ref(id) });

const ctaCard = (
  eyebrow: string,
  heading: ReturnType<typeof accent>,
  text: string,
  primary: object,
  secondary?: object
) => ({
  _type: 'ctaCard',
  eyebrow,
  heading,
  text,
  primary,
  secondary,
});

export const person = {
  _id: 'person-trainer',
  _type: 'person',
  name: '[Ime Priimek]',
  owner: true,
  role: 'Trener · Build 2 Play',
  jobTitle: 'Osebni in športni trener',
  bio: '[Kratka predstavitev v enem stavku.]',
  knowsAbout: [
    'trening moči',
    'kondicijska priprava športnikov',
    'osebno trenerstvo',
    'preventiva poškodb',
    'online trenerstvo',
  ],
  sameAs: [],
};

export const locations = [
  {
    _id: 'location-1',
    _type: 'location',
    name: '[Ime lokacije 1]',
    street: '[Ulica in hišna številka]',
    postalCode: '[poštna št.]',
    city: '[Mesto]',
    tags: ['Osebno', 'Športno'],
    geo: { lat: 46.0569, lng: 14.5058 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=46.0569,14.5058',
    order: 1,
  },
  {
    _id: 'location-2',
    _type: 'location',
    name: '[Ime lokacije 2]',
    street: '[Ulica in hišna številka]',
    postalCode: '[poštna št.]',
    city: '[Mesto]',
    tags: ['Športno', 'Ekipe'],
    geo: { lat: 46.0711, lng: 14.5122 },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=46.0711,14.5122',
    order: 2,
  },
];

export const testimonials = [
  {
    _id: 'testimonial-1',
    _type: 'testimonial',
    quote: '[Mnenje stranke: dva do trije stavki o tem, kako je potekal trening in kaj se je spremenilo.]',
    name: '[Ime P.]',
    program: '[Program]',
    place: '[kraj]',
  },
];

export const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Build 2 Play',
  tagline: 'Train. Build. Perform.',
  description:
    'Build 2 Play je osebni in športni trener v kraju [Mesto]. Ponujam osebne treninge ena na ena ali v paru, kondicijsko pripravo za športnike in ekipe ter online trenerstvo z video navodili. Prvi posvet je brezplačen.',
  phone: { display: '[+386 XX XXX XXX]', e164: '+386' },
  email: '[info@domena.si]',
  socials: keyed([
    { _type: 'socialLink', platform: 'instagram', url: 'https://www.instagram.com/', handle: '[@uporabnik]' },
    { _type: 'socialLink', platform: 'facebook', url: 'https://www.facebook.com/', handle: '[Build 2 Play]' },
  ]),
  openingHours: keyed([
    { _type: 'labeledValue', label: 'Pon–Pet', value: '[07:00–21:00]' },
    { _type: 'labeledValue', label: 'Sobota', value: '[08:00–13:00]' },
    { _type: 'labeledValue', label: 'Nedelja', value: 'Zaprto' },
  ]),
  notificationEmail: '[obvestila@domena.si]',
  companyName: '[Naziv podjetja, d.o.o.]',
  areaServed: '[Mesto] z okolico in online po Sloveniji',
  priceRange: '€€',
  responseTime: '[ROK]',
  consultationDuration: '[TRAJANJE]',
  testInterval: '[X]',
  seo: {
    title: 'Build 2 Play – osebni in športni trener',
    description:
      'Osebni in športni trener: treningi z jasnim načrtom in merljivim napredkom, v živo ali online. Prvi posvet je brezplačen.',
  },
};

export const layout = {
  _id: 'layout',
  _type: 'layout',
  nav: keyed([
    { _type: 'navItem', label: 'o meni', target: 'about' },
    { _type: 'navItem', label: 'programi', target: 'programs' },
    { _type: 'navItem', label: 'cenik', target: 'pricing' },
    { _type: 'navItem', label: 'nasveti', target: 'articles' },
    { _type: 'navItem', label: 'kontakt', target: 'contact' },
  ]),
  headerCta: 'Brezplačen posvet',
  programsMenu: {
    helperText: 'Ne veš, kaj izbrati? Na brezplačnem posvetu skupaj ugotoviva.',
    pricingLabel: 'Celoten cenik',
    bookingLabel: 'Brezplačen posvet',
  },
  mobileMenu: { homeLabel: 'Domov', ctaLabel: 'Brezplačen uvodni posvet' },
  footer: {
    programsCaption: 'Programi',
    pricingLabel: 'Cenik',
    brandCaption: 'Build 2 Play',
    brandLinks: keyed([
      page('O meni', 'about'),
      page('Nasveti', 'articles'),
      page('Kontakt', 'contact'),
      booking('Brezplačen posvet'),
    ]),
    followCaption: 'Sledi',
    ctaLabel: 'Brezplačen posvet',
    privacyLabel: 'Politika zasebnosti',
    cookieSettingsLabel: 'Nastavitve piškotkov',
  },
  mobileBarCta: 'Brezplačen posvet',
  labels: {
    breadcrumbHome: 'Domov',
    breadcrumbPrograms: 'Programi',
    priceFrom: 'Že od',
    featured: 'Priporočeno',
    moreAboutProgram: 'Več o programu',
    fullPricing: 'Celoten cenik',
    call: 'Pokliči',
    faqHelp: 'Ne najdeš odgovora?',
    faqHelpLink: 'Piši mi.',
    directions: 'Navodila za pot',
  },
};

export const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    badge: 'Osebni in športni trener',
    heading: accent(['Zgradi telo.'], [['Igraj', 'accent'], ' bolje.']),
    lead: 'Treningi z jasnim načrtom in merljivim napredkom — za športnike, ki hočejo več na igrišču, in za vse, ki hočejo telo, na katerega se lahko zanesejo.',
    primaryCta: booking('Brezplačen uvodni posvet'),
    secondaryCta: page('Programi in cenik', 'home', 'programi'),
    stats: stats([
      ['[X]+ let', 'izkušenj v treningu [dopolni]'],
      ['[Licenca]', '[izobrazba ali certifikat]'],
      ['[Mesto] + online', 'treningi v živo in na daljavo'],
    ]),
  },
  marquee: ['Fitnes in osebno trenerstvo', 'Športno trenerstvo', 'Online trenerstvo', 'Brezplačen uvodni posvet'],
  about: {
    eyebrow: 'O meni',
    heading: 'Trening z namenom, ne na pamet.',
    lead: 'Sem [Ime], [kratek opis: športno ozadje, izobrazba, s kom najraje delam]. Build 2 Play sem ustvaril za ljudi, ki želijo trenirati pametno — ne samo trdo.',
    text: 'Vsak program začneva z oceno tvojega izhodišča: kako se giblješ, kje si močan in kaj te omejuje. Nato zgradiva načrt, ki mu lahko slediš, in ga sproti prilagajava tvojemu napredku.',
    items: titled([
      ['Ocena izhodišča', 'Gibanje, moč, kondicija in tvoji cilji.'],
      ['Načrt po meri', 'Program, ki ustreza tvojemu urniku in športu.'],
      ['Merljiv napredek', 'Redna testiranja, da veš, kje si.'],
    ]),
    link: page('Več o meni', 'about'),
  },
  programs: {
    eyebrow: 'Programi in cenik',
    heading: 'Izberi svojo pot.',
    intro:
      'Štirje programi, en pristop: najprej te spoznam, potem trenirava. Ne veš, kaj izbrati? Za to je uvodni posvet.',
    link: page('Celoten cenik', 'pricing'),
  },
  consultation: {
    eyebrow: 'Uvodni posvet',
    heading: accent(['Prvi korak je ', ['brezplačen', 'accent'], '.']),
    lead: 'Brez obveznosti in brez prodajnega pritiska. Pogovoriva se o tvojih ciljih in skupaj ugotoviva, kateri program ima smisel zate.',
    primaryCta: booking('Rezerviraj posvet'),
    secondaryCta: link('Pokliči', 'phone'),
    steps: titled([
      ['Pošlji povpraševanje', 'Izpolni kratek obrazec ali me pokliči. Odgovorim v {rok}.'],
      [
        'Brezplačen posvet',
        '{trajanje} pogovora o tvojih ciljih, izkušnjah in morebitnih omejitvah — v živo ali na daljavo.',
      ],
      ['Načrt in prvi trening', 'Dobiš predlog programa. Če ti ustreza, začneva.'],
    ]),
  },
  results: {
    eyebrow: 'Rezultati',
    heading: 'Napredek, ki ga izmeriš.',
    intro:
      'Vsak program se začne s testiranjem, ki ga ponavljamo vsakih {interval} tednov. Napredek tako ni občutek, ampak številka.',
    steps: titled([
      ['Začetno testiranje', 'Izhodišče, s katerim primerjamo vse nadaljnje meritve.'],
      ['Ponovni test vsakih {interval} tednov', 'Isti testi, isti pogoji, primerljivi rezultati.'],
      ['Tvoje poročilo', 'Po vsakem testu dobiš pregled napredka in prilagojen načrt.'],
    ]),
    reportEyebrow: 'Primer poročila',
    reportTitle: 'Začetek → 12. teden',
    chartLabels: ['Začetek', '4. teden', '8. teden', '12. teden'],
    caption: 'Ilustrativni primer. V poročilu so tvoje dejanske meritve.',
    tabs: keyed([
      {
        _type: 'resultTab',
        program: ref('program-fitnes'),
        description:
          'Moč, vzdržljivost in telesna sestava. Merimo, kar šteje v vsakdanu, in ti pokažemo, kam se premikaš.',
        points: [0, 18, 30, 46, 55, 68, 74, 82],
        metrics: keyed([
          { _type: 'resultMetric', label: 'Počep (1 ponovitev)', from: '60 kg', to: '85 kg', delta: '+42 %' },
          { _type: 'resultMetric', label: 'Plank', from: '0:45', to: '2:10', delta: '+189 %' },
          { _type: 'resultMetric', label: 'Srčni utrip v mirovanju', from: '72', to: '61 ud./min', delta: '−15 %' },
        ]),
      },
      {
        _type: 'resultTab',
        program: ref('program-sport'),
        description: 'Eksplozivnost, hitrost in agilnost. Testi so izbrani glede na tvoj šport in fazo sezone.',
        points: [0, 10, 22, 28, 40, 52, 58, 66],
        metrics: keyed([
          { _type: 'resultMetric', label: 'Skok z mesta (CMJ)', from: '42 cm', to: '49 cm', delta: '+17 %' },
          { _type: 'resultMetric', label: 'Šprint 10 m', from: '1,92 s', to: '1,78 s', delta: '−7 %' },
          { _type: 'resultMetric', label: 'Agilnost (T-test)', from: '10,8 s', to: '9,9 s', delta: '−8 %' },
        ]),
      },
      {
        _type: 'resultTab',
        program: ref('program-online'),
        description: 'Doslednost in napredek na daljavo. Podatki iz tvojih treningov in tedenskih pregledov.',
        points: [0, 14, 20, 34, 42, 56, 70, 78],
        metrics: keyed([
          { _type: 'resultMetric', label: 'Opravljeni treningi', from: '0', to: '22 / 24', delta: '92 %' },
          { _type: 'resultMetric', label: 'Sklece v enem nizu', from: '12', to: '30', delta: '+150 %' },
          { _type: 'resultMetric', label: 'Koraki na dan', from: '5.400', to: '9.100', delta: '+69 %' },
        ]),
      },
      {
        _type: 'resultTab',
        program: ref('program-vratarji'),
        description:
          'Odziv, gibljivost in eksplozivnost v vratih. Testi so izbrani glede na zahteve vratarskega položaja.',
        points: [0, 12, 20, 32, 41, 50, 61, 70],
        metrics: keyed([
          { _type: 'resultMetric', label: 'Reakcijski čas', from: '0,42 s', to: '0,35 s', delta: '−17 %' },
          { _type: 'resultMetric', label: 'Bočni skok', from: '1,95 m', to: '2,20 m', delta: '+13 %' },
          { _type: 'resultMetric', label: 'Notranja rotacija kolka', from: '28°', to: '41°', delta: '+46 %' },
        ]),
      },
    ]),
    testimonials: refs(['testimonial-1']),
  },
  locations: {
    eyebrow: 'Lokacije',
    heading: 'Kje se dobiva.',
    online: {
      name: 'Online — kjerkoli',
      text: 'Program, video navodila in pregledi prek [aplikacija / platforma].',
      tag: 'Online',
    },
  },
  contact: {
    eyebrow: 'Kontakt',
    heading: 'Začniva.',
    lead: 'Napiši nekaj besed o sebi in o tem, kaj želiš doseči. Odgovorim v {rok} in skupaj dogovoriva termin brezplačnega posveta.',
    formHeading: 'Pošlji povpraševanje',
    labels: { phone: 'Telefon', email: 'E-pošta' },
  },
  seo: {
    title: 'Build 2 Play – osebni in športni trener',
    description:
      'Treningi z jasnim načrtom in merljivim napredkom: osebno trenerstvo, kondicijska priprava za športnike in online programi. Prvi posvet je brezplačen.',
  },
};

export const aboutPage = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  hero: {
    eyebrow: 'O meni · {ime}',
    heading: 'Zakaj Build 2 Play.',
    lead: '[Dva do trije stavki: kdo sem, s kom najraje delam in zakaj sem ustanovil Build 2 Play.] Verjamem, da je trening orodje — za igro, za službo, za življenje, ki ga hočeš živeti.',
    primaryCta: booking('Brezplačen posvet'),
    secondaryCta: page('Kako delam', 'about', 'pristop'),
    stats: stats([
      ['[X]+ let', 'izkušenj v treningu'],
      ['[Licenca]', '[izobrazba / certifikat]'],
    ]),
  },
  story: {
    eyebrow: 'Moja zgodba',
    heading: 'Od prvega treninga do lastnega pristopa.',
    paragraphs: [
      '[Odstavek 1: začetki — kako se je začelo s športom ali treningom, kaj te je pritegnilo.]',
      '[Odstavek 2: pot — izobrazba, delo s športniki ali ekipami, prelomni trenutki, napake, iz katerih si se največ naučil.]',
      '[Odstavek 3: danes — s kom delaš, kaj te žene in kaj lahko stranka pričakuje od sodelovanja.]',
    ],
    quote: '[Citat, ki v enem stavku povzame tvoj pristop.]',
  },
  approach: {
    eyebrow: 'Pristop',
    heading: 'Kako delam.',
    items: titled([
      ['Najprej ocena', 'Preden predpišem prvo vajo, vem, kako se giblješ, kje si močan in kaj te omejuje.'],
      ['Načrt, ki ga zmoreš', 'Program prilagodim tvojemu urniku, športu in fazi sezone — ne obratno.'],
      ['Tehnika pred težo', 'Pravilno gibanje je osnova za napredek brez poškodb. Breme pride potem.'],
      ['Merljiv napredek', 'Redno testiramo, da odločitve temeljijo na številkah, ne na občutku.'],
    ]),
  },
  credentials: {
    eyebrow: 'Izobrazba in licence',
    heading: 'Znanje, na katerem gradim.',
    items: keyed([
      { _type: 'credential', year: '[Leto]', title: '[Naziv izobrazbe ali licence]', institution: '[Ustanova]' },
      { _type: 'credential', year: '[Leto]', title: '[Naziv izobrazbe ali licence]', institution: '[Ustanova]' },
      { _type: 'credential', year: '[Leto]', title: '[Naziv izobrazbe ali licence]', institution: '[Ustanova]' },
      {
        _type: 'credential',
        year: '[Leto]',
        title: '[Športna kariera / izkušnja z ekipo]',
        institution: '[Klub / nivo]',
      },
    ]),
  },
  cta: ctaCard(
    'Brezplačen uvodni posvet',
    accent(['Spoznajva se.']),
    'Brez obveznosti. Pogovoriva se o tvojih ciljih in skupaj ugotoviva, kateri program ima smisel zate.',
    booking('Rezerviraj posvet'),
    page('Poglej programe', 'home', 'programi')
  ),
  seo: {
    title: 'O meni – {ime}, osebni in športni trener',
    description:
      'Kdo sem, kako delam in na kakšnem znanju gradim: ocena izhodišča, načrt po meri, tehnika pred težo in merljiv napredek.',
  },
};

export const programPage = {
  _id: 'programPage',
  _type: 'programPage',
  hero: { eyebrowPrefix: 'Program', primaryCta: booking('Brezplačen posvet'), pricesLabel: 'Cene programa' },
  forWho: { eyebrow: 'Za koga', heading: 'Je to zate?' },
  includes: { eyebrow: 'Vključeno', heading: 'Kaj dobiš.' },
  steps: {
    eyebrow: 'Kako poteka',
    heading: 'Od posveta do prvega rezultata.',
    step1: {
      _type: 'titledText',
      title: 'Brezplačen posvet',
      text: 'Pogovor o ciljih, izkušnjah in morebitnih omejitvah.',
    },
    step2Title: 'Ocena izhodišča',
    step3: { _type: 'titledText', title: 'Program po meri', text: 'Dobiš načrt in začneva s treningi.' },
    step4: {
      _type: 'titledText',
      title: 'Pregled in prilagoditev',
      text: 'Ponovni test vsakih {interval} tednov in prilagoditev programa.',
    },
  },
  pricing: {
    eyebrow: 'Cene',
    heading: 'Izberi paket.',
    vatNote: 'Cene vključujejo DDV. [Preveri pri računovodji, ali je podjetje zavezanec za DDV.]',
  },
  faq: { eyebrow: 'Pogosta vprašanja', heading: 'Še kaj?' },
  others: { eyebrow: 'Drugi programi' },
  cta: ctaCard(
    'Brezplačen uvodni posvet',
    accent(['Prvi korak je ', ['brezplačen', 'accent'], '.']),
    'Brez obveznosti. Pogovoriva se o tvojih ciljih in preveriva, ali je ta program pravi zate.',
    booking('Rezerviraj posvet'),
    page('Kontakt', 'contact')
  ),
};

export const pricingPage = {
  _id: 'pricingPage',
  _type: 'pricingPage',
  hero: {
    eyebrow: 'Cenik',
    heading: 'Jasne cene. Brez presenečenj.',
    lead: 'Vse cene vključujejo DDV. Prvi pogovor je vedno brezplačen — tam skupaj izbereva paket, ki ima smisel zate.',
  },
  consultation: {
    price: '0 €',
    title: 'Uvodni posvet',
    text: '{trajanje} pogovora o ciljih, v živo ali prek video klica. Brez obveznosti.',
    cta: booking('Rezerviraj posvet'),
  },
  packages: { heading: 'Paketi po programih', programLinkLabel: 'O programu:' },
  conditions: {
    eyebrow: 'Za vse programe',
    heading: 'Dobro je vedeti.',
    items: keyed([
      {
        _type: 'iconItem',
        icon: 'credit-card',
        title: 'Plačilo',
        text: '[Gotovina, kartica, nakazilo na TRR — dopolni.] Pakete plačaš ob prvem treningu.',
      },
      {
        _type: 'iconItem',
        icon: 'calendar',
        title: 'Veljavnost paketov',
        text: 'Paketi veljajo [X] mesecev od prvega treninga.',
      },
      {
        _type: 'iconItem',
        icon: 'clock',
        title: 'Odpoved termina',
        text: 'Brezplačno do [24] ur pred terminom. Kasnejša odpoved šteje kot opravljen trening.',
      },
      {
        _type: 'iconItem',
        icon: 'receipt',
        title: 'Račun',
        text: 'Za vsako plačilo prejmeš račun. [Za podjetja tudi na firmo.]',
      },
    ]),
  },
  faq: {
    eyebrow: 'Vprašanja o plačilu',
    heading: 'Še kaj?',
    items: refs(['faq-pricing-1', 'faq-pricing-2', 'faq-pricing-3', 'faq-pricing-4']),
  },
  cta: ctaCard(
    'Ne veš, kateri paket?',
    accent(['Izbereva skupaj.']),
    'Na brezplačnem posvetu preveriva tvoje cilje in urnik ter predlagam paket, ki ima smisel.',
    booking('Rezerviraj posvet'),
    page('Kontakt', 'contact')
  ),
  seo: {
    title: 'Cenik osebnih, športnih in online treningov',
    description:
      'Cene paketov za osebno, športno in online trenerstvo. Vse cene vključujejo DDV, uvodni posvet je brezplačen in brez obveznosti.',
  },
};

export const articlesPage = {
  _id: 'articlesPage',
  _type: 'articlesPage',
  enabled: false,
  hero: {
    eyebrow: 'Nasveti',
    heading: 'Trening, prehrana, regeneracija.',
    lead: 'Kratki, praktični članki — brez mitov in brez čudežnih rešitev.',
  },
  list: {
    allLabel: 'Vse',
    featuredLabel: 'Izpostavljeno',
    readingTime: 'min branja',
    readingTimeShort: 'min',
    loadMore: 'Naloži več člankov',
    emptyText: 'V tej kategoriji še ni člankov.',
    emptyCta: 'Pokaži vse',
  },
  article: {
    tocLabel: 'V članku',
    shareLabel: 'Deli',
    copyLink: 'Kopiraj povezavo',
    copied: 'Kopirano',
    authorLabel: 'Avtor',
    authorLink: 'Več o meni',
    updatedLabel: 'Posodobljeno',
    relatedHeading: 'Preberi še',
    allArticles: 'Vsi nasveti',
  },
  seo: {
    title: 'Nasveti o treningu, prehrani in regeneraciji',
    description:
      'Kratki, praktični članki o treningu moči, prehrani, regeneraciji in športni pripravi — brez mitov in čudežnih rešitev.',
  },
};

const bookingMark = key();

export const contactPage = {
  _id: 'contactPage',
  _type: 'contactPage',
  hero: {
    eyebrow: 'Kontakt',
    heading: 'Piši mi.',
    lead: [
      linkedBlock(
        [
          'Odgovorim v {rok}. Če želiš rezervirati brezplačen posvet, je hitreje prek ',
          ['kratkega obrazca za posvet', 'strong', bookingMark],
          '.',
        ],
        [{ _key: bookingMark, _type: 'link', kind: 'booking' }]
      ),
    ],
  },
  formHeading: 'Sporočilo',
  directHeading: 'Neposredno',
  hoursHeading: 'Treningi po dogovoru',
  locationsHeading: 'Lokacije',
  seo: {
    title: 'Kontakt',
    description:
      'Piši mi ali pokliči. Odgovorim v [ROK], brezplačen uvodni posvet pa lahko rezerviraš prek kratkega obrazca.',
  },
};

const cookieMark = key();
const table = (rows: string[][]) => ({
  _type: 'table',
  _key: key(),
  rows: rows.map((cells) => ({ _type: 'tableRow', _key: key(), cells })),
});

const section = (title: string, anchor: string, body: unknown[]) => ({
  _type: 'legalSection',
  _key: key(),
  title,
  anchor: slug(anchor),
  body,
});

export const privacyPage = {
  _id: 'privacyPage',
  _type: 'privacyPage',
  eyebrow: 'Pravno',
  title: 'Politika zasebnosti',
  updatedAt: '2026-10-29',
  updatedLabel: 'Zadnja posodobitev:',
  tocLabel: 'Vsebina',
  sections: [
    section('Upravljavec', 'upravljavec', [
      block([
        ['[Naziv podjetja, naslov, matična številka, davčna številka, e-pošta za vprašanja o zasebnosti.]', 'em'],
      ]),
    ]),
    section('Katere podatke zbiramo', 'podatki', [
      block('Zbiramo samo podatke, ki jih vpišeš sam:'),
      listItem('ime in priimek, e-poštni naslov in telefonsko številko (neobvezno),'),
      listItem('vsebino sporočila ter odgovore iz obrazca za brezplačen posvet (cilj, želeni termini),'),
      listItem('tehnične podatke o obisku, če za to podaš soglasje (analitični piškotki).'),
    ]),
    section('Namen in pravna podlaga', 'namen', [
      block([
        [
          '[Odgovor na povpraševanje in dogovor o terminu — pravna podlaga; izvajanje storitve — pogodba; analitika — soglasje. Pregleda pravni svetovalec.]',
          'em',
        ],
      ]),
    ]),
    section('Hramba', 'hramba', [block([['[Koliko časa hranimo povpraševanja, podatke strank in račune.]', 'em']])]),
    section('Obdelovalci', 'obdelovalci', [
      block([
        [
          '[Ponudnik gostovanja, e-poštni ponudnik, orodje za analitiko, aplikacija za online programe — z navedbo države obdelave.]',
          'em',
        ],
      ]),
    ]),
    section('Tvoje pravice', 'pravice', [
      listItem('dostop do podatkov in njihov popravek,'),
      listItem('izbris in omejitev obdelave,'),
      listItem('prenosljivost podatkov,'),
      listItem('preklic soglasja kadarkoli, brez vpliva na zakonitost obdelave pred preklicem.'),
    ]),
    section('Piškotki', 'piskotki', [
      linkedBlock(
        ['Izbiro lahko kadarkoli spremeniš v ', ['nastavitvah piškotkov', cookieMark], '.'],
        [{ _key: cookieMark, _type: 'link', kind: 'cookieSettings' }]
      ),
      table([
        ['Piškotek', 'Namen', 'Trajanje', 'Vrsta'],
        ['[b2p_consent]', 'Shrani tvojo izbiro piškotkov', '[12 mesecev]', 'Nujni'],
        ['[ime]', '[Analitika obiska]', '[trajanje]', 'Analitični'],
      ]),
    ]),
    section('Kontakt in pritožbe', 'kontakt', [
      block([
        'Za uveljavljanje pravic piši na [e-pošta]. Če meniš, da so bile tvoje pravice kršene, lahko vložiš pritožbo pri Informacijskem pooblaščencu Republike Slovenije.',
      ]),
    ]),
  ],
  seo: {
    title: 'Politika zasebnosti',
    description: 'Kako Build 2 Play zbira, uporablja in varuje tvoje osebne podatke.',
  },
};

export const notFoundPage = {
  _id: 'notFoundPage',
  _type: 'notFoundPage',
  eyebrow: 'Napaka 404',
  heading: 'Ta stran je izpustila trening.',
  text: 'Stran, ki jo iščeš, ne obstaja ali je bila premaknjena.',
  primaryCta: page('Na domačo stran', 'home'),
  secondaryCta: booking('Brezplačen posvet'),
  quickLinks: keyed([
    program('Programi', 'program-fitnes'),
    page('Cenik', 'pricing'),
    page('Nasveti', 'articles'),
    page('Kontakt', 'contact'),
  ]),
};

const privacyMark = key();

export const forms = {
  _id: 'forms',
  _type: 'forms',
  labels: {
    name: 'Ime in priimek',
    email: 'E-pošta',
    phone: 'Telefon',
    subject: 'Zadeva',
    program: 'Program',
    message: 'Sporočilo',
    goal: 'Kaj želiš doseči?',
    bookingMessage: 'Še kaj, kar naj vem?',
    optional: '(neobvezno)',
    requiredNote: 'Polja z * so obvezna.',
    consent: [
      linkedBlock(
        ['Strinjam se z obdelavo osebnih podatkov v skladu s ', ['politiko zasebnosti', privacyMark], '.'],
        [{ _key: privacyMark, _type: 'link', kind: 'page', page: 'privacy' }]
      ),
    ],
  },
  placeholders: {
    name: 'Janez Novak',
    email: 'janez@primer.si',
    phone: '041 123 456',
    program: 'Izberi program',
    message: 'Kako ti lahko pomagam?',
    goal: 'Npr. želim se pripraviti na novo sezono, imam 2 treninga na teden …',
    bookingMessage: 'Npr. poškodbe, izkušnje s treningom, šport …',
  },
  errors: {
    name: 'Vpiši ime in priimek.',
    emailEmpty: 'Vpiši e-poštni naslov.',
    emailInvalid: 'E-poštni naslov ni pravilen.',
    message: 'Napiši nekaj besed.',
    consent: 'Za pošiljanje potrebujem tvoje soglasje.',
    summary: 'Preveri označena polja.',
  },
  states: {
    sending: 'Pošiljam …',
    successTitle: 'Hvala, prejel sem.',
    successText: 'Odgovorim v {rok} na {poslano}. Kopija sporočila je na poti v tvoj e-poštni predal.',
    successTextHome: 'Odgovorim v {rok}. Medtem me lahko spremljaš na Instagramu.',
    sendAnother: 'Pošlji novo sporočilo',
    failure: 'Sporočila ni bilo mogoče poslati. Poskusi znova ali piši na {email}.',
    retry: 'Poskusi znova',
  },
  contact: {
    submit: 'Pošlji sporočilo',
    submitHome: 'Pošlji povpraševanje',
    subjects: [
      'Splošno vprašanje',
      'Fitnes in osebno trenerstvo',
      'Športno trenerstvo',
      'Online trenerstvo',
      'Sodelovanje / klub',
    ],
    programUnknown: 'Ne vem še',
  },
  booking: {
    title: 'Brezplačen posvet',
    stepLabel: 'korak {n} od {total}',
    next: 'Naprej',
    submit: 'Pošlji povpraševanje',
    step1: {
      title: 'Kaj želiš doseči?',
      subtitle: 'Izberi, kar je najbližje. Podrobnosti doreševa na posvetu.',
      goals: [
        'Več moči in boljša forma',
        'Priprava na šport ali sezono',
        'Izguba telesne mase in zdrav življenjski slog',
        'Vrnitev po poškodbi ali daljšem premoru',
        'Nekaj drugega',
      ],
      programLabel: 'Program, ki te zanima',
    },
    step2: {
      title: 'Kdaj ti ustreza?',
      subtitle: 'Na podlagi tega ti predlagam termin. Posvet traja {trajanje}.',
      modeLabel: 'Oblika posveta',
      modeLive: 'V živo',
      modeVideo: 'Video klic',
      locationLabel: 'Lokacija',
      anyLocation: 'Vseeno mi je',
      daysLabel: 'Dnevi, ki ti ustrezajo',
      timesLabel: 'Del dneva',
    },
    step3: { title: 'Kam ti pišem?', subtitle: 'Predlog termina pošljem v {rok}.' },
    success: {
      title: 'Hvala, prejel sem.',
      text: 'Potrdilo je na poti v tvoj e-poštni predal.',
      goalLabel: 'Cilj',
      modeLabel: 'Oblika',
      whenLabel: 'Termini',
      anytime: 'Kadarkoli',
      nextHeading: 'Kaj sledi',
      nextSteps: [
        'V {rok} ti pošljem predlog termina.',
        'Termin potrdiva po e-pošti ali telefonu.',
        'Spoznava se — brez obveznosti.',
      ],
      close: 'Nazaj na stran',
    },
    closeConfirm: {
      title: 'Zapreš obrazec?',
      text: 'Vneseni podatki se ne bodo shranili. Posvet lahko rezerviraš tudi kasneje.',
      stay: 'Nadaljuj',
      discard: 'Zapri',
    },
  },
};

export const cookieConsent = {
  _id: 'cookieConsent',
  _type: 'cookieConsent',
  banner: {
    title: 'Piškotki',
    text: 'Nujne piškotke uporabljamo za delovanje strani. Z tvojim dovoljenjem tudi analitične, da vemo, kaj izboljšati.',
    moreLabel: 'Več o piškotkih',
  },
  buttons: { settings: 'Nastavitve', rejectAll: 'Zavrni vse', acceptAll: 'Sprejmi vse', save: 'Shrani izbiro' },
  dialog: {
    title: 'Nastavitve piškotkov',
    intro:
      'Izberi, katere piškotke dovoliš. Izbiro lahko kadarkoli spremeniš prek povezave »Nastavitve piškotkov« v nogi strani.',
  },
  necessary: { title: 'Nujni', text: 'Potrebni za delovanje strani in obrazcev. Vedno vključeni.' },
  analytics: { title: 'Analitični', text: 'Anonimna statistika obiskov, da vemo, kaj izboljšati (Vercel Analytics).' },
};
