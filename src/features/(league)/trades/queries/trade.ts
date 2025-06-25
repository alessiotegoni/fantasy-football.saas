import { db } from "@/drizzle/db";
import {
  leagueTradeProposalPlayers,
  leagueTradeProposals,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getTradeIdTag, getTradePlayersIdTag } from "../db/cache/trade";

export async function getTrade(tradeId: string) {
  "use cache";
  cacheTag(getTradeIdTag(tradeId));

  return db
    .select()
    .from(leagueTradeProposals)
    .where(eq(leagueTradeProposals.id, tradeId))
    .then(([result]) => result);
}

export async function getTradePlayers(tradeId: string) {
  "use cache";
  cacheTag(getTradePlayersIdTag(tradeId));

  return db
    .select()
    .from(leagueTradeProposalPlayers)
    .where(eq(leagueTradeProposalPlayers.tradeProposalId, tradeId))
    .then(([result]) => result);
}

export async function getTradeStatus(tradeId: string) {
  return db
    .select({ status: leagueTradeProposals.status })
    .from(leagueTradeProposals)
    .where(eq(leagueTradeProposals.id, tradeId))
    .then(([trade]) => trade.status);
}
