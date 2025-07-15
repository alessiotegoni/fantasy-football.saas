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
import { getPlayerRolesTag, getPlayersTag, getTeamsTag } from "@/cache/global";
import { formatTeamData, getMatchInfoTags } from "../utils/match";

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
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      awayTeam: {
        columns: {
          id: true,
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
      ...result,
      leagueId,
      matchId,
      splitId: result.splitMatchday.splitId,
    })
  );

  const { homeTeam, awayTeam, lineups, league, ...matchInfo } = result;

  return {
    homeTeam: formatTeamData(homeTeam, lineups),
    awayTeam: formatTeamData(awayTeam, lineups),
    leagueCustomBonusMalus: league.options[0].customBonusMalus,
    ...matchInfo,
    ...matchInfo,
  };
}

export type MatchInfo = NonNullable<Awaited<ReturnType<typeof getMatchInfo>>>;

export async function getStarterLineups(
  matchId: string,
  currentMatchdayId: number
) {
  "use cache";
  cacheTag(
    getMatchStartersLineupTag(matchId),
    getPlayersTag(),
    getPlayerRolesTag(),
    getTeamsTag()
  );

  return getLineup(matchId, currentMatchdayId, "starter");
}

export async function getBenchLineups(
  matchId: string,
  currentMatchdayId: number
) {
  "use cache";
  cacheTag(
    getMatchBenchsLineupTag(matchId),
    getPlayersTag(),
    getPlayerRolesTag(),
    getTeamsTag()
  );

  return getLineup(matchId, currentMatchdayId, "bench");
}

async function getLineup(
  matchId: string,
  currentMatchdayId: number,
  lineupType: LineupPlayerType
) {
  const results = await db
    .select({
      lineupPlayerId: leagueMatchLineupPlayers.id,
      playerId: leagueMatchLineupPlayers.playerId,
      leagueTeamId: leagueMatchTeamLineup.teamId,
      role: playerRoles,
      team: {
        displayName: teams.displayName,
      },
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
    .innerJoin(teams, eq(teams.id, players.teamId))
    .innerJoin(playerRoles, eq(playerRoles.id, players.roleId))
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

export type LineupPlayer = Awaited<ReturnType<typeof getLineup>>[0];
