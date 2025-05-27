import { db } from "@/drizzle/db";
import { leagueOptions, LeagueVisibilityStatusType } from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidateLeagueOptionsCache } from "./cache/option";

export const getError = (message = "Errore nell'aggiornamento delle opzioni") =>
  getErrorObject(message);

export async function insertLeagueOptions(
  { leagueId }: typeof leagueOptions.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueOptions)
    .values({ leagueId })
    .returning({ leagueId: leagueOptions.leagueId });

  if (!res.leagueId) throw new Error(getError().message);
}

export async function updateLeagueOptions(
  { leagueId, ...options }: typeof leagueOptions.$inferInsert,
  visibility: LeagueVisibilityStatusType,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .update(leagueOptions)
    .set(options)
    .where(eq(leagueOptions.leagueId, leagueId))
    .returning({ leagueId: leagueOptions.leagueId });

  if (!res.leagueId) throw new Error(getError().message);

  revalidateLeagueOptionsCache({ leagueId: res.leagueId, visibility });

  return res.leagueId;
}
