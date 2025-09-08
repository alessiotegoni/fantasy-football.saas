export function getGoals(
  score: string,
  settings: { base: number; interval: number }
) {
  const { base, interval } = settings;

  const parsedScore = parseFloat(score);
  if (parsedScore < base) return 0;

  return Math.floor((parsedScore - base) / interval) + 1;
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
