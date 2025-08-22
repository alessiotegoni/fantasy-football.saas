export const formatPlural = (
  count: number,
  { singular, plural }: { singular: string; plural: string },
  options?: { includeCount?: boolean }
) => {
  const word = count === 1 ? singular : plural;

  const { includeCount = true } = options ?? {};

  return includeCount ? `${count} ${word}` : word;
};
