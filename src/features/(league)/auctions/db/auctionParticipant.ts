import { db } from "@/drizzle/db";
import { auctionParticipants } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createError } from "@/lib/helpers";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione del partecipante all'asta",
  UPDATE_FAILED = "Errore nell'aggiornamento del partecipante all'asta",
  DELETION_FAILED = "Errore nell'eliminazione del partecipante all'asta",
}

const participantInfo = {
  participantId: auctionParticipants.id,
};

// credits e order sono inseriti automaticamente tramite due funzioni
// postgres chiamate da un trigger

export async function insertAuctionParticipant(
  participant: Pick<
    typeof auctionParticipants.$inferInsert,
    "auctionId" | "teamId"
  >
) {
  const [result] = await db
    .insert(auctionParticipants)
    .values(participant)
    .returning(participantInfo);

  if (!result?.participantId) {
    throw new Error(createError(DB_ERROR_MESSAGES.CREATION_FAILED).message);
  }

  return result.participantId;
}

export async function updateAuctionParticipant(
  participantId: string,
  participant: Partial<
    Pick<
      typeof auctionParticipants.$inferInsert,
      "credits" | "isOnline" | "order" | "isCurrent"
    >
  >,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .update(auctionParticipants)
    .set(participant)
    .where(eq(auctionParticipants.id, participantId))
    .returning(participantInfo);

  if (!result?.participantId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_FAILED).message);
  }
}

export async function deleteAuctionParticipant(participantId: string) {
  const [result] = await db
    .delete(auctionParticipants)
    .where(eq(auctionParticipants.id, participantId))
    .returning(participantInfo);

  if (!result?.participantId) {
    throw new Error(createError(DB_ERROR_MESSAGES.DELETION_FAILED).message);
  }
}
