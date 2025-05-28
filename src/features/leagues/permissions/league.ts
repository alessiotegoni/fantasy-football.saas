import { db } from "@/drizzle/db";
import { leagueMembers, leagues } from "@/drizzle/schema";
import { userHasPremium } from "@/features/users/permissions/user";
import { count, and, eq } from "drizzle-orm";

export async function canCreateLeague(userId: string) {
  const [hasPremium, hasLeague] = await Promise.all([
    userHasPremium(userId),
    ownsLeague(userId),
  ]);

  return hasPremium ? true : !hasLeague;
}

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

async function ownsLeague(userId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagues)
    .where(eq(leagues.ownerId, userId));

  return res[0].count >= 1;
}
