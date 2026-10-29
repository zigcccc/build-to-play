'use client';

import { cn } from '@/lib/cn';
import type { LocationValue } from '@/sanity/queries/global';

type Props = {
  locations: LocationValue[];
  className?: string;
  copy: { text: string; button: string };
};

// Implemented in the consent/map milestone.
export function LocationsMap({ className }: Props) {
  return <div className={cn('ph border border-hairline', className)} />;
}
