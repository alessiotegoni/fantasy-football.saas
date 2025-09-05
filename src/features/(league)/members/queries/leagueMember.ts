import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { leagueMembers, leagueMemberTeams } from "@/drizzle/schema";
import { authUsers } from "drizzle-orm/supabase";
import { eq } from "drizzle-orm";
import { getLeagueMembersTag } from "@/features/(league)/members/db/cache/leagueMember";
import {
  getLeagueTeamsTag,
  getTeamIdTag,
} from "@/features/(league)/teams/db/cache/leagueTeam";

export async function getLeagueMembers(leagueId: string) {
  "use cache";
  cacheTag(getLeagueMembersTag(leagueId), getLeagueTeamsTag(leagueId));

  const results = await db
    .select({
      id: leagueMembers.id,
      role: leagueMembers.role,
      joinedAt: leagueMembers.joinedAt,
      user: {
        id: leagueMembers.userId,
        email: authUsers.email,
      },
      team: {
        id: leagueMemberTeams.id,
        name: leagueMemberTeams.name,
        managerName: leagueMemberTeams.managerName,
        imageUrl: leagueMemberTeams.imageUrl,
      },
    })
    .from(leagueMembers)
    .leftJoin(authUsers, eq(leagueMembers.userId, authUsers.id))
    .leftJoin(
      leagueMemberTeams,
      eq(leagueMembers.id, leagueMemberTeams.leagueMemberId)
    )
    .where(eq(leagueMembers.leagueId, leagueId));

  cacheTag(
    ...results
      .filter((member) => !!member.team?.id)
      .map((member) => getTeamIdTag(member.team?.id ?? ""))
  );

  return results;
}

export type LeagueMember = Awaited<ReturnType<typeof getLeagueMembers>>[number]
