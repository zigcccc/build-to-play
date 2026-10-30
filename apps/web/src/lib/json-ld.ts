import type { Graph, PostalAddress, Thing } from 'schema-dts';
import type { Crumb } from '@/components/ui/breadcrumbs';
import { siteUrl } from '@/env/client';
import { routes } from '@/lib/routes';
import { urlFor } from '@/sanity/image';
import type { GlobalData } from '@/sanity/queries/global';

export const ids = {
  website: `${siteUrl}/#website`,
  business: `${siteUrl}/#business`,
  trainer: `${siteUrl}/#trainer`,
  location: (id: string) => `${siteUrl}/#location-${id}`,
  page: (path: string) => `${siteUrl}${path}#webpage`,
};

export const absolute = (path: string) => (path.startsWith('http') ? path : `${siteUrl}${path}`);

export const graph = (...nodes: Thing[]): Graph => ({ '@context': 'https://schema.org', '@graph': nodes });

const postalAddress = (streetAddress: string, postalCode?: string, addressLocality?: string): PostalAddress => ({
  '@type': 'PostalAddress',
  streetAddress,
  postalCode,
  addressLocality,
  addressCountry: 'SI',
});

/** Site-wide entities every page references by @id: website, business, trainer and locations. */
export function siteGraph({ settings, locations }: Pick<GlobalData, 'settings' | 'locations'>): Graph {
  const trainer = settings.trainer;
  const sameAs = settings.socials.map((s) => s.url);
  return graph(
    {
      '@type': 'WebSite',
      '@id': ids.website,
      url: siteUrl,
      name: settings.siteName,
      inLanguage: 'sl-SI',
      publisher: { '@id': ids.business },
    },
    {
      '@type': 'LocalBusiness',
      '@id': ids.business,
      name: settings.siteName,
      legalName: settings.companyName,
      slogan: settings.tagline,
      description: settings.description,
      url: siteUrl,
      logo: absolute('/icons/icon-512.png'),
      image: absolute('/icons/icon-512.png'),
      email: settings.email,
      telephone: settings.phone.e164,
      priceRange: settings.priceRange ?? undefined,
      areaServed: settings.areaServed,
      vatID: settings.vatId ?? undefined,
      // The registered address when set, else the first training location (Google expects one on a LocalBusiness).
      address: settings.companyAddress
        ? postalAddress(settings.companyAddress)
        : locations[0] && postalAddress(locations[0].street, locations[0].postalCode, locations[0].city),
      identifier: settings.registrationNumber
        ? { '@type': 'PropertyValue', propertyID: 'Matična številka', value: settings.registrationNumber }
        : undefined,
      founder: { '@id': ids.trainer },
      employee: { '@id': ids.trainer },
      sameAs,
      location: locations.map((l) => ({ '@id': ids.location(l._id) })),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: settings.email,
        telephone: settings.phone.e164,
        availableLanguage: ['sl'],
      },
    },
    {
      '@type': 'Person',
      '@id': ids.trainer,
      name: trainer.name,
      jobTitle: trainer.jobTitle,
      description: trainer.bio,
      knowsAbout: trainer.knowsAbout ?? undefined,
      image: trainer.avatar ? urlFor(trainer.avatar).width(800).url() : undefined,
      worksFor: { '@id': ids.business },
      url: absolute(routes.about),
      sameAs: [...(trainer.sameAs ?? []), ...sameAs],
    },
    ...locations.map(
      (l): Thing => ({
        '@type': 'SportsActivityLocation',
        '@id': ids.location(l._id),
        name: l.name,
        parentOrganization: { '@id': ids.business },
        address: postalAddress(l.street, l.postalCode, l.city),
        geo:
          l.geo?.lat && l.geo.lng
            ? { '@type': 'GeoCoordinates', latitude: l.geo.lat, longitude: l.geo.lng }
            : undefined,
        hasMap: l.mapsUrl,
      })
    )
  );
}

/** The visible breadcrumb trail as JSON-LD; a crumb without a link is the current page. */
export function breadcrumbs(crumbs: Crumb[], currentPath: string): Thing {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absolute(crumb.href ?? currentPath),
    })),
  };
}

export function webPage(path: string, name: string, description: string, extra: Record<string, unknown> = {}): Thing {
  return {
    '@type': 'WebPage',
    '@id': ids.page(path),
    url: absolute(path),
    name,
    description,
    inLanguage: 'sl-SI',
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.business },
    ...extra,
  } as Thing;
}

export function faqPage(faqs: { question: string; answerText: string }[]): Thing {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answerText },
    })),
  };
}
