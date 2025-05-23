import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserLeaguesTag } from "../db/cache/user";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { leagueMembers, leagues } from "@/drizzle/schema";

export async function getUserLeagues(userId: string) {
  "use cache";
  cacheTag(getUserLeaguesTag(userId));

  return db
    .select({ id: leagues.id, name: leagues.name, imageUrl: leagues.imageUrl })
    .from(leagues)
    .innerJoin(leagueMembers, eq(leagueMembers.leagueId, leagues.id))
    .where(eq(leagueMembers.userId, userId));
}
