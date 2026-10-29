/**
 * Seeds the dataset with the design copy. Idempotent: fixed IDs + createOrReplace.
 * Run: pnpm --filter @b2p/studio seed   (add `-- --only=homePage,forms` to limit)
 */
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { getCliClient } from 'sanity/cli';
import { articles, categories } from './seed-articles';
import {
  aboutPage,
  articlesPage,
  comingSoonPage,
  contactPage,
  cookieConsent,
  forms,
  homePage,
  layout,
  locations,
  notFoundPage,
  person,
  pricingPage,
  privacyPage,
  programPage,
  siteSettings,
  testimonials,
} from './seed-pages';
import { faqs, programs } from './seed-programs';

const client = getCliClient({ apiVersion: '2026-10-29' });
const assetsDir = resolve(process.cwd(), '../../docs/handoff/assets');

async function uploadImage(file: string, filename: string) {
  const asset = await client.assets.upload('image', createReadStream(resolve(assetsDir, file)), { filename });
  return { _type: 'reference', _ref: asset._id };
}

async function main() {
  const only = process.argv
    .find((arg) => arg.startsWith('--only='))
    ?.slice(7)
    .split(',');

  const heroAsset = await uploadImage('images/hero-suspension-row.jpg', 'hero-suspension-row.jpg');
  const home = {
    ...homePage,
    hero: {
      ...homePage.hero,
      image: { _type: 'altImage', asset: heroAsset, alt: 'Trening z obročema TRX v temnem fitnesu' },
    },
  };

  const docs: { _id: string; _type: string }[] = [
    person,
    ...locations,
    ...testimonials,
    ...faqs,
    ...programs,
    ...categories,
    ...articles,
    siteSettings,
    layout,
    home,
    aboutPage,
    programPage,
    pricingPage,
    articlesPage,
    contactPage,
    privacyPage,
    notFoundPage,
    comingSoonPage,
    forms,
    cookieConsent,
  ].filter((doc) => !only || only.includes(doc._id) || only.includes(doc._type));

  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit({ visibility: 'async' });
  console.log(`Seeded ${docs.length} documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
