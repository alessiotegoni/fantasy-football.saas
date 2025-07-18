"use server";

import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";
import { getUserId } from "@/features/users/utils/user";
import { createError, createSuccess } from "@/lib/helpers";
import {
  deleteTrade as deleteTradeDb,
  insertTrade,
  insertTradePlayers,
  updateTrade,
} from "../db/trade";
import {
  createTradeProposalSchema,
  deleteTradeProposalSchema,
  updateTradeProposalSchema,
  type CreateTradeProposalSchema,
  type DeleteTradeProposalSchema,
  type UpdateTradeProposalSchema,
} from "../schema/trade";
import {
  canCreateTrade,
  canDeleteTrade,
  canUpdateTrade,
  getInvalidPlayersIds,
} from "../permissions/trade";
import { getTrade, type Trade } from "../queries/trade";
import { updateLeagueTeam } from "../../teams/db/leagueTeam";
import {
  deleteTeamPlayers,
  insertTeamPlayers,
} from "../../teamsPlayers/db/teamsPlayer";
import { groupTradePlayers } from "../utils/trade";
import { validateSchema, VALIDATION_ERROR } from "@/schema/helpers";
import {
  leagueTradeProposals,
  leagueTradeProposalPlayers,
} from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { after } from "next/server";

type TradeCredits = {
  proposerTeamCredits: number;
  receiverTeamCredits: number;
};

type TradePlayer = {
  id: number;
  offeredByProposer: boolean;
};

type TradeExecutionContext = {
  players: TradePlayer[];
  trade: Trade;
  credits: TradeCredits;
  tx: Omit<typeof db, "$client">;
};

enum TRADE_MESSAGES {
  UPDATE_ERROR = "Errore nell'aggiornamento dello stato dello scambio",
  DELETE_ERROR = "Errore nell'eliminazione dello scambio",
  TRADE_NOT_FOUND = "Questo scambio non esiste piu",
  TRADE_ACCEPTED = "Scambio accettato con successo",
  TRADE_REJECTED = "Scambio rifiutato con successo",
  TRADE_DELETED = "Scambio eliminato con successo",
}

export async function createTrade(values: CreateTradeProposalSchema) {
  const { isValid, error, data } = validateSchema<CreateTradeProposalSchema>(
    createTradeProposalSchema,
    values
  );
  if (!isValid) return error;

  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const { players, ...trade } = data;

  const permissions = await canCreateTrade({
    userId,
    ...data,
  });
  if (permissions.error) return createError(permissions.message);

  await executeTradeCreation(trade, players);
  redirect(`/leagues/${data.leagueId}/my-trades`);
}

async function executeTradeCreation(
  trade: Omit<CreateTradeProposalSchema, "players">,
  players: { id: number; offeredByProposer: boolean }[]
) {
  await db.transaction(async (tx) => {
    const tradeProposalId = await insertTrade(trade, tx);

    const tradePlayers = players.map(({ id, offeredByProposer }) => ({
      playerId: id,
      tradeProposalId,
      offeredByProposer,
    }));

    await insertTradePlayers(tradePlayers, tx);
  });
}

async function updateTradeStatus(values: UpdateTradeProposalSchema) {
  const { isValid, error, data } = validateSchema<UpdateTradeProposalSchema>(
    updateTradeProposalSchema,
    values
  );
  if (!isValid) return error;

  const [userId, trade] = await Promise.all([
    getUserId(),
    getTrade(data.tradeId),
  ]);

  if (!userId || !trade) {
    return createError(TRADE_MESSAGES.TRADE_NOT_FOUND);
  }

  const permissions = await canUpdateTrade(
    trade.id,
    data.status === "accepted",
    {
      userId,
      ...data,
      ...trade,
    }
  );
  if (permissions.error) return createError(permissions.message);

  await executeTradeUpdate(data, trade, permissions.data);
  after(deleteInvalidTrades.bind(null, { ...trade, players: data.players }));

  const isAccepted = data.status === "accepted";
  return createSuccess(
    isAccepted ? TRADE_MESSAGES.TRADE_ACCEPTED : TRADE_MESSAGES.TRADE_REJECTED,
    null
  );
}

async function executeTradeUpdate(
  data: UpdateTradeProposalSchema,
  trade: Trade,
  credits: TradeCredits
) {
  await db.transaction(async (tx) => {
    await updateTrade(data.tradeId, data.status, tx);

    if (data.status === "accepted") {
      await applyTradeChanges({
        players: data.players,
        trade,
        credits,
        tx,
      });
    }
  });
}

