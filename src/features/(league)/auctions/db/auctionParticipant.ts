import { db } from "@/drizzle/db";
import { auctionParticipants } from "@/drizzle/schema";
import { and, eq, inArray, SQL, sql } from "drizzle-orm";
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
// chiamate da due trigger

export async function insertParticipant(
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

export async function updateParticipantsOrder(
  auctionId: string,
  participantsIds: string[]
) {
  if (!participantsIds.length) return;

  const sqlChunks: SQL[] = [];
  const ids: string[] = [];

  sqlChunks.push(sql`(case`);

  participantsIds.forEach((participantId, index) => {
    sqlChunks.push(
      sql`when ${auctionParticipants.id} = ${participantId} then ${index + 1}`
    );
    ids.push(participantId);
  });

  sqlChunks.push(sql`end)`);

  const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

  await db
    .update(auctionParticipants)
    .set({ order: finalSql })
    .where(
      and(
        eq(auctionParticipants.auctionId, auctionId),
        inArray(auctionParticipants.id, ids)
      )
    );
}

export async function updateParticipantCredits(
  participantId: string,
  amount: number,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .update(auctionParticipants)
    .set({ credits: sql`${auctionParticipants.credits} + ${amount}` })
    .where(eq(auctionParticipants.id, participantId))
    .returning(participantInfo);

  if (!result?.participantId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_FAILED).message);
  }
}

export async function setAuctionTurn(auctionId: string, participantId: string) {
  await db.transaction(async (tx) => {
    await tx
      .update(auctionParticipants)
      .set({ isCurrent: false })
      .where(eq(auctionParticipants.auctionId, auctionId));

    await tx
      .update(auctionParticipants)
      .set({ isCurrent: true })
      .where(eq(auctionParticipants.id, participantId));
  });
}

export async function deleteParticipant(participantId: string) {
  const [result] = await db
    .delete(auctionParticipants)
    .where(eq(auctionParticipants.id, participantId))
    .returning(participantInfo);

  if (!result?.participantId) {
    throw new Error(createError(DB_ERROR_MESSAGES.DELETION_FAILED).message);
  }
}
