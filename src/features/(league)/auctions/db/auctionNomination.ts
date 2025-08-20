import { db } from "@/drizzle/db";
import { auctionNominations, NominationStatus } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { createError } from "@/lib/helpers";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione della nomina all'asta",
  UPDATE_FAILED = "Errore nell'aggiornamento della nomina all'asta",
  DELETION_FAILED = "Errore nell'eliminazione della nomina all'asta",
}

const nominationInfo = {
  nominationId: auctionNominations.id,
};

export async function insertAuctionNomination(
  nomination: typeof auctionNominations.$inferInsert
) {
  const [result] = await db
    .insert(auctionNominations)
    .values(nomination)
    .returning(nominationInfo);

  if (!result?.nominationId) {
    throw new Error(createError(DB_ERROR_MESSAGES.CREATION_FAILED).message);
  }

  return result.nominationId;
}

export async function updateAuctionNominationStatus(
  nominationId: string,
  status: NominationStatus,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .update(auctionNominations)
    .set({ status })
    .where(eq(auctionNominations.id, nominationId))
    .returning(nominationInfo);

  if (!result?.nominationId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_FAILED).message);
  }
}

export async function deleteAuctionNomination(nominationId: string) {
  const [result] = await db
    .delete(auctionNominations)
    .where(eq(auctionNominations.id, nominationId))
    .returning(nominationInfo);

  if (!result?.nominationId) {
    throw new Error(createError(DB_ERROR_MESSAGES.DELETION_FAILED).message);
  }
}
