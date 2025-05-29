import { db } from "@/drizzle/db";
import { userSubscriptions } from "@/drizzle/schema";
import { and, count, eq, gte, or } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserPremiumTag } from "../db/cache/user";

export const isValidSubscription = or(
  eq(userSubscriptions.status, "active"),
  and(
    eq(userSubscriptions.status, "canceled"),
    gte(userSubscriptions.endedAt, new Date())
  )
);

export async function userHasPremium(userId: string) {
  "use cache";
  cacheTag(getUserPremiumTag(userId));

  const res = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .where(and(eq(userSubscriptions.userId, userId), isValidSubscription));

  return res[0].count > 0;
}

export async function isUserBanned(userId: string, leagueId: string) {
  const res = await db.query.leagueUserBans.findFirst({
    columns: {
      id: true,
    },
    where: (ban, { and, eq }) =>
      and(eq(ban.userId, userId), eq(ban.leagueId, leagueId)),
  });

  return !!res?.id;
}
