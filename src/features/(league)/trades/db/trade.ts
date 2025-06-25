import { db } from "@/drizzle/db";
import {
  leagueTradeProposalPlayers,
  leagueTradeProposals,
  TradeProposalStatusType,
} from "@/drizzle/schema";
import { getErrorObject } from "@/lib/utils";
import { revalidateLeagueTradesCache } from "./cache/trade";
import { eq } from "drizzle-orm";
import { revalidateTeamPlayersCache } from "../../teamsPlayers/db/cache/teamsPlayer";
import { revalidateLeagueTeamsCache } from "../../teams/db/cache/leagueTeam";

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
  tradePlayers: (typeof leagueTradeProposalPlayers.$inferInsert)[],
  tx: Omit<typeof db, "$client"> = db
) {
  const res = await tx
    .insert(leagueTradeProposalPlayers)
    .values(tradePlayers)
    .returning();

  if (!res.length) throw new Error(getError().message);
}

export async function updateTrade(
  tradeId: string,
  status: TradeProposalStatusType,
  hasProposerTeamOfferedCredits: boolean,
  hasProposerTeamRequestedCredits: boolean
) {
  const [res] = await db
    .update(leagueTradeProposals)
    .set({ status })
    .where(eq(leagueTradeProposals.id, tradeId))
    .returning();

  if (!res.proposerTeamId) {
    throw new Error(
      getError("Errore nell'aggiornamento dello scambio").message
    );
  }

  revalidateLeagueTradesCache({
    leagueId: res.leagueId,
    tradeId,
  });

  if (status === "accepted") {
    revalidateTeamPlayersCache(res.proposerTeamId);
    revalidateTeamPlayersCache(res.receiverTeamId);

    if (hasProposerTeamOfferedCredits) {
      revalidateLeagueTeamsCache({
        teamId: res.proposerTeamId,
        leagueId: res.leagueId,
      });
    }

    if (hasProposerTeamRequestedCredits) {
      revalidateLeagueTeamsCache({
        teamId: res.receiverTeamId,
        leagueId: res.leagueId,
      });
    }
  }

  return res.id;
}

export async function deleteTrade(
  leagueId: string,
  tradeId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const [res] = await tx
    .delete(leagueTradeProposals)
    .where(eq(leagueTradeProposals.id, tradeId))
    .returning();

  if (!res.id) {
    throw new Error(getError("Errore nell'eliminazione dello scambio").message);
  }

  revalidateLeagueTradesCache({ leagueId, tradeId });

  return res;
}

export async function deleteTradePlayers(
  tradeId: string,
  tx: Omit<typeof db, "$client"> = db
) {
  const res = await tx
    .delete(leagueTradeProposalPlayers)
    .where(eq(leagueTradeProposalPlayers.tradeProposalId, tradeId))
    .returning();

  if (!res.length) {
    throw new Error(getError("Errore nell'eliminazione dello scambio").message);
  }
}
