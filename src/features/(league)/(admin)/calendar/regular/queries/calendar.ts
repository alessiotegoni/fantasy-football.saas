import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getLeagueFinalPhaseCalendarTag,
  getLeagueRegularCalendarTag,
} from "../../db/cache/calendar";
import {
  leagueMatches,
  splitMatchdays,
  leagueMemberTeams,
  leagueMatchResults,
  MatchdayType,
} from "@/drizzle/schema";
import { eq, and, asc, sql, ne } from "drizzle-orm";

import { getLeagueTeamsTag } from "@/features/(league)/teams/db/cache/leagueTeam";
import { db } from "@/drizzle/db";
import { getLeagueMatchesResultsTag } from "@/features/(league)/leagues/db/cache/league";
import { alias } from "drizzle-orm/pg-core";
import { getSplitsMatchdaysTag } from "@/cache/global";

export async function getRegularCalendar(leagueId: string, splitId: number) {
  "use cache";
  cacheTag(
    getLeagueRegularCalendarTag(leagueId),
    ...getLeagueCalendarTags(leagueId)
  );

  return getLeagueCalendar(leagueId, splitId);
}

export async function getFinalPhaseCalendar(leagueId: string, splitId: number) {
  "use cache";
  cacheTag(
    getLeagueFinalPhaseCalendarTag(leagueId),
    ...getLeagueCalendarTags(leagueId)
  );

  return getLeagueCalendar(leagueId, splitId, false);
}

async function getLeagueCalendar(
  leagueId: string,
  splitId: number,
  isRegular = true
) {
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
        isRegular
          ? eq(splitMatchdays.type, "regular")
          : ne(splitMatchdays.type, "regular")
      )
    )
    .orderBy(asc(splitMatchdays.number))
    .groupBy(leagueMatches.id, splitMatchdays.id, homeTeam.id, awayTeam.id);

  return results;
}

export type Match = Awaited<ReturnType<typeof getLeagueCalendar>>[number];
type MatchResult = {
  teamId: string;
  goals: number;
  totalScore: string;
};

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

function getLeagueCalendarTags(leagueId: string) {
  return [
    getLeagueTeamsTag(leagueId),
    getLeagueMatchesResultsTag(leagueId),
    getSplitsMatchdaysTag(),
  ];
}
