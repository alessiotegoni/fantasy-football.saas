import { db } from "@/drizzle/db";
import { auctions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createError } from "@/lib/helpers";
import { revalidateLeagueAuctionsCache } from "./cache/auction";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione dell'asta",
  UPDATE_FAILED = "Errore nell'aggiornamento dell'asta",
  DELETION_FAILED = "Errore nell'eliminazione dell'asta",
}

const auctionInfo = {
  auctionId: auctions.id,
  leagueId: auctions.leagueId,
};

export async function insertAuction(
  auction: typeof auctions.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .insert(auctions)
    .values(auction)
    .returning(auctionInfo);

  if (!result?.auctionId) {
    throw new Error(createError(DB_ERROR_MESSAGES.CREATION_FAILED).message);
  }

  revalidateLeagueAuctionsCache(result.leagueId, result.auctionId);

  return result.auctionId;
}

export async function updateAuction(
  auctionId: string,
  auction: Partial<
    Pick<
      typeof auctions.$inferInsert,
      "name" | "description" | "status" | "startedAt" | "endedAt"
    >
  >,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .update(auctions)
    .set(auction)
    .where(eq(auctions.id, auctionId))
    .returning(auctionInfo);

  if (!result?.auctionId) {
    throw new Error(createError(DB_ERROR_MESSAGES.UPDATE_FAILED).message);
  }

  revalidateLeagueAuctionsCache(result.leagueId, result.auctionId);
}

export async function deleteAuction(
  auctionId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const [result] = await tx
    .delete(auctions)
    .where(eq(auctions.id, auctionId))
    .returning(auctionInfo);

  if (!result?.auctionId) {
    throw new Error(createError(DB_ERROR_MESSAGES.DELETION_FAILED).message);
  }

  revalidateLeagueAuctionsCache(result.leagueId, result.auctionId);
}
