"use server";

import { getUserId } from "@/features/users/utils/user";
import {
  deleteTrade as deleteTradeDb,
  deleteTradePlayers,
  getError,
  insertTrade,
  insertTradePlayers,
  updateTrade,
} from "../db/trade";
import {
  createTradeProposalSchema,
  deleteTradeProposalSchema,
  type DeleteTradeProposalSchema,
  type UpdateTradeProposalSchema,
  type CreateTradeProposalSchema,
  updateTradeProposalSchema,
} from "../schema/trade";
import { db } from "@/drizzle/db";
import { redirect } from "next/navigation";
import {
  canCreateTrade,
  canDeleteTrade,
  canUpdateTrade,
} from "../permissions/trade";
import { getTrade, Trade } from "../queries/trade";
import { after } from "node:test";
import { updateLeagueTeam } from "../../teams/db/leagueTeam";
import { getTeamCredits } from "../../teamsPlayers/queries/teamsPlayer";

export async function createTrade(values: CreateTradeProposalSchema) {
  const { success, data } = createTradeProposalSchema.safeParse(values);
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

export async function updateTradeStatus(values: UpdateTradeProposalSchema) {
  const { success, data } = updateTradeProposalSchema.safeParse(values);

  if (!success) {
    return getError("Errore nell'aggiornamento dello stato dello scambio");
  }

  const [userId, trade] = await Promise.all([
    getUserId(),
    getTrade(data.tradeId),
  ]);

  if (!userId || !trade) return getError("Questo scambio non esiste");

  const { error, message } = await canUpdateTrade({
    userId,
    ...data,
    ...trade,
  });
  if (error) return getError(message);

  await updateTrade(
    trade.id,
    data.status,
    !!trade.creditOfferedByProposer,
    !!trade.creditRequestedByProposer
  );

  if (data.status === "accepted") {
    after(updateTeamCredits.bind(null, trade));
  }

  return {
    error: false,
    message: `Scambio ${
      data.status === "accepted" ? "accettato" : "rifiutato"
    } con successo`,
  };
}

export async function deleteTrade(values: DeleteTradeProposalSchema) {
  const { success, data } = deleteTradeProposalSchema.safeParse(values);

  if (!success) return getError("Errore nell'eliminazione dello scambio");

  const [userId, trade] = await Promise.all([
    getUserId(),
    getTrade(data.tradeId),
  ]);

  if (!userId || !trade) return getError("Questo scambio non esiste");

  const { error, message } = await canDeleteTrade({
    userId,
    ...data,
    ...trade,
  });
  if (error) return getError(message);

  await db.transaction(async (tx) => {
    await Promise.all([
      deleteTradeDb(data.leagueId, data.tradeId, tx),
      deleteTradePlayers(trade.id, tx),
    ]);
  });

  return { error: false, message: "Scambio eliminato con successo" };
}

async function updateTeamCredits(trade: Trade) {
  const [proposerTeamCredits, receiverTeamCredits] = await Promise.all([
    getTeamCredits(trade.proposerTeamId),
    getTeamCredits(trade.receiverTeamId),
  ]);

  await db.transaction(async (tx) => {
    await Promise.all([
      updateLeagueTeam(
        trade.proposerTeamId,
        trade.leagueId,
        {
          credits: proposerTeamCredits - (trade.creditOfferedByProposer ?? 0),
        },
        tx
      ),
      updateLeagueTeam(
        trade.receiverTeamId,
        trade.leagueId,
        {
          credits: receiverTeamCredits - (trade.creditRequestedByProposer ?? 0),
        },
        tx
      ),
    ]);
  });
}
