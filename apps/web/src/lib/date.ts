const formatter = new Intl.DateTimeFormat('sl-SI', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Ljubljana',
});

export const formatDate = (iso: string) => formatter.format(new Date(iso));
