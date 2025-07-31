export function getGoals(
  score: number,
  settings: { base: number; interval: number }
) {
  const { base, interval } = settings;
  if (score < base) return 0;
  return Math.floor((score - base) / interval) + 1;
}
