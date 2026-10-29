const euro = new Intl.NumberFormat('sl-SI', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
  trailingZeroDisplay: 'stripIfInteger',
});

/** CMS prices: an explicit label wins (e.g. "Po dogovoru"), otherwise the formatted amount. */
export function formatPrice({ label, amount }: { label?: string | null; amount?: number | null }) {
  if (label) return label;
  return amount === null || amount === undefined ? '' : euro.format(amount);
}
