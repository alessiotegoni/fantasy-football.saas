import { db } from "@/drizzle/db";
import { leagueMatchResults } from "@/drizzle/schema/leagueMatchResults";
import { leagueMatches } from "@/drizzle/schema/leagueMatches";
import { splitMatchdays } from "@/drizzle/schema/splitMatchdays";
import { leagueMemberTeams } from "@/drizzle/schema/leagueMemberTeams";
import { and, eq, sum, desc, ne, asc, sql } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueStandingTag } from "../db/cache/standing";
import { alias } from "drizzle-orm/pg-core";
import { getLeagueTeamsTag } from "../../teams/db/cache/leagueTeam";
import { getLeagueTeams, LeagueTeam } from "../../teams/queries/leagueTeam";

export async function getLeagueStandingData(leagueId: string, splitId: number) {
  "use cache";
  cacheTag(getLeagueStandingTag(leagueId), getLeagueTeamsTag(leagueId));

  const opponentResults = alias(leagueMatchResults, "opponent_results");

  const goalDifference = sql<string>`${sum(leagueMatchResults.goals)} - ${sum(
    opponentResults.goals
  )}`;

  const results = await db
    .select({
      team: {
        id: leagueMatchResults.teamId,
        name: leagueMemberTeams.name,
      },
      totalScore: sum(leagueMatchResults.totalScore),
      points: sum(leagueMatchResults.points),
      goalsScored: sum(leagueMatchResults.goals),
      goalsConceded: sum(opponentResults.goals),
      goalDifference,
      wins: sql<string>`sum(case when ${leagueMatchResults.points} = 3 then 1 else 0 end)`,
      draws: sql<string>`sum(case when ${leagueMatchResults.points} = 1 then 1 else 0 end)`,
      losses: sql<string>`sum(case when ${leagueMatchResults.points} = -3 then 1 else 0 end)`,
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

  return parseStandingResults(results);
}

export type StandingData = Awaited<
  ReturnType<typeof getLeagueStandingData>
>[number];

export function getDefaultStandingData(leagueTeams: LeagueTeam[]) {
  return leagueTeams.map((team) => ({
    team,
    totalScore: 0,
    points: 0,
    goalsScored: 0,
    goalsConceded: 0,
    goalDifference: 0,
    wins: 0,
    draws: 0,
    losses: 0,
  }));
}

export function getAdjustedStandingData(
  data: StandingData[],
  defaultData: StandingData[]
) {
  const inStandingTeamsIds = new Set(data.map((d) => d.team.id));
  const notInStanding = defaultData.filter(
    (dd) => !inStandingTeamsIds.has(dd.team.id)
  );

  return [...data, ...notInStanding];
}

function parseStandingResults(
  results: {
    team: {
      id: string;
      name: string | null;
    };
    totalScore: string | null;
    points: string | null;
    goalsScored: string | null;
    goalsConceded: string | null;
    goalDifference: string | null;
    wins: string;
    draws: string;
    losses: string;
  }[]
) {
  return results.map((row) => ({
    ...row,
    totalScore: Number(row.totalScore),
    points: Number(row.points),
    goalsScored: Number(row.goalsScored),
    goalsConceded: Number(row.goalsConceded),
    goalDifference: Number(row.goalDifference),
    wins: Number(row.wins),
    draws: Number(row.draws),
    losses: Number(row.losses),
  }));
}
