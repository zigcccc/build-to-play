/**
 * Seeds the dataset with the design copy, using fixed IDs. By default it only creates documents that don't exist yet,
 * so it never touches content edited in the Studio. `--force` overwrites (createOrReplace): use it with `--only=`.
 * Run: pnpm --filter @b2p/studio seed   (add `-- --only=homePage,forms` to limit, `-- --force` to overwrite)
 */
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { getCliClient } from 'sanity/cli';
import { articles, categories } from './seed-articles';
import {
  aboutPage,
  aiSummary,
  articlesPage,
  comingSoonPage,
  contactPage,
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
  const force = process.argv.includes('--force');
  const wanted = (doc: { _id: string; _type: string }) => !only || only.includes(doc._id) || only.includes(doc._type);

  // The hero image is uploaded only when the home page is actually going to be written.
  const writeHome = wanted(homePage) && (force || !(await client.getDocument(homePage._id)));
  const home = writeHome
    ? {
        ...homePage,
        hero: {
          ...homePage.hero,
          image: {
            _type: 'altImage',
            asset: await uploadImage('images/hero-suspension-row.jpg', 'hero-suspension-row.jpg'),
            alt: 'Trening z obročema TRX v temnem fitnesu',
          },
        },
      }
    : homePage;

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
    aiSummary,
  ].filter(wanted);

  const tx = client.transaction();
  for (const doc of docs) force ? tx.createOrReplace(doc) : tx.createIfNotExists(doc);
  await tx.commit({ visibility: 'async' });
  console.log(`${force ? 'Wrote' : 'Created missing of'} ${docs.length} documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
