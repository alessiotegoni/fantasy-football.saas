import { db } from "@/drizzle/db";
import { leagueMembers } from "@/drizzle/schema";
import { count, and, eq } from "drizzle-orm";

export async function isLeagueAdmin(userId: string, leagueId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagueMembers)
    .where(
      and(
        eq(leagueMembers.leagueId, leagueId),
        eq(leagueMembers.userId, userId),
        eq(leagueMembers.role, "admin")
      )
    );

  return res[0].count === 1;
}

export async function isLeagueMember(userId: string, leagueId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagueMembers)
    .where(
      and(
        eq(leagueMembers.leagueId, leagueId),
        eq(leagueMembers.userId, userId)
      )
    );

  return res[0].count === 1;
}

export async function isMemberOfALeague(userId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagueMembers)
    .where(eq(leagueMembers.userId, userId));

  return res[0].count >= 1;
}
