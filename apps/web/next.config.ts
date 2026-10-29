import { withBotId } from 'botid/next/config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  transpilePackages: ['@b2p/shared'],
  // Dev only: lets a phone on the local network load the dev scripts (otherwise the page never hydrates).
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '*.local'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default withBotId(nextConfig);
