"use server";

import { leagueOptions } from "@/drizzle/schema";
import { updateLeagueOptions as updateLeagueOptionsDb } from "../db/setting";
import {
  bonusMalusSchema,
  BonusMalusSchema,
  generalOptionsSchema,
  GeneralOptionsSchema,
  marketOptionsSchema,
  MarketOptionsSchema,
  rosterModulesSchema,
  RosterModulesSchema,
} from "../schema/setting";
import { db } from "@/drizzle/db";
import { getUserId } from "@/features/users/utils/user";
import { revalidateLeagueRosterOptionsCache } from "../db/cache/setting";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";
import { createError, createSuccess } from "@/lib/helpers";
import { validateSchema, VALIDATION_ERROR } from "@/schema/helpers";

enum LEAGUE_OPTIONS_MESSAGES {
  REQUIRE_ADMIN = "Devi essere admin della lega per modificare le opzioni",
  LEAGUE_NOT_FOUND = "Lega non trovata",
}

export async function updateGeneralOptions(
  values: GeneralOptionsSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<GeneralOptionsSchema>(
    generalOptionsSchema,
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
  revalidateLeagueRosterOptionsCache(leagueId);

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
  values: MarketOptionsSchema,
  leagueId: string
) {
  const { isValid, error, data } = validateSchema<MarketOptionsSchema>(
    marketOptionsSchema,
    values
  );
  if (!isValid) return error;

  return await updateOptions({ ...data, leagueId });
}

async function updateOptions(options: typeof leagueOptions.$inferInsert) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  if (!(await isLeagueAdmin(userId, options.leagueId))) {
    return createError(LEAGUE_OPTIONS_MESSAGES.REQUIRE_ADMIN);
  }

  const visibility = await getLeagueVisibility(options.leagueId);
  if (!visibility) return createError(LEAGUE_OPTIONS_MESSAGES.LEAGUE_NOT_FOUND);

  const leagueId = await updateLeagueOptionsDb(options, visibility);
  if (!leagueId) return createError(LEAGUE_OPTIONS_MESSAGES.LEAGUE_NOT_FOUND);

  return createSuccess("Opzioni aggiornate con successo", null);
}

function getLeagueVisibility(leagueId: string) {
  return db.query.leagues
    .findFirst({
      columns: {
        visibility: true,
      },
      where: (league, { eq }) => eq(league.id, leagueId),
    })
    .then((league) => league?.visibility);
}
