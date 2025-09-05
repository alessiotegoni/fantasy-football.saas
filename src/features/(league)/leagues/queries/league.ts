import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueIdTag, getLeaguePremiumTag } from "../db/cache/league";
import { db } from "@/drizzle/db";
import { getMemberIdTag } from "../../members/db/cache/leagueMember";
import {
  leagueMembers,
  leagues,
  leagueSettings,
  userSubscriptions,
} from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";
import { isValidSubscription } from "@/features/users/permissions/user";

export async function getLeague(leagueId: string) {
  "use cache";
  cacheTag(getLeagueIdTag(leagueId));

  const [league] = await db
    .select()
    .from(leagues)
    .where(eq(leagues.id, leagueId));

  return league;
}

export type League = typeof leagues.$inferSelect

export async function getLeaguePremium(leagueId: string) {
  "use cache";
  cacheTag(getLeaguePremiumTag(leagueId));

  const [result] = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .innerJoin(
      leagueMembers,
      eq(leagueMembers.userId, userSubscriptions.userId)
    )
    .innerJoin(leagues, eq(leagues.id, leagueMembers.leagueId))
    .where(and(eq(leagues.id, leagueId), isValidSubscription));

  return result.count > 0;
}

export async function getLeagueAdmin(userId: string, leagueId: string) {
  "use cache";
  cacheTag(getMemberIdTag(leagueId));

  const [result] = await db
    .select({ count: count() })
    .from(leagueMembers)
    .where(
      and(
        eq(leagueMembers.leagueId, leagueId),
        eq(leagueMembers.userId, userId),
        eq(leagueMembers.role, "admin")
      )
    );

  return result.count === 1;
}
