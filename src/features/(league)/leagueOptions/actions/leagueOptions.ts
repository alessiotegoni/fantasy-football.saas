"use server";

import { leagueOptions, LeagueVisibilityStatusType } from "@/drizzle/schema";
import {
  getError,
  updateLeagueOptions as updateLeagueOptionsDb,
} from "../db/leagueOptions";
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
import { isLeagueAdmin } from "../../leagueMembers/permissions/leagueMember";

export async function updateGeneralOptions(
  values: GeneralOptionsSchema,
  leagueId: string
) {
  const { success, data } = generalOptionsSchema.safeParse(values);
  if (!success) return getError();

  return await updateOptions({ ...data, leagueId });
}

export async function updateRosterModuleOptions(
  values: RosterModulesSchema,
  leagueId: string
) {
  const { success, data } = rosterModulesSchema.safeParse(values);
  if (!success) return getError();

  const res = await updateOptions({ ...data, leagueId });
  revalidateLeagueRosterOptionsCache(leagueId);

  return res;
}

export async function updateBonusMalusOptions(
  values: BonusMalusSchema,
  leagueId: string
) {
  const { success, data } = bonusMalusSchema.safeParse(values);
  if (!success) return getError();

  return await updateOptions({ ...data, leagueId });
}

export async function updateMarketOptions(
  values: MarketOptionsSchema,
  leagueId: string
) {
  const { success, data } = marketOptionsSchema.safeParse(values);
  if (!success) return getError();

  return await updateOptions({ ...data, leagueId });
}

async function updateOptions(options: typeof leagueOptions.$inferInsert) {
  const userId = await getUserId();
  if (!userId) return getError();

  if (!(await isLeagueAdmin(userId, options.leagueId)))
    return getError("Devi essere admin della lega per modificare le opzioni");

  const visibility = await getLeagueVisibility(options.leagueId);
  if (!visibility) return getError();

  const leagueId = await updateLeagueOptionsDb(options, visibility);
  if (!leagueId) return getError();

  return { error: false, message: "Opzioni aggiornate con successo" };
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
