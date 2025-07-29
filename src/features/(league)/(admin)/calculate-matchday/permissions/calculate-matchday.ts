import { db } from "@/drizzle/db";
import { leagueMatchdayCalculations } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";

export async function isAlreadyCalculated(
  leagueId: string,
  matchdayId: number
) {
  const [res] = await db
    .select({ count: count() })
    .from(leagueMatchdayCalculations)
    .where(
      and(
        eq(leagueMatchdayCalculations.leagueId, leagueId),
        eq(leagueMatchdayCalculations.matchdayId, matchdayId),
        eq(leagueMatchdayCalculations.status, "calculated")
      )
    );

  return res.count > 0;
}
