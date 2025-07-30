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
import { insertCalculation, updateCalculation } from "../db/calculate-matchday";
import {
  deleteMatchesResults,
  insertMatchesResults,
} from "@/features/(league)/matches/db/matchResult";
import { getBonusMalusesOptions } from "@/features/(league)/options/queries/leagueOptions";
import { getLineupsPlayers } from "@/features/(league)/matches/queries/match";
import { getPlayersMatchdayBonusMaluses } from "@/features/bonusMaluses/queries/bonusMalus";
import {
  calculateLineupTotalVote,
  enrichLineupPlayers,
} from "@/features/(league)/matches/utils/LineupPlayers";
import { leagueMatchResults, TacticalModule } from "@/drizzle/schema";

enum CALCULATION_MESSAGES {
  CALCULATION_NOT_FOUND = "Calcolo della giornata non trovato",
  CALCULATION_ALREADY_CANCELED = "Calcolo della giornata gia annullato",
  MATCHDAY_ALREADY_CALCULATED = "La giornata e' gia stata calcolata",
  MATCHDAY_CALCULATED_SUCCESFULLY = "Giornata calcolata con successo!",
  CANCULATION_CANCELLED_SUCCESFULLY = "Giornata cancellata con successo!",
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

  await db.transaction(async (tx) => {
    await insertCalculation({ ...data, status: "calculated" }, tx);
    if (matchesResults.length) {
      await insertMatchesResults(data.leagueId, matchesResults, tx);
    }
  });

  return createSuccess(
    CALCULATION_MESSAGES.MATCHDAY_CALCULATED_SUCCESFULLY,
    null
  );
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

  const matchesIds = matches.map((match) => match.id);
  const teamsIds = getMatchesTeamsIds(matches);

  const [lineupsPlayers, teamsTacticalModules] = await Promise.all([
    getLineupsPlayers(matchesIds, data.matchdayId),
    getMatchesTeamsTacticalModules(matchesIds, teamsIds),
  ]);

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

  for (const { id: matchId, homeTeamId, awayTeamId } of matches) {
    const matchPlayers = players.filter(
      (player) =>
        player.leagueTeamId === homeTeamId || player.leagueTeamId === awayTeamId
    );

    const homeTacticalModule = getTeamTacticalModule(
      teamsTacticalModules,
      matchId,
      homeTeamId
    );
    const awayTacticalModule = getTeamTacticalModule(
      teamsTacticalModules,
      matchId,
      awayTeamId
    );

    const totalVotes = calculateLineupTotalVote(matchPlayers, {
      homeTeam: { id: homeTeamId, tacticalModule: homeTacticalModule },
      awayTeam: { id: awayTeamId, tacticalModule: awayTacticalModule },
    });

    if (!totalVotes) continue;

    const teams = [
      { type: "home", teamId: homeTeamId },
      { type: "away", teamId: awayTeamId },
    ] as const;

    for (const { type, teamId } of teams) {
      const totalScore = totalVotes[type];

      if (!teamId || !totalScore) continue;

      const matchResult = {
        leagueMatchId: matchId,
        teamId,
        totalScore,
        points: 0,
        goals: 0,
      };

      matchesResults.push(matchResult);
    }
  }

  return matchesResults;
}

function getTeamTacticalModule(
  teamsTacticalModules: {
    teamId: string;
    matchId: string;
    tacticalModule: TacticalModule;
  }[],
  matchId: string,
  teamId: string | null
) {
  const teamTacticalModule = teamsTacticalModules.find(
    (tacticalModule) =>
      tacticalModule.matchId === matchId && tacticalModule.teamId === teamId
  );

  return teamTacticalModule?.tacticalModule ?? null;
}

function getMatchesTeamsIds(
  matches: {
    leagueId: string;
    id: string;
    splitMatchdayId: number;
    homeTeamId: string | null;
    awayTeamId: string | null;
    isBye: boolean;
  }[]
) {
  const matchesTeamsIds = new Set(
    matches.flatMap((match) =>
      [match.homeTeamId, match.awayTeamId].filter((teamId) => teamId !== null)
    )
  );

  return Array.from(matchesTeamsIds);
}

async function getMatchesTeamsTacticalModules(
  matchesIds: string[],
  teamsIds: string[]
) {
  const results = await db.query.leagueMatchTeamLineup.findMany({
    columns: {
      matchId: true,
      teamId: true,
    },
    with: {
      tacticalModule: true,
    },
    where: (matchLineup, { and, inArray }) =>
      and(
        inArray(matchLineup.id, matchesIds),
        inArray(matchLineup.teamId, teamsIds)
      ),
  });

  return results;
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
