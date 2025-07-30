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
import { getBonusMalusesOptions } from "@/features/(league)/options/queries/leagueOptions";
import { getLineupsPlayers } from "@/features/(league)/matches/queries/match";
import { getPlayersMatchdayBonusMaluses } from "@/features/bonusMaluses/queries/bonusMalus";
import { enrichLineupPlayers } from "@/features/(league)/matches/utils/LineupPlayers";
import { leagueMatchResults } from "@/drizzle/schema";

enum CALCULATION_MESSAGES {
  CALCULATION_NOT_FOUND = "Calcolo della giornata non trovato",
  CALCULATION_ALREADY_CANCELED = "Calcolo della giornata gia annullato",
  MATCHDAY_ALREADY_CALCULATED = "La giornata e' gia stata calcolata",
  MATCHDAY_MATCHES_NOT_FOUND = "Nella tua lega in questa giornata non ci sono partite disponibili",
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

  const matchesResults = await calculateMatchesResults(data);
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

  const matches = await getLeagueMatchdayMatches(calculation);
  const matchesIds = matches.map((match) => match.id);

  await db.transaction(async (tx) => {
    await updateCalculation(calculation, "cancelled", tx);
    await deleteMatchesResults({ ...calculation, matchesIds }, tx);
  });

  return createSuccess(
    CALCULATION_MESSAGES.CANCULATION_CANCELLED_SUCCESFULLY,
    null
  );
}

async function calculateMatchesResults(data: CalculateMatchdaySchema) {
  const [{ bonusMalusOptions: leagueCustomBonusMalus }, matches] =
    await Promise.all([
      getBonusMalusesOptions(data.leagueId),
      getLeagueMatchdayMatches(data),
    ]);
  if (!matches.length) return;

  const matchesIds = matches.map((match) => match.id);
  const lineupsPlayers = await getLineupsPlayers(matchesIds, data.matchdayId);

  const playersIds = lineupsPlayers.map((player) => player.id);
  const playersBonusMaluses = await getPlayersMatchdayBonusMaluses({
    ...data,
    playersIds,
  });
  const players = enrichLineupPlayers({
    lineupsPlayers,
    playersBonusMaluses,
    leagueCustomBonusMalus,
  });

  const matchesResults: (typeof leagueMatchResults.$inferInsert)[] = [];

  for (const { id, homeTeamId, awayTeamId } of matches) {
    for (const teamId of [homeTeamId, awayTeamId]) {
      const teamPlayers = players.filter(
        (player) => player.leagueTeamId === teamId
      );
    }
  }

  return matchesResults;
}

async function getLeagueMatchdayMatches({
  leagueId,
  matchdayId,
}: {
  leagueId: string;
  matchdayId: number;
}) {
  return db.query.leagueMatches.findMany({
    where: (match, { and, eq }) =>
      and(
        eq(match.leagueId, leagueId),
        eq(match.splitMatchdayId, matchdayId),
        eq(match.isBye, false)
      ),
  });
}

async function getCalculation(id: string) {
  return db.query.leagueMatchdayCalculations.findFirst({
    where: (calculation, { eq }) => eq(calculation.id, id),
  });
}
