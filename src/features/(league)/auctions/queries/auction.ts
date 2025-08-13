import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getAuctionIdTag } from "../db/cache/auction";
import { db } from "@/drizzle/db";
import { auctions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAuction(id: string) {
  "use cache";
  cacheTag(getAuctionIdTag(id));

  const [result] = await db.select().from(auctions).where(eq(auctions.id, id));

  return result;
}
