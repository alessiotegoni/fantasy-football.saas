import { db } from "@/drizzle/db";
import { leagueMatchdayCalculations } from "@/drizzle/schema";
import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import {
  getLastEndedMatchday,
  getLiveSplit,
} from "@/features/splits/queries/split";
import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { and, count, eq } from "drizzle-orm";

enum CALCULATE_ERRORS {
  REQUIRE_ADMIN = "Per calcolare le giornate devi essere un admin della lega",
  INVALID_SPLIT = "Puoi calcolare, ricalcolare o annullare solo le giornate dello split attuale",
  INVALID_MATCHDAY = "Puoi calcolare solo la giornata appena conclusa",
  MATCHDAY_NOT_CALCULABLE = "Puoi calcolare la giornata solo dopo la mezzanotte e mezza",
}

async function basePermissions(leagueId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const [isAdmin, liveSplit] = await Promise.all([
    getLeagueAdmin(userId, leagueId),
    getLiveSplit(),
  ]);

  if (!isAdmin) {
    return createError(CALCULATE_ERRORS.REQUIRE_ADMIN);
  }
  if (!liveSplit) {
    return createError(CALCULATE_ERRORS.INVALID_SPLIT);
  }

  return createSuccess("", { splitId: liveSplit.id });
}

export async function canCalculateMatchday(
  leagueId: string,
  matchdayId: number
) {
  const baseValidation = await basePermissions(leagueId);
  if (baseValidation.error) return baseValidation;

  const lastEndedMatchday = await getLastEndedMatchday(
    baseValidation.data.splitId
  );
  if (lastEndedMatchday?.id !== matchdayId) {
    return createError(CALCULATE_ERRORS.INVALID_MATCHDAY);
  }

  if (!isMatchdayCalculable(lastEndedMatchday)) {
    return createError(CALCULATE_ERRORS.MATCHDAY_NOT_CALCULABLE);
  }

  return createSuccess("", null)
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
