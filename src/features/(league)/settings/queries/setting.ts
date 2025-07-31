import { getTacticalModulesTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { leagueSettings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  getLeagueBonusMalusSettingsTag,
  getLeagueGeneralSettingsTag,
  getLeagueMarketSettingsTag,
  getLeagueRosterSettingsTag,
  getLeagueSettingsTag,
} from "../db/cache/setting";

export async function getTacticalModules() {
  "use cache";
  cacheTag(getTacticalModulesTag());

  return db.query.tacticalModules.findMany();
}

export async function getGeneralOptions(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueSettingsTag(leagueId),
    getLeagueGeneralSettingsTag(leagueId)
  );

  return db.query.leagueSettings.findFirst({
    columns: {
      initialCredits: true,
      maxMembers: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });
}

export async function getRosterOptions(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueSettingsTag(leagueId),
    getLeagueRosterSettingsTag(leagueId)
  );

  const rosterOptions = await db.query.leagueSettings.findFirst({
    columns: {
      tacticalModules: true,
      playersPerRole: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });

  return rosterOptions;
}

export async function getBonusMalusesOptions(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueSettingsTag(leagueId),
    getLeagueBonusMalusSettingsTag(leagueId)
  );

  const [result] = await db
    .select({ bonusMalusOptions: leagueSettings.customBonusMalus })
    .from(leagueSettings)
    .where(eq(leagueSettings.leagueId, leagueId));

  return result;
}

export async function getMarketOptions(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueSettingsTag(leagueId),
    getLeagueMarketSettingsTag(leagueId)
  );

  const marketOptions = await db.query.leagueSettings.findFirst({
    columns: {
      releasePercentage: true,
      isTradingMarketOpen: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });

  return marketOptions;
}
