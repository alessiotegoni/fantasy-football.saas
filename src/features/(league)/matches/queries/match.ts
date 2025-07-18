import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getMatchBenchsLineupTag,
  getMatchStartersLineupTag,
} from "../db/cache/match";
import { db } from "@/drizzle/db";
import {
  bonusMalusTypes,
  leagueMatches,
  leagueMatchLineupPlayers,
  leagueMatchTeamLineup,
  LineupPlayerType,
  matchdayBonusMalus,
  matchdayVotes,
  playerRoles,
  players,
  teams,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import {
  formatTeamData,
  getLineupsPlayersTags,
  getMatchInfoTags,
} from "../utils/match";

export async function getMatchInfo({
  leagueId,
  matchId,
}: {
  leagueId: string;
  matchId: string;
}) {
  "use cache";

  const result = await db.query.leagueMatches.findFirst({
    columns: {
      id: true,
      isBye: true,
      homeTeamId: true,
      awayTeamId: true,
    },
    with: {
      league: {
        columns: {},
        with: {
          options: {
            columns: {
              customBonusMalus: true,
            },
          },
        },
      },
      splitMatchday: true,
      homeTeam: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
      awayTeam: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
      lineups: {
        columns: {
          id: true,
          teamId: true,
        },
        with: {
          tacticalModule: true,
        },
      },
      matchResults: {
        columns: {
          teamId: true,
          goals: true,
          totalScore: true,
        },
      },
    },
    where: (match, { and, eq }) =>
      and(eq(match.leagueId, leagueId), eq(match.id, matchId)),
  });

  if (!result) return undefined;

  cacheTag(
    ...getMatchInfoTags({
      leagueId,
      matchId,
      ...result,
    })
  );

  const {
    homeTeamId,
    homeTeam,
    awayTeamId,
    awayTeam,
    lineups,
    league,
    ...match
  } = result;

  return {
    homeTeam: formatTeamData(homeTeamId, homeTeam, lineups),
    awayTeam: formatTeamData(awayTeamId, awayTeam, lineups),
    leagueCustomBonusMalus: league.options[0].customBonusMalus,
    ...match,
  };
}

export type MatchInfo = NonNullable<Awaited<ReturnType<typeof getMatchInfo>>>;

export async function getStarterLineups(
  matchId: string,
  currentMatchdayId: number
) {
  "use cache";

  const players = await getLineupPlayers(matchId, currentMatchdayId, "starter");

  cacheTag(
    getMatchStartersLineupTag(matchId),
    ...getLineupsPlayersTags({
      currentMatchdayId,
      players,
    })
  );

  return players;
}

export async function getBenchLineups(
  matchId: string,
  currentMatchdayId: number
) {
  "use cache";

  const players = await getLineupPlayers(matchId, currentMatchdayId, "bench");

  cacheTag(
    getMatchBenchsLineupTag(matchId),
    ...getLineupsPlayersTags({
      currentMatchdayId,
      players,
    })
  );

  return players;
}

async function getLineupPlayers(
  matchId: string,
  currentMatchdayId: number,
  lineupType: LineupPlayerType
) {
  const results = await db
    .select({
      id: players.id,
      lineupPlayerId: leagueMatchLineupPlayers.id,
      displayName: players.displayName,
      avatarUrl: players.avatarUrl,
      role: playerRoles,
      team: teams,
      leagueTeamId: leagueMatchTeamLineup.teamId,
      positionId: leagueMatchLineupPlayers.positionId,
      positionOrder: leagueMatchLineupPlayers.positionOrder,
      vote: matchdayVotes.vote,
      bonusMaluses: {
        id: matchdayBonusMalus.bonusMalusTypeId,
        count: matchdayBonusMalus.count,
        imageUrl: bonusMalusTypes.imageUrl,
      },
    })
    .from(leagueMatchLineupPlayers)
    .innerJoin(
      leagueMatchTeamLineup,
      eq(leagueMatchTeamLineup.id, leagueMatchLineupPlayers.lineupId)
    )
    .innerJoin(
      leagueMatches,
      eq(leagueMatches.id, leagueMatchTeamLineup.matchId)
    )
    .innerJoin(players, eq(players.id, leagueMatchLineupPlayers.playerId))
    .innerJoin(playerRoles, eq(playerRoles.id, players.roleId))
    .innerJoin(teams, eq(teams.id, players.teamId))
    .innerJoin(
      matchdayVotes,
      and(
        eq(matchdayVotes.playerId, players.id),
        eq(matchdayVotes.matchdayId, leagueMatches.splitMatchdayId)
      )
    )
    .innerJoin(
      matchdayBonusMalus,
      and(
        eq(matchdayBonusMalus.playerId, players.id),
        eq(matchdayBonusMalus.matchdayId, leagueMatches.splitMatchdayId)
      )
    )
    .innerJoin(
      bonusMalusTypes,
      eq(bonusMalusTypes.id, matchdayBonusMalus.bonusMalusTypeId)
    )
    .where(
      and(
        eq(leagueMatches.id, matchId),
        eq(leagueMatches.splitMatchdayId, currentMatchdayId),
        eq(leagueMatchLineupPlayers.playerType, lineupType)
      )
    );

  return results;
}

export type LineupPlayer = Awaited<ReturnType<typeof getLineupPlayers>>[0];
