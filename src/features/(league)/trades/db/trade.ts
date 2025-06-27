import { db } from "@/drizzle/db";
import {
  leagueTradeProposalPlayers,
  leagueTradeProposals,
  TradeProposalStatusType,
} from "@/drizzle/schema";
import { revalidateLeagueTradesCache } from "./cache/trade";
import { eq } from "drizzle-orm";
import { createError } from "@/lib/utils";

export async function insertTrade(
  trade: typeof leagueTradeProposals.$inferInsert,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .insert(leagueTradeProposals)
    .values(trade)
    .returning({ tradeId: leagueTradeProposals.id });

  if (!res.tradeId)
    throw new Error(
      createError("Errore nella creazione dello scambio").message
    );

  revalidateLeagueTradesCache({
    leagueId: trade.leagueId,
    tradeId: res.tradeId,
  });

  return res.tradeId;
}

export async function insertTradePlayers(
  tradePlayers: (typeof leagueTradeProposalPlayers.$inferInsert)[],
  tx: Omit<typeof db, "$client"> = db
) {
  const res = await tx
    .insert(leagueTradeProposalPlayers)
    .values(tradePlayers)
    .returning();

  if (!res.length)
    throw new Error(
      createError("Errore nell'inserimento dei giocatori dello scambio").message
    );
}

export async function updateTrade(
  tradeId: string,
  status: TradeProposalStatusType,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .update(leagueTradeProposals)
    .set({ status })
    .where(eq(leagueTradeProposals.id, tradeId))
    .returning();

  if (!res.proposerTeamId) {
    throw new Error(
      createError("Errore nell'aggiornamento dello scambio").message
    );
  }

  revalidateLeagueTradesCache({
    leagueId: res.leagueId,
    tradeId,
  });

  return res.id;
}

export async function deleteTrade(leagueId: string, tradeId: string) {
  const [res] = await db
    .delete(leagueTradeProposals)
    .where(eq(leagueTradeProposals.id, tradeId))
    .returning();

  if (!res.id) {
    throw new Error(
      createError("Errore nell'eliminazione dello scambio").message
    );
  }

  revalidateLeagueTradesCache({ leagueId, tradeId });

  return res;
}
