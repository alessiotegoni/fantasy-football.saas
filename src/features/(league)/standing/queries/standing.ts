import { db } from "@/drizzle/db";
import { leagueMatchResults } from "@/drizzle/schema/leagueMatchResults";
import { leagueMatches } from "@/drizzle/schema/leagueMatches";
import { splitMatchdays } from "@/drizzle/schema/splitMatchdays";
import { leagueMemberTeams } from "@/drizzle/schema/leagueMemberTeams";
import { and, eq, sum, desc, ne, asc, sql } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueStandingTag } from "../db/cache/standing";
import { alias } from "drizzle-orm/pg-core";

export async function getLeagueStandingData(leagueId: string, splitId: number) {
  "use cache";
  cacheTag(getLeagueStandingTag(leagueId));

  const opponentResults = alias(leagueMatchResults, "opponent_results");

  const goalDifference = sql<number>`${sum(leagueMatchResults.goals)} - ${sum(
    opponentResults.goals
  )}`;

  const result = await db
    .select({
      team: {
        id: leagueMatchResults.teamId,
        name: leagueMemberTeams.name,
        imageUrl: leagueMemberTeams.imageUrl,
      },
      totalScore: sum(leagueMatchResults.totalScore),
      points: sum(leagueMatchResults.points),
      goalsScored: sum(leagueMatchResults.goals),
      goalsConceded: sum(opponentResults.goals),
      goalDifference,
      wins: sql<number>`sum(case when ${leagueMatchResults.points} = 3 then 1 else 0 end)`,
      draws: sql<number>`sum(case when ${leagueMatchResults.points} = 1 then 1 else 0 end)`,
      losses: sql<number>`sum(case when ${leagueMatchResults.points} = -3 then 1 else 0 end)`,
    })
    .from(leagueMatchResults)
    .innerJoin(
      leagueMatches,
      eq(leagueMatchResults.leagueMatchId, leagueMatches.id)
    )
    .innerJoin(
      opponentResults,
      and(
        eq(leagueMatches.id, opponentResults.leagueMatchId),
        ne(leagueMatchResults.teamId, opponentResults.teamId)
      )
    )
    .innerJoin(
      splitMatchdays,
      eq(leagueMatches.splitMatchdayId, splitMatchdays.id)
    )
    .leftJoin(
      leagueMemberTeams,
      eq(leagueMatchResults.teamId, leagueMemberTeams.id)
    )
    .where(
      and(
        eq(leagueMatches.leagueId, leagueId),
        eq(leagueMatches.isBye, false),
        eq(splitMatchdays.splitId, splitId)
      )
    )
    .groupBy(
      leagueMatchResults.teamId,
      leagueMemberTeams.name,
      leagueMemberTeams.imageUrl
    )
    .orderBy(
      desc(sum(leagueMatchResults.points)),
      desc(sum(leagueMatchResults.totalScore)),
      desc(sum(leagueMatchResults.goals)),
      asc(sum(opponentResults.goals)),
      desc(goalDifference)
    );

  return result;
}

export type StandingData = Awaited<
  ReturnType<typeof getLeagueStandingData>
>[number];
