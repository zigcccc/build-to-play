'use client';

import type { ProgramKey } from '@b2p/shared';
import type { FormsCopy, LocationValue } from '@/sanity/queries/global';
import type { BookingProgram } from './booking-context';

export type BookingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProgram?: ProgramKey;
  copy: FormsCopy;
  programs: BookingProgram[];
  locations: Pick<LocationValue, '_id' | 'name'>[];
  socials: { instagram?: string };
};

// Implemented in the booking milestone.
export function BookingDialog(_props: BookingDialogProps) {
  return null;
}
