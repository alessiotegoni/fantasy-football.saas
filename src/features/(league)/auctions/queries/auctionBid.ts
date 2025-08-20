import { db } from "@/drizzle/db";
import { auctionBids } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export async function getHighestBid(nominationId: string) {
  const [highestBid] = await db
    .select()
    .from(auctionBids)
    .where(eq(auctionBids.nominationId, nominationId))
    .orderBy(desc(auctionBids.amount))
    .limit(1);

  return highestBid;
}
