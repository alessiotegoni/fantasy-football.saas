import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueCalculationsTag } from "../db/cache/calculate-matchday";
import { db } from "@/drizzle/db";
import { leagueMatchdayCalculations, splitMatchdays } from "@/drizzle/schema";
import { and, asc, eq } from "drizzle-orm";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";

export async function getCalculations(leagueId: string, splitId: number) {
  "use cache";
  cacheTag(getLeagueCalculationsTag(leagueId));

  const results = await db
    .select({
      id: leagueMatchdayCalculations.id,
      status: leagueMatchdayCalculations.status,
      calculatedAt: leagueMatchdayCalculations.calculatedAt,
      matchday: {
        id: splitMatchdays.id,
        number: splitMatchdays.number,
      },
    })
    .from(leagueMatchdayCalculations)
    .innerJoin(
      splitMatchdays,
      eq(splitMatchdays.id, leagueMatchdayCalculations.matchdayId)
    )
    .where(
      and(
        eq(splitMatchdays.splitId, splitId),
        eq(leagueMatchdayCalculations.leagueId, leagueId)
      )
    )
    .orderBy(asc(splitMatchdays.number));

  cacheTag(
    ...results.map((result) => getSplitMatchdaysIdTag(result.matchday.id))
  );

  return results;
}
