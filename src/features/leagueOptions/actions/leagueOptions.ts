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
  rosterModulesSchema,
  RosterModulesSchema,
} from "../schema/leagueOptions";
import { db } from "@/drizzle/db";
import { updateLeague as updateLeagueInfo } from "@/features/leagues/db/league";

export async function updateGeneralOptions(
  values: GeneralOptionsSchema,
  leagueId: string
) {
  const { success, data } = generalOptionsSchema.safeParse(values);
  if (!success) return getError();

  return await db.transaction(async (tx) => {
    const [res] = await Promise.all([
      updateOptions({ ...data, leagueId }, { tx, visibility: data.visibility }),
      updateLeagueInfo(leagueId, data),
    ]);

    return res;
  });
}

export async function updateRosterModuleOptions(
  values: RosterModulesSchema,
  leagueId: string
) {
  const { success, data } = rosterModulesSchema.safeParse(values);
  if (!success) return getError();

  return await updateOptions({ ...data, leagueId });
}

export async function updateBonusMalusOptions(
  values: BonusMalusSchema,
  leagueId: string
) {
  const { success, data } = bonusMalusSchema.safeParse(values);
  if (!success) return getError();

  return await updateOptions({ ...data, leagueId });
}

async function updateOptions(
  options: typeof leagueOptions.$inferInsert,
  args?: {
    tx?: Omit<typeof db, "$client">;
    visibility?: LeagueVisibilityStatusType;
  }
) {
  const visibility =
    args?.visibility || (await getLeagueVisibility(options.leagueId));
  if (!visibility) return getError();

  const leagueId = await updateLeagueOptionsDb(options, visibility, args?.tx);

  if (!leagueId) return getError();

  return { error: false, message: "Optioni aggiornate con successo" };
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
