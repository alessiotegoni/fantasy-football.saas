export function getGoals(
  score: number,
  settings: { base: number; interval: number }
) {
  const { base, interval } = settings;

  if (score < base) return 0;

  return Math.floor((score - base) / interval) + 1;
}

export function getPoints(homeGoals: number, awayGoals: number) {
  if (homeGoals > awayGoals) {
    return { homePoints: 3, awayPoints: -3 };
  } else if (awayGoals > homeGoals) {
    return { homePoints: -3, awayPoints: 3 };
  } else {
    return { homePoints: 1, awayPoints: 1 };
  }
}
