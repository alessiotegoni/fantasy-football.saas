import { db } from "@/drizzle/db";
import { auctionAcquisitions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createError } from "@/lib/helpers";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione dell'acquisizione all'asta",
  DELETION_FAILED = "Errore nell'eliminazione dell'acquisizione all'asta",
}

const acquisitionInfo = {
  acquisitionId: auctionAcquisitions.id,
};

export async function insertAcquisition(
  acquisition: typeof auctionAcquisitions.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .insert(auctionAcquisitions)
    .values(acquisition)
    .returning(acquisitionInfo);

  if (!result?.acquisitionId) {
    throw new Error(createError(DB_ERROR_MESSAGES.CREATION_FAILED).message);
  }

  return result.acquisitionId;
}

export async function deleteAcquisition(
  acquisitionId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .delete(auctionAcquisitions)
    .where(eq(auctionAcquisitions.id, acquisitionId))
    .returning(acquisitionInfo);

  if (!result?.acquisitionId) {
    throw new Error(createError(DB_ERROR_MESSAGES.DELETION_FAILED).message);
  }
}
