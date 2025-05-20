import { db } from "@/drizzle/db";
import { userSubscriptions } from "@/drizzle/schema";
import { and, count, eq, gte, or } from "drizzle-orm";

export async function userHasPremium(userId: string) {
  const res = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        or(
          eq(userSubscriptions.status, "active"),
          and(
            eq(userSubscriptions.status, "canceled"),
            gte(userSubscriptions.endedAt, new Date())
          )
        )
      )
    );

  return res[0].count > 0;
}
