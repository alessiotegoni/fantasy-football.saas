import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getMatchLineupInfoTag, getMatchResultsTag } from "../db/cache/match";
import { db } from "@/drizzle/db";
import { getLeagueTeamsTag } from "../../teams/db/cache/leagueTeam";
import { getTacticalModulesTag } from "@/cache/global";

export async function getMatchLineupInfo(leagueId: string, matchId: string) {
  "use cache";
  cacheTag(
    getLeagueTeamsTag(leagueId),
    getMatchLineupInfoTag(matchId),
    getMatchResultsTag(matchId),
    getTacticalModulesTag()
  );

  const result = await db.query.leagueMatches.findFirst({
    columns: {},
    with: {
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
          leagueMemberTeamId: true,
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

  return result;
}

export type LineupInfo = Awaited<ReturnType<typeof getMatchLineupInfo>>;
