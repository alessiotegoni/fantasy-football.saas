export function formatPlural(
  count: number,
  { singular, plural }: { singular: string; plural: string },
  options?: { includeCount?: boolean }
) {
  const word = count === 1 ? singular : plural;

  const { includeCount = true } = options ?? {};

  return includeCount ? `${count} ${word}` : word;
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
) {
  const formatter = new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });

  date = date instanceof Date ? date : new Date(date);

  return formatter.format(date);
}

// d
