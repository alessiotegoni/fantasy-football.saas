import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getAuctionIdTag, getLeagueAuctionsTag } from "../db/cache/auction";
import { db } from "@/drizzle/db";
import { auctions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getLeagueAuctions(leagueId: string, splitId: number) {
  "use cache";
  cacheTag(getLeagueAuctionsTag(leagueId));

  const results = await db.query.auctions.findMany({
    with: {
      creator: {
        columns: {
          managerName: true,
        },
      },
    },
    where: (auction, { and, eq }) =>
      and(eq(auction.leagueId, leagueId), eq(auction.splitId, splitId)),
    orderBy: (auction, { asc, desc }) => [asc(auction.startedAt), desc(auction.id)],
  });

  return results;
}

export type AuctionWithCreator = Awaited<
  ReturnType<typeof getLeagueAuctions>
>[number];

export async function getAuction(id: string) {
  "use cache";
  cacheTag(getAuctionIdTag(id));

  const [result] = await db.select().from(auctions).where(eq(auctions.id, id));

  return result;
}

export type Auction = typeof auctions.$inferSelect;
