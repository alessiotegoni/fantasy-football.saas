import { getTacticalModulesTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { leagueSettings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  getLeagueBonusMalusSettingsTag,
  getLeagueCalculationSettingsTag,
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

export async function getGeneralSettings(leagueId: string) {
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
    where: (settings, { eq }) => eq(settings.leagueId, leagueId),
  });
}

export async function getRosterSettings(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueSettingsTag(leagueId),
    getLeagueRosterSettingsTag(leagueId)
  );

  const [result] = await db
    .select({
      tacticalModules: leagueSettings.tacticalModules,
      playersPerRole: leagueSettings.playersPerRole,
    })
    .from(leagueSettings)
    .where(eq(leagueSettings.leagueId, leagueId));

  return result;
}

export async function getBonusMalusesSettings(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueSettingsTag(leagueId),
    getLeagueBonusMalusSettingsTag(leagueId)
  );

  const [result] = await db
    .select({ bonusMalusSettings: leagueSettings.customBonusMalus })
    .from(leagueSettings)
    .where(eq(leagueSettings.leagueId, leagueId));

  return result;
}

export async function getCalculationSettings(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueSettingsTag(leagueId),
    getLeagueCalculationSettingsTag(leagueId)
  );

  const [result] = await db
    .select({ goalThreshold: leagueSettings.goalThresholdSettings })
    .from(leagueSettings)
    .where(eq(leagueSettings.leagueId, leagueId));

  return result;
}

export async function getMarketSettings(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueSettingsTag(leagueId),
    getLeagueMarketSettingsTag(leagueId)
  );

  const [result] = await db
    .select({
      releasePercentage: leagueSettings.releasePercentage,
      isTradingMarketOpen: leagueSettings.isTradingMarketOpen,
    })
    .from(leagueSettings)
    .where(eq(leagueSettings.leagueId, leagueId));

  return result;
}