async function deleteInvalidTrades(data: CreateTradeProposalSchema) {
  const invalidTradesIds = await getInvalidTradesIds(data);
  if (!invalidTradesIds.length) return;

  await deleteTradeDb(data.leagueId, invalidTradesIds);
}

export async function deleteTrade(values: DeleteTradeProposalSchema) {
  const { isValid, error, data } = validateSchema<DeleteTradeProposalSchema>(
    deleteTradeProposalSchema,
    values
  );
  if (!isValid) return error;

  const [userId, trade] = await Promise.all([
    getUserId(),
    getTrade(data.tradeId),
  ]);

  if (!userId || !trade) {
    return createError(TRADE_MESSAGES.TRADE_NOT_FOUND);
  }

  const permissions = await canDeleteTrade({
    userId,
    ...data,
    ...trade,
  });
  if (permissions.error) return createError(permissions.message);

  await deleteTradeDb(data.leagueId, [data.tradeId]);

  return {
    error: false,
    message: TRADE_MESSAGES.TRADE_DELETED,
  };
}

async function applyTradeChanges(context: TradeExecutionContext) {
  const grouped = groupTradePlayers(context.players);

  await Promise.all([
    movePlayersBetweenTeams(grouped, context.trade, context.tx),
    updateTeamCredits(context.trade, context.credits, context.tx),
  ]);
}

async function movePlayersBetweenTeams(
  grouped: ReturnType<typeof groupTradePlayers>,
  trade: Trade,
  tx: Omit<typeof db, "$client">
) {
  const operations = [];

  if (grouped.proposed?.length) {
    operations.push(
      movePlayersToTeam({
        players: grouped.proposed,
        fromTeamId: trade.proposerTeamId,
        toTeamId: trade.receiverTeamId,
        leagueId: trade.leagueId,
        tx,
      })
    );
  }

  if (grouped.requested?.length) {
    operations.push(
      movePlayersToTeam({
        players: grouped.requested,
        fromTeamId: trade.receiverTeamId,
        toTeamId: trade.proposerTeamId,
        leagueId: trade.leagueId,
        tx,
      })
    );
  }

  await Promise.all(operations);
}

async function movePlayersToTeam({
  players,
  fromTeamId,
  toTeamId,
  leagueId,
  tx,
}: {
  players: TradePlayer[];
  fromTeamId: string;
  toTeamId: string;
  leagueId: string;
  tx: Omit<typeof db, "$client">;
}) {
  const playerIds = players.map((player) => player.id);

  await deleteTeamPlayers(
    leagueId,
    { memberTeamId: fromTeamId, playersIds: playerIds },
    tx
  );

  const newTeamPlayers = players.map((player) => ({
    playerId: player.id,
    memberTeamId: toTeamId,
    purchaseCost: 1,
  }));

  await insertTeamPlayers(leagueId, newTeamPlayers, tx);
}

async function updateTeamCredits(
  trade: Trade,
  credits: TradeCredits,
  tx: Omit<typeof db, "$client">
) {
  const { creditOfferedByProposer, creditRequestedByProposer } = trade;

  if (!creditOfferedByProposer && !creditRequestedByProposer) {
    return;
  }

  let proposerCredits = credits.proposerTeamCredits;
  let receiverCredits = credits.receiverTeamCredits;

  if (creditOfferedByProposer) {
    proposerCredits -= creditOfferedByProposer;
    receiverCredits += creditOfferedByProposer;
  }

  if (creditRequestedByProposer) {
    proposerCredits += creditRequestedByProposer;
    receiverCredits -= creditRequestedByProposer;
  }

  await Promise.all([
    updateLeagueTeam(
      [trade.proposerTeamId],
      trade.leagueId,
      { credits: proposerCredits },
      tx
    ),
    updateLeagueTeam(
      [trade.receiverTeamId],
      trade.leagueId,
      { credits: receiverCredits },
      tx
    ),
  ]);
}

export const acceptTrade = updateTradeStatus;
export const rejectTrade = updateTradeStatus;

async function getInvalidTradesIds(data: CreateTradeProposalSchema) {
  const invalidPlayersIds = await getInvalidPlayersIds(data);
  if (!invalidPlayersIds.length) return [];

  const invalidTrades = await db
    .select({ id: leagueTradeProposals.id })
    .from(leagueTradeProposals)
    .innerJoin(
      leagueTradeProposalPlayers,
      eq(leagueTradeProposalPlayers.tradeProposalId, leagueTradeProposals.id)
    )
    .where(
      and(
        eq(leagueTradeProposals.status, "pending"),
        inArray(leagueTradeProposalPlayers.playerId, invalidPlayersIds)
      )
    );

  return invalidTrades.map((trade) => trade.id);
}
