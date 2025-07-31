"use server";

import { leagueSettings } from "@/drizzle/schema";
import { updateLeagueSettings as updateleagueSettingsDb } from "../db/setting";
import {
  bonusMalusSchema,
  BonusMalusSchema,
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

export async function updateGeneralOptions(
  values: GeneralSettingsSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<GeneralSettingsSchema>(
    generalSettingsSchema,
    values
  );
  if (!isValid) return error;

  return await updateOptions({ ...data, leagueId });
}

export async function updateRosterModuleOptions(
  values: RosterModulesSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<RosterModulesSchema>(
    rosterModulesSchema,
    values
  );
  if (!isValid) return error;

  const res = await updateOptions({ ...data, leagueId });
  revalidateLeagueRosterSettingsCache(leagueId);

  return res;
}

export async function updateBonusMalusOptions(
  values: BonusMalusSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<BonusMalusSchema>(
    bonusMalusSchema,
    values
  );
  if (!isValid) return error;

  return await updateOptions({ ...data, leagueId });
}

export async function updateMarketOptions(
  values: MarketSettingsSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<MarketSettingsSchema>(
    marketSettingsSchema,
    values
  );
  if (!isValid) return error;

  return await updateOptions({ ...data, leagueId });
}

async function updateOptions(options: typeof leagueSettings.$inferInsert) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  if (!(await isLeagueAdmin(userId, options.leagueId))) {
    return createError(LEAGUE_SETTINGS_MESSAGES.REQUIRE_ADMIN);
  }

  const visibility = await getLeagueVisibility(options.leagueId);
  if (!visibility)
    return createError(LEAGUE_SETTINGS_MESSAGES.LEAGUE_NOT_FOUND);

  const leagueId = await updateleagueSettingsDb(options, visibility);
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
