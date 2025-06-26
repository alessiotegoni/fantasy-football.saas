"use server";

import { getUserId } from "@/features/users/utils/user";
import {
  deleteTrade as deleteTradeDb,
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
import { updateLeagueTeam } from "../../teams/db/leagueTeam";
import {
  deleteTeamPlayers,
  insertTeamPlayers,
} from "../../teamsPlayers/db/teamsPlayer";
import { groupTradePlayers } from "../utils/trade";

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

async function updateTradeStatus(values: UpdateTradeProposalSchema) {
  const parsed = updateTradeProposalSchema.safeParse(values);
  if (!parsed.success) {
    return getError("Errore nell'aggiornamento dello stato dello scambio");
  }

  const data = parsed.data;
  const [userId, trade] = await Promise.all([
    getUserId(),
    getTrade(data.tradeId),
  ]);

  if (!userId || !trade) return getError("Questo scambio non esiste");

  const permissions = await canUpdateTrade(data.tradeId, {
    userId,
    ...data,
    ...trade,
  });
  if (permissions.error) return getError(permissions.message);

  await db.transaction(async (tx) => {
    await updateTrade(data.tradeId, data.status, tx);

    if (data.status === "accepted") {
      await applyTradeChanges(data.players, trade, permissions.data, tx);
    }
  });

  return {
    error: false,
    message: `Scambio ${
      data.status === "accepted" ? "accettato" : "rifiutato"
    } con successo`,
  };
}

export const acceptTrade = updateTradeStatus;
export const rejectTrade = updateTradeStatus;

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

  await deleteTradeDb(data.leagueId, data.tradeId);

  return { error: false, message: "Scambio eliminato con successo" };
}

async function applyTradeChanges(
  players: { id: number; offeredByProposer: boolean }[],
  trade: Trade,
  credits: { proposerTeamCredits: number; receiverTeamCredits: number },
  tx: Omit<typeof db, "$client">
) {
  const grouped = groupTradePlayers(players);

  await movePlayersBetweenTeams(grouped, trade, tx);
  await updateTeamCredits(trade, credits, tx);
}

async function movePlayersBetweenTeams(
  grouped: ReturnType<typeof groupTradePlayers>,
  trade: Trade,
  tx: Omit<typeof db, "$client">
) {
  if (grouped.proposed?.length) {
    await deleteTeamPlayers(
      trade.leagueId,
      {
        memberTeamId: trade.proposerTeamId,
        playersIds: grouped.proposed.map(proposedPlayer => proposedPlayer.id),
      },
      tx
    );
    await insertTeamPlayers(
      trade.leagueId,
      grouped.proposed.map((proposedPlayer) => ({
        playerId: proposedPlayer.id,
        memberTeamId: trade.receiverTeamId,
        purchaseCost: 1,
      })),
      tx
    );
  }

  if (grouped.requested?.length) {
    await deleteTeamPlayers(
      trade.leagueId,
      {
        memberTeamId: trade.receiverTeamId,
        playersIds: grouped.requested.map(requestedPlayer => requestedPlayer.id),
      },
      tx
    );
    await insertTeamPlayers(
      trade.leagueId,
      grouped.requested.map((requested) => ({
        playerId: requested.id,
        memberTeamId: trade.proposerTeamId,
        purchaseCost: 1,
      })),
      tx
    );
  }
}

async function updateTeamCredits(
  trade: Trade,
  credits: { proposerTeamCredits: number; receiverTeamCredits: number },
  tx: Omit<typeof db, "$client">
) {
  const updates = [];

  if (trade.creditOfferedByProposer) {
    updates.push(
      updateLeagueTeam(
        trade.proposerTeamId,
        trade.leagueId,
        {
          credits: credits.proposerTeamCredits - trade.creditOfferedByProposer,
        },
        tx
      )
    );
  }

  if (trade.creditRequestedByProposer) {
    updates.push(
      updateLeagueTeam(
        trade.receiverTeamId,
        trade.leagueId,
        {
          credits:
            credits.receiverTeamCredits - trade.creditRequestedByProposer,
        },
        tx
      )
    );
  }

  for (const u of updates) await u;
}
