"use server";

import { getUserId } from "@/features/users/utils/user";
import { getError, insertTrade, insertTradePlayers } from "../db/trade";
import { tradeProposalSchema, TradeProposalSchema } from "../schema/trade";
import { db } from "@/drizzle/db";
import { redirect } from "next/navigation";
import { canCreateTrade } from "../permissions/trade";
import { getUUIdSchema } from "@/schema/helpers";

export async function createTrade(values: TradeProposalSchema) {
  const { success, data } = tradeProposalSchema.safeParse(values);
  if (!success) return getError();

  const userId = await getUserId();
  if (!userId) return getError();

  const { players, ...trade } = data;

  const { error, message } = await canCreateTrade({ userId, ...data });
  if (error) return getError(message);

  const tradeId = await db.transaction(async (tx) => {
    const tradeProposalId = await insertTrade(trade, tx);

    await insertTradePlayers(
      players.map(({ id, offeredByProposer }) => ({
        playerId: id,
        tradeProposalId,
        offeredByProposer,
      })),
      tx
    );

    return tradeProposalId;
  });

  redirect(`/leagues/${data.leagueId}/trades/${tradeId}`);
}

export async function deleteTrade(leagueId: string, tradeId: string) {
  const { success, data } = getUUIdSchema(
    "Id dello scambio invalido"
  ).safeParse({ leagueId, tradeId });

  if (!success) return getError("Errore nell'eliminazione dello scambio");

  const userId = await getUserId();
  if (!userId) return getError();

  redirect(`/leagues/${leagueId}/my-trades`);
}
