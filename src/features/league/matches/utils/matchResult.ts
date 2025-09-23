import { GoalThresholdSettings } from "@/drizzle/schema";


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
