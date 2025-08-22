import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getAuctionIdTag,
  getAuctionSettingTag,
  getLeagueAuctionsTag,
} from "../db/cache/auction";
import { db } from "@/drizzle/db";

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
    orderBy: (auction, { asc, desc }) => [
      asc(auction.startedAt),
      desc(auction.id),
    ],
  });

  return results;
}

export type AuctionWithCreator = Awaited<
  ReturnType<typeof getLeagueAuctions>
>[number];

export async function getAuctionWithSettings(id: string) {
  "use cache";
  cacheTag(getAuctionIdTag(id), getAuctionSettingTag(id));

  const result = await db.query.auctions.findFirst({
    with: {
      settings: {
        columns: {
          auctionId: false,
        },
      },
    },
    where: (auction, { eq }) => eq(auction.id, id),
  });

  return result ? { ...result, settings: result.settings[0] } : undefined;
}

export type AuctionWithSettings = Awaited<ReturnType<typeof getAuctionWithSettings>>;
