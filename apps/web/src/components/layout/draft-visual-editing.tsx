'use client';

import { useRouter } from 'next/navigation';
import { VisualEditing } from 'next-sanity/visual-editing/client-component';
import { startTransition } from 'react';

/**
 * Click-to-edit overlays for the Presentation tool. Draft mode bypasses the 'use cache'
 * layer, so re-rendering the route is enough to show every Studio edit live (no publish needed).
 */
export function DraftVisualEditing() {
  const router = useRouter();
  return (
    <VisualEditing
      refresh={() =>
        new Promise<void>((resolve) => {
          startTransition(() => {
            router.refresh();
            resolve();
          });
        })
      }
    />
  );
}
