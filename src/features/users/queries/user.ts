import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserLeaguesTag } from "../db/cache/user";
import { db } from "@/drizzle/db";
import { leagueMembers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserLeagues(userId: string) {
  "use cache";
  cacheTag(getUserLeaguesTag(userId));

  const res = await db
    .select({ leagueId: leagueMembers.leagueId })
    .from(leagueMembers)
    .where(eq(leagueMembers.userId, userId));

  return res.flatMap(({ leagueId }) => leagueId);
}
