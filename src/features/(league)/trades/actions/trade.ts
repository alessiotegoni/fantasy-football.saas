"use server";

import { getUserId } from "@/features/users/utils/user";
import { getError, insertTrade, insertTradePlayers } from "../db/trade";
import { tradeProposalSchema, TradeProposalSchema } from "../schema/trade";
import { db } from "@/drizzle/db";

export async function addTrade(values: TradeProposalSchema) {
  const { success, data } = tradeProposalSchema.safeParse(values);
  if (!success) return getError();

  const userId = await getUserId();

  const { players, ...trade } = data;

  await db.transaction(async (tx) => {
    const tradeProposalId = await insertTrade(trade, tx);

    const tradePlayers = players.map(({ id, offeredByProposer }) => ({
      playerId: id,
      tradeProposalId,
      offeredByProposer,
    }));
    await insertTradePlayers(data.leagueId, tradeProposalId, tradePlayers);
  });
}
