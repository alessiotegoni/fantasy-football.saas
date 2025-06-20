import { db } from "@/drizzle/db";
import { leagueMembers, leagueMemberTeams } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueTeamsTag, getTeamIdTag } from "../db/cache/leagueTeam";

export async function getLeagueTeams(leagueId: string) {
  "use cache";
  cacheTag(getLeagueTeamsTag(leagueId));

  return db
    .select({
      id: leagueMemberTeams.id,
      name: leagueMemberTeams.name,
      imageUrl: leagueMemberTeams.imageUrl,
      managerName: leagueMemberTeams.managerName,
      credits: leagueMemberTeams.credits,
      userId: leagueMembers.userId,
    })
    .from(leagueMemberTeams)
    .innerJoin(
      leagueMembers,
      eq(leagueMemberTeams.leagueMemberId, leagueMembers.id)
    )
    .where(eq(leagueMemberTeams.leagueId, leagueId));
}
export type LeagueTeam = Awaited<ReturnType<typeof getLeagueTeams>>[number];

export async function getLeagueTeam({
  leagueId,
  teamId,
}: {
  leagueId: string;
  teamId: string;
}) {
  "use cache";
  cacheTag(getTeamIdTag(teamId));

  return db.query.leagueMemberTeams.findFirst({
    columns: {
      leagueId: false,
      leagueMemberId: false,
    },
    where: (team, { and, eq }) =>
      and(eq(team.leagueId, leagueId), eq(team.id, teamId)),
  });
}
