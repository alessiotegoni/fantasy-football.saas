import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueIdTag } from "../db/cache/league";
import { db } from "@/drizzle/db";
import { leagues, leagueSettings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getLeagueSettingsTag } from "../../settings/db/cache/setting";

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

export async function getLeagueSettings(leagueId: string) {
  "use cache";
  cacheTag(getLeagueSettingsTag(leagueId));

  const [settings] = await db
    .select()
    .from(leagueSettings)
    .where(eq(leagues.id, leagueId));

  return settings;
}

export type LeagueSettings = typeof leagueSettings.$inferSelect;
