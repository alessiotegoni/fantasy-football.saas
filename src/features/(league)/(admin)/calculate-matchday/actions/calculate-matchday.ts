"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import {
  calculateMatchdaySchema,
  CalculateMatchdaySchema,
  recalculateMatchdaySchema,
  RecalculateMatchdaySchema,
} from "../schema/calculate-matchday";
import {
  basePermissions,
  canCalculateMatchday,
} from "../permissions/calculate-matchday";
import { createError, createSuccess } from "@/lib/helpers";
import { db } from "@/drizzle/db";
import { updateCalculation } from "../db/calculate-matchday";
import { deleteMatchesResults } from "@/features/(league)/matches/db/matchResult";

enum CALCULATION_MESSAGES {
  CALCULATION_NOT_FOUND = "Calcolo della giornata non trovato",
  CALCULATION_ALREADY_CANCELED = "Calcolo della giornata gia annullato",
  MATCHDAY_ALREADY_CALCULATED = "La giornata e' gia stata calcolata",
  CANCULATION_CANCELLED_SUCCESFULLY = "Giornata cancellata con successo",
}

export async function calculateMatchday(values: CalculateMatchdaySchema) {
  const { isValid, data, error } = validateSchema<CalculateMatchdaySchema>(
    calculateMatchdaySchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canCalculateMatchday(data);
  if (permissions.error) return permissions;

  const [] = await Promise.all([getLeague])

}

export async function recalculateMatchday(
  calculationId: string,
  values: CalculateMatchdaySchema
) {
  const { isValid, data, error } = validateSchema<RecalculateMatchdaySchema>(
    recalculateMatchdaySchema,
    { calculationId, ...values }
  );
  if (!isValid) return error;
}

export async function cancelCalculation(id: string) {
  const {
    isValid,
    data: calculationId,
    error,
  } = validateSchema<string>(getUUIdSchema(), id);
  if (!isValid) return error;

  const calculation = await getCalculation(calculationId);
  if (!calculation) {
    return createError(CALCULATION_MESSAGES.CALCULATION_NOT_FOUND);
  }
  if (calculation.status !== "calculated") {
    return createError(CALCULATION_MESSAGES.CALCULATION_ALREADY_CANCELED);
  }

  const baseValidation = await basePermissions(calculation.leagueId);
  if (baseValidation.error) return baseValidation;

  const matchesIds = await getLeagueMatchesIds(calculation);

  await db.transaction(async (tx) => {
    await updateCalculation(calculation, "cancelled", tx);
    await deleteMatchesResults({ ...calculation, matchesIds }, tx);
  });

  return createSuccess(
    CALCULATION_MESSAGES.CANCULATION_CANCELLED_SUCCESFULLY,
    null
  );
}

async function getLeagueMatchesIds({
  leagueId,
  matchdayId,
}: {
  leagueId: string;
  matchdayId: number;
}) {
  const matches = await db.query.leagueMatches.findMany({
    columns: {
      id: true,
    },
    where: (match, { and, eq }) =>
      and(eq(match.leagueId, leagueId), eq(match.splitMatchdayId, matchdayId)),
  });

  return matches.map((match) => match.id);
}

async function getCalculation(id: string) {
  return db.query.leagueMatchdayCalculations.findFirst({
    where: (calculation, { eq }) => eq(calculation.id, id),
  });
}
