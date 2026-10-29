import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { plain } from '@/lib/metadata';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

// Barlow Condensed 700 (OFL), latin + latin-ext so č/š/ž render.
const fontDir = join(process.cwd(), 'assets/fonts');

const fonts = () =>
  Promise.all(
    ['latin', 'latin-ext'].map(async (subset) => ({
      // Distinct names: Satori only falls back across differently named fonts.
      name: subset === 'latin' ? 'Barlow' : 'BarlowExt',
      data: await readFile(join(fontDir, `barlow-condensed-${subset}-700-normal.woff`)),
      weight: 700 as const,
      style: 'normal' as const,
    }))
  );

/** Brand share card: black ground, outlined gold "2", eyebrow + uppercase title + tagline. */
export async function renderOg({ eyebrow, title, tagline }: { eyebrow: string; title: string; tagline: string }) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 72,
        background: '#040506',
        color: '#ffffff',
        fontFamily: 'Barlow, BarlowExt',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -40,
          top: -120,
          fontSize: 900,
          lineHeight: 1,
          // Satori has no text-stroke; a faint gold fill stands in for the outlined "2".
          color: 'rgba(179,154,114,0.12)',
        }}
      >
        2
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, letterSpacing: 6, color: '#b39a72' }}>
        <div style={{ width: 14, height: 14, background: '#b39a72' }} />
        {plain(eyebrow).toUpperCase()}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 20,
          fontSize: 104,
          lineHeight: 0.92,
          textTransform: 'uppercase',
          maxWidth: 980,
        }}
      >
        {plain(title)}
      </div>
      <div style={{ display: 'flex', marginTop: 40, fontSize: 28, letterSpacing: 8, color: '#8f8c86' }}>
        BUILD<span style={{ color: '#b39a72' }}>2</span>PLAY · {plain(tagline).toUpperCase()}
      </div>
    </div>,
    { ...ogSize, fonts: await fonts() }
  );
}
