"use server";

import { leagueSettings } from "@/drizzle/schema";
import { updateLeagueSettings as updateleagueSettingsDb } from "../db/setting";
import {
  bonusMalusSchema,
  BonusMalusSchema,
  calculationSettingsSchema,
  CalculationSettingsSchema,
  generalSettingsSchema,
  GeneralSettingsSchema,
  marketSettingsSchema,
  MarketSettingsSchema,
  rosterModulesSchema,
  RosterModulesSchema,
} from "../schema/setting";
import { db } from "@/drizzle/db";
import { getUserId } from "@/features/users/utils/user";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";
import { createError, createSuccess } from "@/lib/helpers";
import { validateSchema, VALIDATION_ERROR } from "@/schema/helpers";
import { revalidateLeagueRosterSettingsCache } from "../db/cache/setting";

enum LEAGUE_SETTINGS_MESSAGES {
  REQUIRE_ADMIN = "Devi essere admin della lega per modificare le opzioni",
  LEAGUE_NOT_FOUND = "Lega non trovata",
}

export async function updateGeneralSettings(
  values: GeneralSettingsSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<GeneralSettingsSchema>(
    generalSettingsSchema,
    values
  );
  if (!isValid) return error;

  return await updateSettings({ ...data, leagueId });
}

export async function updateRosterModuleSettings(
  values: RosterModulesSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<RosterModulesSchema>(
    rosterModulesSchema,
    values
  );
  if (!isValid) return error;

  const res = await updateSettings({ ...data, leagueId });
  revalidateLeagueRosterSettingsCache(leagueId);

  return res;
}

export async function updateBonusMalusSettings(
  values: BonusMalusSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<BonusMalusSchema>(
    bonusMalusSchema,
    values
  );
  if (!isValid) return error;

  return await updateSettings({ ...data, leagueId });
}

export async function calculationSettings(
  values: CalculationSettingsSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<CalculationSettingsSchema>(
    calculationSettingsSchema,
    values
  );
  if (!isValid) return error;

  return await updateSettings({ ...data, leagueId });
}

export async function updateMarketSettings(
  values: MarketSettingsSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<MarketSettingsSchema>(
    marketSettingsSchema,
    values
  );
  if (!isValid) return error;

  return await updateSettings({ ...data, leagueId });
}

async function updateSettings(settings: typeof leagueSettings.$inferInsert) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  if (!(await isLeagueAdmin(userId, settings.leagueId))) {
    return createError(LEAGUE_SETTINGS_MESSAGES.REQUIRE_ADMIN);
  }

  const visibility = await getLeagueVisibility(settings.leagueId);
  if (!visibility)
    return createError(LEAGUE_SETTINGS_MESSAGES.LEAGUE_NOT_FOUND);

  const leagueId = await updateleagueSettingsDb(settings, visibility);
  if (!leagueId) return createError(LEAGUE_SETTINGS_MESSAGES.LEAGUE_NOT_FOUND);

  return createSuccess("Opzioni aggiornate con successo", null);
}

async function getLeagueVisibility(leagueId: string) {
  return db.query.leagues
    .findFirst({
      columns: {
        visibility: true,
      },
      where: (league, { eq }) => eq(league.id, leagueId),
    })
    .then((league) => league?.visibility);
}
