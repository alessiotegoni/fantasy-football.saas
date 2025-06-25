import { db } from "@/drizzle/db";
import {
  leagueTradeProposalPlayers,
  leagueTradeProposals,
} from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { revalidateLeagueTradesCache } from "./cache/trade";
import { eq } from "drizzle-orm";

export const getError = (message = "Errore nella creazione dello scamnio") =>
  getErrorObject(message);

export async function insertTrade(
  trade: typeof leagueTradeProposals.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueTradeProposals)
    .values(trade)
    .returning({ tradeId: leagueTradeProposals.id });

  if (!res.tradeId) throw new Error(getError().message);

  revalidateLeagueTradesCache({
    leagueId: trade.leagueId,
    tradeId: res.tradeId,
  });

  return res.tradeId;
}

export async function insertTradePlayers(
  leagueId: string,
  tradeId: string,
  tradePlayers: (typeof leagueTradeProposalPlayers.$inferInsert)[],
  tx: Omit<typeof db, "$client"> = db
) {
  const res = await tx
    .insert(leagueTradeProposalPlayers)
    .values(tradePlayers)
    .returning();

  if (!res.length) throw new Error(getError().message);

  revalidateLeagueTradesCache({
    leagueId,
    tradeId,
  });
}

export async function deleteTrade(
  leagueId: string,
  tradeId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueTradeProposals)
    .where(eq(leagueTradeProposals.id, tradeId))
    .returning({ tradeId: leagueTradeProposals.id });

  if (!res.tradeId)
    throw new Error(getError("Errore nell'eliminazione dello scambio").message);

  revalidateLeagueTradesCache({ leagueId, tradeId });
}

export async function deleteTradePlayers(
  leagueId: string,
  tradeId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const res = await tx
    .delete(leagueTradeProposalPlayers)
    .where(eq(leagueTradeProposalPlayers.tradeProposalId, tradeId))
    .returning();

  if (!res.length)
    throw new Error(getError("Errore nell'eliminazione dello scambio").message);

  revalidateLeagueTradesCache({
    leagueId,
    tradeId,
  });
}
