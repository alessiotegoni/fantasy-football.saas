export function formatVoteValue(
  value: number | string | null | undefined
): string {
  if (value === null || value === undefined) return "-";

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "-";

  const formatted = Math.ceil(num * 2) / 2;
  return String(formatted);
}
