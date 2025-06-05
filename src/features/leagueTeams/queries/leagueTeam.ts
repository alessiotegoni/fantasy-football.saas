import { db } from "@/drizzle/db";
import { leagueMembers, leagueMemberTeams } from "@/drizzle/schema";
import { getLeagueTeamsTag } from "@/features/leagueTeams/db/cache/leagueTeam";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

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
