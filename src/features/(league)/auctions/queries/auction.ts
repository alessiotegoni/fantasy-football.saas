import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getAuctionAvailablePlayersTag,
  getAuctionIdTag,
  getAuctionSettingTag,
  getLeagueAuctionsTag,
} from "../db/cache/auction";
import { db } from "@/drizzle/db";
import {
  auctionAcquisitions,
  playerRoles,
  players,
  teams,
} from "@/drizzle/schema";
import { eq, notInArray } from "drizzle-orm";
import { getPlayersTag } from "@/cache/global";

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

export type AuctionWithSettings = Awaited<
  ReturnType<typeof getAuctionWithSettings>
>;

export async function getAuctionAvailablePlayers(auctionId: string) {
  "use cache";
  cacheTag(getPlayersTag(), getAuctionAvailablePlayersTag(auctionId));

  const takenPlayersSubquery = await db
    .select({
      playerId: auctionAcquisitions.playerId,
    })
    .from(auctionAcquisitions)
    .where(eq(auctionAcquisitions.auctionId, auctionId));

  const playersIds = takenPlayersSubquery.map(({ playerId }) => playerId);

  const availablePlayers = await db
    .select({
      id: players.id,
      displayName: players.displayName,
      avatarUrl: players.avatarUrl,
      role: playerRoles,
      team: teams,
    })
    .from(players)
    .innerJoin(playerRoles, eq(playerRoles.id, players.roleId))
    .innerJoin(teams, eq(teams.id, players.teamId))
    .where(notInArray(players.id, playersIds));

  return availablePlayers;
}
