import { db } from "@/drizzle/db";
import { leagues } from "@/drizzle/schema";
import { userHasPremium } from "@/features/subscriptions/permissions/subscription";
import { count, eq } from "drizzle-orm";

export async function canCreateLeague(userId: string) {
  const [hasPremium, hasLeague] = await Promise.all([
    userHasPremium(userId),
    ownsLeague(userId),
  ]);

  return hasPremium ? true : !hasLeague;
}

async function ownsLeague(userId: string) {
  const res = await db
    .select({ count: count() })
    .from(leagues)
    .where(eq(leagues.ownerId, userId));

  return res[0].count >= 1;
}
