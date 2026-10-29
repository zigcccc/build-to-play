const euro = new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });

/** CMS prices: an explicit label wins (e.g. "Po dogovoru"), otherwise the formatted amount. */
export function formatPrice(value: {
  label?: string | null;
  priceLabel?: string | null;
  amount?: number | null;
  price?: number | null;
}) {
  const label = value.label ?? value.priceLabel;
  if (label) return label;
  const amount = value.amount ?? value.price;
  return amount === null || amount === undefined ? '' : euro.format(amount).replace(/,00(?=\s)/, '');
}
