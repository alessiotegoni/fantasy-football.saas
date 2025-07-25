import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import {
  leagueMatches,
  leagueMatchLineupPlayers,
  leagueMatchTeamLineup,
  matchdayVotes,
  playerRoles,
  players,
  teams,
} from "@/drizzle/schema";
import { and, asc, eq } from "drizzle-orm";
import {
  getPlayerRolesTag,
  getPlayersTag,
  getTacticalModulesTag,
  getTeamsTag,
} from "@/cache/global";
import {
  getMatchInfoTag,
  getMatchLineupsTag,
  getMatchResultsTag,
} from "@/features/(league)/matches/db/cache/match";
import { getLeagueOptionsTag } from "@/features/(league)/options/db/cache/leagueOption";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";
import { getPlayerMatchdayVoteTag } from "@/features/votes/db/cache/vote";
import { formatTeamData } from "../utils/match";
import { PlayerBonusMalus } from "@/features/bonusMaluses/queries/bonusMalus";

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

export async function getLineupsPlayers(matchId: string, matchdayId: number) {
  "use cache";

  const results = await db
    .select({
      id: players.id,
      displayName: players.displayName,
      avatarUrl: players.avatarUrl,
      role: playerRoles,
      team: teams,
      leagueTeamId: leagueMatchTeamLineup.teamId,
      positionId: leagueMatchLineupPlayers.positionId,
      positionOrder: leagueMatchLineupPlayers.positionOrder,
      vote: matchdayVotes.vote,
      lineupPlayerType: leagueMatchLineupPlayers.playerType,
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
    .leftJoin(
      matchdayVotes,
      and(
        eq(matchdayVotes.playerId, players.id),
        eq(matchdayVotes.matchdayId, leagueMatches.splitMatchdayId)
      )
    )
    .where(eq(leagueMatches.id, matchId))
    .orderBy(asc(leagueMatchLineupPlayers.positionOrder));

  cacheTag(
    ...getLineupsPlayersTags({
      matchId,
      matchdayId,
      players: results,
    })
  );

  return results.map((player) => ({
    ...player,
    bonusMaluses: [] as PlayerBonusMalus[],
    totalVote: null as string | null,
    purchaseCost: 0,
  }));
}

export type LineupPlayer = Awaited<
  ReturnType<typeof getLineupsPlayers>
>[number];

function getMatchInfoTags({
  homeTeamId,
  awayTeamId,
  leagueId,
  matchId,
  splitMatchday,
}: {
  homeTeamId: string | null;
  awayTeamId: string | null;
  splitMatchday: {
    id: number;
  };
  leagueId: string;
  matchId: string;
}) {
  const tags = [
    getMatchInfoTag(matchId),
    getMatchResultsTag(matchId),
    getTacticalModulesTag(),
    getLeagueOptionsTag(leagueId),
    getSplitMatchdaysIdTag(splitMatchday.id),
  ];

  if (homeTeamId) tags.push(getTeamIdTag(homeTeamId));
  if (awayTeamId) tags.push(getTeamIdTag(awayTeamId));

  return tags;
}

function getLineupsPlayersTags({
  matchId,
  matchdayId,
  players,
}: {
  matchId: string;
  players: { id: number }[];
  matchdayId: number;
}) {
  const tags = [
    getMatchLineupsTag(matchId),
    getPlayersTag(),
    getPlayerRolesTag(),
    getTeamsTag(),
  ];

  const playersMatchdayVotesTags = players.map((player) =>
    getPlayerMatchdayVoteTag(player.id, matchdayId)
  );

  return [...tags, ...playersMatchdayVotesTags];
}
