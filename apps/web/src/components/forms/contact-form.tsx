'use client';

import type { FormsCopy } from '@/sanity/queries/global';

export type ContactFormProps = {
  variant: 'home' | 'contact';
  heading: string;
  copy: FormsCopy;
  programs: { key: string; label: string }[];
  email: string;
  consent: React.ReactNode;
};

// Implemented in the forms milestone.
export function ContactForm({ heading }: ContactFormProps) {
  return <h3 className="font-semibold text-[22px] leading-7">{heading}</h3>;
}
