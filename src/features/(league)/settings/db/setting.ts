import { db } from "@/drizzle/db";
import { leagueSettings, LeagueVisibilityStatusType } from "@/drizzle/schema";
import {} from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidateleagueSettingsCache } from "./cache/setting";
import { createError } from "@/lib/helpers";

enum DB_ERROR_MESSAGES {
  INSERT = "Errore nell'inserimento delle opzioni della lega",
  UPDATE = "Errore nell'aggiornamento delle opzioni della lega",
}

export async function insertleagueSettings(
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

export async function updateleagueSettings(
  { leagueId, ...options }: typeof leagueSettings.$inferInsert,
  visibility: LeagueVisibilityStatusType,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .update(leagueSettings)
    .set(options)
    .where(eq(leagueSettings.leagueId, leagueId))
    .returning({ leagueId: leagueSettings.leagueId });

  if (!res.leagueId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE).message);
  }

  revalidateleagueSettingsCache({ leagueId: res.leagueId, visibility });

  return res.leagueId;
}
