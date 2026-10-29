'use client';

import type { ProgramKey } from '@b2p/shared';
import type { ComponentProps } from 'react';
import { useBooking } from './booking-context';

type Props = Omit<ComponentProps<'button'>, 'onClick' | 'type'> & { program?: ProgramKey };

/** Any "Brezplačen posvet" CTA: opens the booking overlay, optionally preselecting a program. */
export function BookingTrigger({ program, ...props }: Props) {
  const { open } = useBooking();
  return <button {...props} onClick={() => open(program)} type="button" />;
}
