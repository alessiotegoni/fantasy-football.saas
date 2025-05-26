import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueAuctionTag } from "../db/cache/auction";
import { db } from "@/drizzle/db";
import { and, count, eq } from "drizzle-orm";
import { leagueMembers, leagues, userSubscriptions } from "@/drizzle/schema";
import { isValidSubscription } from "@/features/users/permissions/user";

export async function isAuctionUnlocked(leagueId: string) {
  "use cache";
  cacheTag(getLeagueAuctionTag(leagueId));

  const [res] = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .innerJoin(
      leagueMembers,
      eq(leagueMembers.userId, userSubscriptions.userId)
    )
    .innerJoin(leagues, eq(leagues.id, leagueMembers.leagueId))
    .where(and(eq(leagues.id, leagueId), isValidSubscription));

  return res.count > 0;
}
