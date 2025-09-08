"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import {
  calculateMatchdaySchema,
  CalculateMatchdaySchema,
  cancelCalculationSchema,
  CancelCalculationSchema,
  recalculateMatchdaySchema,
  RecalculateMatchdaySchema,
} from "../schema/calculate-matchday";
import {
  basePermissions,
  canCalculateMatchday,
} from "../permissions/calculate-matchday";
import { createError, createSuccess } from "@/utils/helpers";
import { db } from "@/drizzle/db";
import { insertCalculation, updateCalculation } from "../db/calculate-matchday";
import {
  deleteMatchesResults,
  insertMatchesResults,
} from "@/features/league/matches/db/matchResult";
import {
  getBonusMalusesSettings,
  getCalculationSettings,
} from "@/features/league/settings/queries/setting";
import { getLineupsPlayers } from "@/features/league/matches/queries/match";
import { getPlayersMatchdayBonusMaluses } from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalus";
import { enrichLineupPlayers } from "@/features/league/matches/utils/LineupPlayers";
import { leagueMatchResults, TacticalModule } from "@/drizzle/schema";
import {
  getGoals,
  getPoints,
} from "@/features/league/matches/utils/matchResult";
import { calculateLineupsTotalVote } from "@/features/league/matches/utils/Lineup";

enum CALCULATION_MESSAGES {
  CALCULATION_ALREADY_CANCELED = "Calcolo della giornata gia annullato",
  MATCHDAY_ALREADY_CALCULATED = "La giornata e' gia stata calcolata",
  MATCHDAY_CALCULATED_SUCCESFULLY = "Giornata calcolata con successo!",
  MATCHDAY_RECALCULATED_SUCCESFULLY = "Giornata ricalcolata con successo!",
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

  const baseValidation = await basePermissions(data);
  if (baseValidation.error) return baseValidation;

  const { calculation } = baseValidation.data;

  if (calculation!.status === "calculated") {
    return createError(CALCULATION_MESSAGES.MATCHDAY_ALREADY_CALCULATED);
  }

  const matchesResults = await calculateMatchesResults(data);

  await db.transaction(async (tx) => {
    await updateCalculation(
      calculation!,
      { status: "calculated", calculatedAt: new Date() },
      tx
    );
    if (matchesResults.length) {
      await insertMatchesResults(data.leagueId, matchesResults, tx);
    }
  });

  return createSuccess(
    CALCULATION_MESSAGES.MATCHDAY_RECALCULATED_SUCCESFULLY,
    null
  );
}

export async function cancelCalculation(values: CancelCalculationSchema) {
  const { isValid, data, error } = validateSchema<CancelCalculationSchema>(
    cancelCalculationSchema,
    values
  );
  if (!isValid) return error;

  const baseValidation = await basePermissions(data);
  if (baseValidation.error) return baseValidation;

  const { calculation } = baseValidation.data;

  if (calculation!.status === "cancelled") {
    return createError(CALCULATION_MESSAGES.CALCULATION_ALREADY_CANCELED);
  }

  const matches = await getLeagueMatchdayMatches(calculation!);
  const matchesIds = matches.map((match) => match.id);

  await db.transaction(async (tx) => {
    await updateCalculation(calculation!, { status: "cancelled" }, tx);
    await deleteMatchesResults({ ...calculation!, matchesIds }, tx);
  });

  return createSuccess(
    CALCULATION_MESSAGES.CANCULATION_CANCELLED_SUCCESFULLY,
    null
  );
}

async function calculateMatchesResults(data: CalculateMatchdaySchema) {
  const [
    { bonusMalusSettings: leagueCustomBonusMalus },
    { goalThresholdSettings },
    matches,
  ] = await Promise.all([
    getBonusMalusesSettings(data.leagueId),
    getCalculationSettings(data.leagueId),
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

    const totalVotes = calculateLineupsTotalVote(matchPlayers, {
      homeTeam: { id: homeTeamId, tacticalModule: homeTacticalModule },
      awayTeam: { id: awayTeamId, tacticalModule: awayTacticalModule },
    });

    if (!totalVotes) continue;

    const homeGoals = totalVotes.home
      ? getGoals(totalVotes.home, goalThresholdSettings)
      : 0;
    const awayGoals = totalVotes.away
      ? getGoals(totalVotes.away, goalThresholdSettings)
      : 0;
    const { homePoints, awayPoints } = getPoints(homeGoals, awayGoals);

    if (homeTeamId && totalVotes.home) {
      matchesResults.push({
        leagueMatchId: matchId,
        teamId: homeTeamId,
        totalScore: totalVotes.home,
        points: homePoints,
        goals: homeGoals,
      });
    }

    if (awayTeamId && totalVotes.away) {
      matchesResults.push({
        leagueMatchId: matchId,
        teamId: awayTeamId,
        totalScore: totalVotes.away,
        points: awayPoints,
        goals: awayGoals,
      });
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
