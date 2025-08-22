import { db } from "@/drizzle/db";
import { auctionBids } from "@/drizzle/schema";
import { createError } from "@/utils/helpers";

enum DB_ERROR_MESSAGES {
  CREATION_FAILED = "Errore nella creazione dell'offerta all'asta",
}

export async function insertBid(bid: typeof auctionBids.$inferInsert) {
  const [result] = await db.insert(auctionBids).values(bid).returning({
    bidId: auctionBids.id,
  });

  if (!result?.bidId) {
    throw new Error(createError(DB_ERROR_MESSAGES.CREATION_FAILED).message);
  }

  return result.bidId;
}
