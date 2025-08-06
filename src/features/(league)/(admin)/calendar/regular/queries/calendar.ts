import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueCalendarTag } from "../db/cache/calendar";
import {
  leagueMatches,
  splitMatchdays,
  leagueMemberTeams,
  leagueMatchResults,
} from "@/drizzle/schema";
import { eq, and, asc, sql } from "drizzle-orm";

import { getLeagueTeamsTag } from "@/features/(league)/teams/db/cache/leagueTeam";
import { db } from "@/drizzle/db";
import { getLeagueMatchesResultsTag } from "@/features/(league)/leagues/db/cache/league";
import { alias } from "drizzle-orm/pg-core";
import { getSplitsMatchdaysTag } from "@/cache/global";

type MatchResult = {
  teamId: string;
  goals: number;
  totalScore: string;
};

export async function getRegularCalendar(leagueId: string, splitId: number) {
  "use cache";
  cacheTag(
    getLeagueCalendarTag(leagueId),
    getLeagueTeamsTag(leagueId),
    getLeagueMatchesResultsTag(leagueId),
    getSplitsMatchdaysTag()
  );

  const homeTeam = alias(leagueMemberTeams, "homeTeam");
  const awayTeam = alias(leagueMemberTeams, "awayTeam");

  const results = await db
    .select({
      id: leagueMatches.id,
      isBye: leagueMatches.isBye,

      splitMatchday: {
        id: splitMatchdays.id,
        number: splitMatchdays.number,
        status: splitMatchdays.status,
      },

      homeTeam: {
        id: leagueMatches.homeTeamId,
        name: homeTeam.name,
        imageUrl: homeTeam.imageUrl,
      },

      awayTeam: {
        id: leagueMatches.awayTeamId,
        name: awayTeam.name,
        imageUrl: awayTeam.imageUrl,
      },

      matchResults: matchResultsSql(),
    })
    .from(leagueMatches)
    .innerJoin(
      splitMatchdays,
      eq(leagueMatches.splitMatchdayId, splitMatchdays.id)
    )
    .leftJoin(homeTeam, eq(leagueMatches.homeTeamId, homeTeam.id))
    .leftJoin(awayTeam, eq(leagueMatches.awayTeamId, awayTeam.id))
    .leftJoin(
      leagueMatchResults,
      eq(leagueMatchResults.leagueMatchId, leagueMatches.id)
    )
    .where(
      and(
        eq(leagueMatches.leagueId, leagueId),
        eq(splitMatchdays.splitId, splitId),
        eq(splitMatchdays.type, "regular")
      )
    )
    .orderBy(asc(splitMatchdays.number))
    .groupBy(leagueMatches.id, splitMatchdays.id, homeTeam.id, awayTeam.id);

  return results;
}

export type Match = Awaited<ReturnType<typeof getRegularCalendar>>[number];

function matchResultsSql() {
  return sql<MatchResult[]>`
    coalesce(
      json_agg(
        jsonb_build_object(
          'teamId', ${leagueMatchResults.teamId},
          'goals', ${leagueMatchResults.goals},
          'totalScore', ${leagueMatchResults.totalScore}
        )
      ) FILTER (WHERE ${leagueMatchResults.leagueMatchId} = ${leagueMatches.id}),
      '[]'
    )
  `.as("matchResults");
}
