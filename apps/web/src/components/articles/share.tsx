'use client';

import { Check, Link2 } from 'lucide-react';
import { useState } from 'react';
import { SocialIcon } from '@/components/icons';

type Props = { url: string; label: string; copyLabel: string; copiedLabel: string };

const buttonClass =
  'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 border border-control px-3.5 font-medium text-ink text-sm hover:border-ink';

export function Share({ url, label, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="eyebrow text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button className={buttonClass} onClick={copy} type="button">
          {copied ? <Check aria-hidden size={18} /> : <Link2 aria-hidden size={18} />}
          <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
        </button>
        <a
          aria-label="Deli na Facebooku"
          className={buttonClass}
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          rel="noopener"
          target="_blank"
        >
          <SocialIcon platform="facebook" />
        </a>
      </div>
    </div>
  );
}
