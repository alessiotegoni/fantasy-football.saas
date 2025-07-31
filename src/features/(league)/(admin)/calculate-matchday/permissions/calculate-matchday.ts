import { db } from "@/drizzle/db";
import { leagueMatchdayCalculations } from "@/drizzle/schema";
import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import {
  getLastEndedMatchday,
  getLiveSplit,
  getSplitMatchdays,
} from "@/features/splits/queries/split";
import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { and, count, eq } from "drizzle-orm";
import { isMatchdayCalculable } from "../utils/calculate-matchday";
import { hasGeneratedCalendar } from "../../calendar/permissions/calendar";

enum CALCULATE_ERRORS {
  REQUIRE_ADMIN = "Per calcolare le giornate devi essere un admin della lega",
  INVALID_SPLIT = "Puoi calcolare, ricalcolare o annullare solo le giornate dello split attuale",
  INVALID_MATCHDAY = "Puoi calcolare solo la giornata appena conclusa",
  INVALID_SPLIT_MATCHDAY = "La giornata non fa parte dello split attuale",
  MATCHDAY_NOT_CALCULABLE = "Puoi calcolare la giornata solo dopo la mezzanotte e mezza",
  MATCHDAY_ALREADY_CALCULATED = "La giornata e' gia stata calcolata",
  CALCULATION_NOT_FOUND = "Calcolo della giornata non trovato",
  CALENDAR_NOT_GENERATED = "Non puoi calcolare/annullare le giornate senza aver prima generato un calendario",
}

export async function basePermissions({
  leagueId,
  matchdayId,
  calculationId,
}: {
  leagueId: string;
  matchdayId: number;
  calculationId?: string;
}) {
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

  const [splitMatchdays, isCalendarGenerated] = await Promise.all([
    getSplitMatchdays(liveSplit.id),
    hasGeneratedCalendar(leagueId, liveSplit.id),
  ]);

  if (!isCalendarGenerated) {
    return createError(CALCULATE_ERRORS.CALENDAR_NOT_GENERATED);
  }

  const isValidMatchday = splitMatchdays.some(
    (matchday) => matchday.id === matchdayId
  );
  if (!isValidMatchday) {
    return createError(CALCULATE_ERRORS.INVALID_SPLIT_MATCHDAY);
  }

  const data: {
    splitId: number;
    calculation: {
      id: string;
      status: "calculated" | "cancelled";
      leagueId: string;
      matchdayId: number;
      calculatedAt: Date;
    } | null;
  } = { splitId: liveSplit.id, calculation: null };

  if (calculationId) {
    const calculation = await getCalculation(calculationId);
    if (!calculation) {
      return createError(CALCULATE_ERRORS.CALCULATION_NOT_FOUND);
    }

    data.calculation = calculation;
  }

  return createSuccess("", data);
}

export async function canCalculateMatchday({
  leagueId,
  matchdayId,
}: {
  leagueId: string;
  matchdayId: number;
}) {
  const baseValidation = await basePermissions({ leagueId, matchdayId });
  if (baseValidation.error) return baseValidation;

  const [lastEndedMatchday, isMatchdayCalculated] = await Promise.all([
    getLastEndedMatchday(baseValidation.data.splitId),
    isAlreadyCalculated(leagueId, matchdayId),
  ]);

  if (isMatchdayCalculated) {
    return createError(CALCULATE_ERRORS.MATCHDAY_ALREADY_CALCULATED);
  }

  if (lastEndedMatchday?.id !== matchdayId) {
    return createError(CALCULATE_ERRORS.INVALID_MATCHDAY);
  }

  if (!isMatchdayCalculable(lastEndedMatchday)) {
    return createError(CALCULATE_ERRORS.MATCHDAY_NOT_CALCULABLE);
  }

  return createSuccess("", null);
}

async function isAlreadyCalculated(leagueId: string, matchdayId: number) {
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

async function getCalculation(id: string) {
  return db.query.leagueMatchdayCalculations.findFirst({
    where: (calculation, { eq }) => eq(calculation.id, id),
  });
}
