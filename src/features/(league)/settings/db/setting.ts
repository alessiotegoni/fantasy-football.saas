import { db } from "@/drizzle/db";
import { leagueSettings, LeagueVisibilityStatusType } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateLeagueSettingsCache } from "./cache/setting";
import { createError } from "@/lib/helpers";

enum DB_ERROR_MESSAGES {
  INSERT = "Errore nell'inserimento dei settaggi della lega",
  UPDATE = "Errore nell'aggiornamento dei settaggi della lega",
}

export async function insertLeagueSettings(
  { leagueId }: typeof leagueSettings.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueSettings)
    .values({ leagueId })
    .returning({ leagueId: leagueSettings.leagueId });

  if (!res.leagueId) {
    throw new Error(createError(DB_ERROR_MESSAGES.INSERT).message);
  }
}

export async function updateLeagueSettings(
  { leagueId, ...settings }: typeof leagueSettings.$inferInsert,
  visibility: LeagueVisibilityStatusType,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .update(leagueSettings)
    .set(settings)
    .where(eq(leagueSettings.leagueId, leagueId))
    .returning({ leagueId: leagueSettings.leagueId });

  if (!res.leagueId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE).message);
  }

  revalidateLeagueSettingsCache({ leagueId: res.leagueId, visibility });

  return res.leagueId;
}
