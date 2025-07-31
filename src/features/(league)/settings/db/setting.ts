import { db } from "@/drizzle/db";
import { leagueOptions, LeagueVisibilityStatusType } from "@/drizzle/schema";
import {} from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidateLeagueOptionsCache } from "./cache/setting";
import { createError } from "@/lib/helpers";

enum DB_ERROR_MESSAGES {
  INSERT = "Errore nell'inserimento delle opzioni della lega",
  UPDATE = "Errore nell'aggiornamento delle opzioni della lega",
}

export async function insertLeagueOptions(
  { leagueId }: typeof leagueOptions.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueOptions)
    .values({ leagueId })
    .returning({ leagueId: leagueOptions.leagueId });

  if (!res.leagueId) {
    throw new Error(createError(DB_ERROR_MESSAGES.INSERT).message);
  }
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

  if (!res.leagueId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE).message);
  }

  revalidateLeagueOptionsCache({ leagueId: res.leagueId, visibility });

  return res.leagueId;
}
