// MapLibre's module worker must be served from our origin; bundlers can't resolve it.
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const dist = dirname(require.resolve('maplibre-gl/dist/maplibre-gl.mjs'));
const target = join(import.meta.dirname, '../public/vendor/maplibre');

mkdirSync(target, { recursive: true });
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'])
  copyFileSync(join(dist, file), join(target, file));
