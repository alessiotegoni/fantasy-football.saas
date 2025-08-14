import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getAuctionIdTag, getLeagueAuctionsTag } from "../db/cache/auction";
import { db } from "@/drizzle/db";
import { auctions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getLeagueAuctions(leagueId: string) {
  "use cache";
  cacheTag(getLeagueAuctionsTag(leagueId));

  const results = await db
    .select()
    .from(auctions)
    .where(eq(auctions.leagueId, leagueId));

  return results;
}

export async function getAuction(id: string) {
  "use cache";
  cacheTag(getAuctionIdTag(id));

  const [result] = await db.select().from(auctions).where(eq(auctions.id, id));

  return result;
}
