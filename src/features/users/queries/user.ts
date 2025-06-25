import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserLeaguesTag, getUserTeamTag } from "../db/cache/user";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { leagueMembers, leagueMemberTeams, leagues } from "@/drizzle/schema";
import { authUsers } from "drizzle-orm/supabase";

export async function getUserLeagues(userId: string) {
  "use cache";
  cacheTag(getUserLeaguesTag(userId));

  return db
    .select({ id: leagues.id, name: leagues.name, imageUrl: leagues.imageUrl })
    .from(leagues)
    .innerJoin(leagueMembers, eq(leagueMembers.leagueId, leagues.id))
    .where(eq(leagueMembers.userId, userId));
}

export async function getUserTeamId(userId: string, leagueId: string) {
  "use cache";
  cacheTag(getUserTeamTag(userId));

  const [res] = await db
    .select({ teamId: leagueMemberTeams.id })
    .from(leagueMemberTeams)
    .innerJoin(
      leagueMembers,
      eq(leagueMembers.id, leagueMemberTeams.leagueMemberId)
    )
    .innerJoin(authUsers, eq(authUsers.id, leagueMembers.userId))
    .where(
      and(eq(leagueMemberTeams.leagueId, leagueId), eq(authUsers.id, userId))
    );

  return res.teamId;
}
