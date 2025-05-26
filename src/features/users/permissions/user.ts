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
