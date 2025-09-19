type Rounding = "up" | "down";

export function formatVoteValue(
  value: number | string | null | undefined,
  rounding: Rounding = "up"
): string {
  if (value === null || value === undefined) return "-";

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "-";

  const calculation =
    rounding === "up"
      ? Math.ceil(num * 2) / 2
      : Math.floor(num * 2) / 2;

  return String(calculation);
}
