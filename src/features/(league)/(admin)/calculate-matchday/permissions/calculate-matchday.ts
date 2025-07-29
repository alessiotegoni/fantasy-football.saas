import { db } from "@/drizzle/db";
import { leagueMatchdayCalculations } from "@/drizzle/schema";
import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { and, count, eq } from "drizzle-orm";

enum CALCULATE_ERRORS {
  REQUIRE_ADMIN = "Per calcolare le giornate devi essere un admin della lega",
}

async function basePermissions(leagueId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  if (!(await getLeagueAdmin(userId, leagueId))) {
    return createError(CALCULATE_ERRORS.REQUIRE_ADMIN);
  }

  return createSuccess("", null);
}


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
