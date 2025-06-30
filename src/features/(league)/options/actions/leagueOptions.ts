"use server";

import { leagueOptions } from "@/drizzle/schema";
import { updateLeagueOptions as updateLeagueOptionsDb } from "../db/leagueOptions";
import {
  bonusMalusSchema,
  BonusMalusSchema,
  generalOptionsSchema,
  GeneralOptionsSchema,
  marketOptionsSchema,
  MarketOptionsSchema,
  rosterModulesSchema,
  RosterModulesSchema,
} from "../schema/leagueOptions";
import { db } from "@/drizzle/db";
import { getUserId } from "@/features/users/utils/user";
import { revalidateLeagueRosterOptionsCache } from "../db/cache/leagueOption";
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
  const schemaValidation = validateSchema<GeneralOptionsSchema>(
    generalOptionsSchema,
    values
  );
  if (!schemaValidation.isValid) return schemaValidation.error;

  return await updateOptions({ ...schemaValidation.data, leagueId });
}

export async function updateRosterModuleOptions(
  values: RosterModulesSchema,
  leagueId: string
) {
  const schemaValidation = validateSchema<RosterModulesSchema>(
    rosterModulesSchema,
    values
  );
  if (!schemaValidation.isValid) return schemaValidation.error;

  const res = await updateOptions({ ...schemaValidation.data, leagueId });
  revalidateLeagueRosterOptionsCache(leagueId);

  return res;
}

export async function updateBonusMalusOptions(
  values: BonusMalusSchema,
  leagueId: string
) {
  const schemaValidation = validateSchema<BonusMalusSchema>(
    bonusMalusSchema,
    values
  );
  if (!schemaValidation.isValid) return schemaValidation.error;

  return await updateOptions({ ...schemaValidation.data, leagueId });
}

export async function updateMarketOptions(
  values: MarketOptionsSchema,
  leagueId: string
) {
  const schemaValidation = validateSchema<MarketOptionsSchema>(
    marketOptionsSchema,
    values
  );
  if (!schemaValidation.isValid) return schemaValidation.error;

  return await updateOptions({ ...schemaValidation.data, leagueId });
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
