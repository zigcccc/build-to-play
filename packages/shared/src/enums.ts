import { z } from 'zod';

export const socialPlatform = z.enum(['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin']);
export type SocialPlatform = z.infer<typeof socialPlatform>;

/** Lucide icon names selectable in the Studio. */
export const iconName = z.enum([
  'dumbbell',
  'trophy',
  'smartphone',
  'credit-card',
  'calendar',
  'clock',
  'receipt',
  'map-pin',
  'heart-pulse',
  'activity',
  'target',
  'users',
  'shield',
]);
export type IconName = z.infer<typeof iconName>;

export const inquiryKind = z.enum(['contact', 'booking']);
export type InquiryKind = z.infer<typeof inquiryKind>;

export const bookingMode = z.enum(['live', 'video']);
export const bookingDay = z.enum(['pon', 'tor', 'sre', 'cet', 'pet', 'sob']);
export const bookingTime = z.enum(['dopoldne', 'popoldne', 'zvecer']);

export const bookingDayLabel: Record<z.infer<typeof bookingDay>, string> = {
  pon: 'Pon',
  tor: 'Tor',
  sre: 'Sre',
  cet: 'Čet',
  pet: 'Pet',
  sob: 'Sob',
};

export const bookingTimeLabel: Record<z.infer<typeof bookingTime>, string> = {
  dopoldne: 'Dopoldne',
  popoldne: 'Popoldne',
  zvecer: 'Zvečer',
};

/** Fixed (singleton-backed) pages a CMS link can point to. */
export const pageKey = z.enum(['home', 'about', 'pricing', 'articles', 'contact', 'privacy']);
export type PageKey = z.infer<typeof pageKey>;

export const linkKind = z.enum([
  'page',
  'program',
  'article',
  'external',
  'booking',
  'cookieSettings',
  'phone',
  'email',
]);
export type LinkKind = z.infer<typeof linkKind>;
