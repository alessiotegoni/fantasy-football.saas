import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getAuctionIdTag } from "../db/cache/auction";
import { db } from "@/drizzle/db";
import { auctions } from "@/drizzle/schema";

export async function getAuction(id: string) {
  "use cache";
  cacheTag(getAuctionIdTag(id));

  return db.select().from(auctions);
}
