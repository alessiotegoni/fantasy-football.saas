import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueCalendarTag } from "../db/cache/calendar";
import { getSplitsMatchdaysTag } from "@/cache/global";
import {
  leagueMatches,
  splitMatchdays,
  leagueMemberTeams,
  leagueMatchResults,
} from "@/drizzle/schema";
import { eq, and, asc } from "drizzle-orm";

import { getLeagueTeamsTag } from "@/features/(league)/teams/db/cache/leagueTeam";
import { db } from "@/drizzle/db";
import { getLeagueMatchesResultsTag } from "@/features/(league)/leagues/db/cache/league";

export async function getLeagueCalendar(leagueId: string, splitId: number) {
  "use cache";
  cacheTag(
    getLeagueCalendarTag(leagueId),
    getLeagueTeamsTag(leagueId),
    getLeagueMatchesResultsTag(leagueId),
    getSplitsMatchdaysTag()
  );

  const results = await db
    .select({
      id: leagueMatches.id,
      isBye: leagueMatches.isBye,

      homeTeam: {
        id: leagueMemberTeams.id,
        name: leagueMemberTeams.name,
        managerName: leagueMemberTeams.managerName,
        imageUrl: leagueMemberTeams.imageUrl,
      },

      awayTeam: {
        id: leagueMemberTeams.id,
        name: leagueMemberTeams.name,
        managerName: leagueMemberTeams.managerName,
        imageUrl: leagueMemberTeams.imageUrl,
      },

      splitMatchday: {
        id: splitMatchdays.id,
        number: splitMatchdays.number,
        status: splitMatchdays.status,
      },

      matchResult: {
        teamId: leagueMatchResults.teamId,
        points: leagueMatchResults.points,
        totalScore: leagueMatchResults.totalScore,
      },
    })
    .from(leagueMatches)
    .innerJoin(
      splitMatchdays,
      eq(leagueMatches.splitMatchdayId, splitMatchdays.id)
    )
    .innerJoin(
      leagueMemberTeams,
      eq(leagueMatches.homeTeamId, leagueMemberTeams.id)
    )
    .innerJoin(
      leagueMemberTeams,
      eq(leagueMatches.awayTeamId, leagueMemberTeams.id)
    )
    .leftJoin(
      leagueMatchResults,
      eq(leagueMatchResults.leagueMatchId, leagueMatches.id)
    )
    .where(
      and(
        eq(leagueMatches.leagueId, leagueId),
        eq(splitMatchdays.splitId, splitId)
      )
    )
    .orderBy(asc(splitMatchdays.number));

  return results;
}
