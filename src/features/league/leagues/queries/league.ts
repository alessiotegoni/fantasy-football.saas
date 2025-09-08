import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueIdTag } from "../db/cache/league";
import { db } from "@/drizzle/db";
import { leagues } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getLeague(leagueId: string) {
  "use cache";
  cacheTag(getLeagueIdTag(leagueId));

  const [league] = await db
    .select()
    .from(leagues)
    .where(eq(leagues.id, leagueId));

  return league;
}

export type League = typeof leagues.$inferSelect;
