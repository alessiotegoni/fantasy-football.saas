import { db } from "@/drizzle/db";
import { auctionParticipants } from "@/drizzle/schema";
import { and, eq, inArray, SQL, sql } from "drizzle-orm";
import { createError } from "@/utils/helpers";
import { revalidateAuctionParticipantsCache } from "./cache/auction";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione del partecipante all'asta",
  UPDATE_FAILED = "Errore nell'aggiornamento del partecipante all'asta",
  DELETION_FAILED = "Errore nell'eliminazione del partecipante all'asta",
}

const participantInfo = {
  auctionId: auctionParticipants.auctionId,
  participantId: auctionParticipants.id,
};

// credits e order sono inseriti automaticamente tramite due funzioni
// chiamate da due trigger

export async function insertParticipant(
  participant: Pick<
    typeof auctionParticipants.$inferInsert,
    "auctionId" | "teamId"
  >,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .insert(auctionParticipants)
    .values(participant)
    .returning(participantInfo);

  if (!result?.participantId) {
    throw new Error(createError(DB_ERROR_MESSAGES.CREATION_FAILED).message);
  }

  revalidateAuctionParticipantsCache(result.auctionId);

  return result.participantId;
}

export async function updateParticipantsOrder(
  auctionId: string,
  participantsIds: string[],
) {
  if (!participantsIds.length) return;

  const ids: string[] = [];
  const sqlChunks: SQL[] = [];

  participantsIds.forEach((participantId, index) => {
    sqlChunks.push(
      sql`when ${auctionParticipants.id} = ${participantId} then ${index + 1}`,
    );
    ids.push(participantId);
  });

  const whenClauses = sql.join(sqlChunks, sql.raw(" "));
  const finalSql = sql`(case ${whenClauses} end)::smallint`;

  await db
    .update(auctionParticipants)
    .set({ order: finalSql })
    .where(
      and(
        eq(auctionParticipants.auctionId, auctionId),
        inArray(auctionParticipants.id, ids),
      ),
    );

  revalidateAuctionParticipantsCache(auctionId);
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

  revalidateAuctionParticipantsCache(result.auctionId);
}

export async function setAuctionTurn(
  auctionId: string,
  participantId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  await tx
    .update(auctionParticipants)
    .set({ isCurrent: false })
    .where(eq(auctionParticipants.auctionId, auctionId));

  await tx
    .update(auctionParticipants)
    .set({ isCurrent: true })
    .where(eq(auctionParticipants.id, participantId));

  revalidateAuctionParticipantsCache(auctionId);
}

export async function deleteParticipant(participantId: string) {
  const [result] = await db
    .delete(auctionParticipants)
    .where(eq(auctionParticipants.id, participantId))
    .returning(participantInfo);

  if (!result?.participantId) {
    throw new Error(createError(DB_ERROR_MESSAGES.DELETION_FAILED).message);
  }

  revalidateAuctionParticipantsCache(result.auctionId);
}
