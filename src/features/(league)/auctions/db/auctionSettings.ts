import { db } from "@/drizzle/db";
import { auctionSettings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createError } from "@/lib/helpers";
import { revalidateAuctionSettingsCache } from "./cache/auction";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione delle impostazioni",
  UPDATE_FAILED = "Errore nell'aggiornamento delle impostazioni",
}

const settingsInfo = {
  auctionId: auctionSettings.auctionId,
};

export async function insertAuctionSettings(
  settings: typeof auctionSettings.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .insert(auctionSettings)
    .values(settings)
    .returning(settingsInfo);

  if (!result?.auctionId) {
    throw new Error(createError(DB_ERROR_MESSAGES.CREATION_FAILED).message);
  }

  revalidateAuctionSettingsCache(result.auctionId);
}

export async function updateAuctionSettings(
  auctionId: string,
  settings: Partial<typeof auctionSettings.$inferInsert>,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .update(auctionSettings)
    .set(settings)
    .where(eq(auctionSettings.auctionId, auctionId))
    .returning(settingsInfo);

  if (!result?.auctionId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_FAILED).message);
  }

  revalidateAuctionSettingsCache(result.auctionId);
}
