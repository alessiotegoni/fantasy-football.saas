import { GoalThresholdSettings } from "@/drizzle/schema";

const WALKOVER_GOALS = 3;

export function getGoals(
  {
    homeScore,
    awayScore,
  }: { homeScore: number | null; awayScore: number | null },
  settings: GoalThresholdSettings
) {
  if (homeScore === null && awayScore === null) return null;

  if (homeScore === null) {
    return { homeGoals: 0, awayGoals: WALKOVER_GOALS };
  }

  if (awayScore === null) {
    return { homeGoals: WALKOVER_GOALS, awayGoals: 0 };
  }

  const homeGoals = calculateGoals(homeScore, settings);
  const awayGoals = calculateGoals(awayScore, settings);

  return { homeGoals, awayGoals };
}

function calculateGoals(
  score: number,
  { base, interval }: GoalThresholdSettings
): number {
  if (score < base) return 0;

  return Math.floor((score - base) / interval) + 1;
}

export function getPoints({
  homeGoals,
  awayGoals,
}: NonNullable<ReturnType<typeof getGoals>>) {
  if (homeGoals > awayGoals) {
    return { homePoints: 3, awayPoints: -3 };
  } else if (awayGoals > homeGoals) {
    return { homePoints: -3, awayPoints: 3 };
  } else {
    return { homePoints: 1, awayPoints: 1 };
  }
}
