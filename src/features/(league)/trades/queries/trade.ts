import { db } from "@/drizzle/db";
import {
  leagueTradeProposalPlayers,
  leagueTradeProposals,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getLeagueTradesTag,
  getMyProposedTradesTag,
  getMyReceivedProposedTradesTag,
  getTradeIdTag,
  getTradePlayersIdTag,
} from "../db/cache/trade";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";
import { getPlayersIdTag } from "@/features/players/db/cache/player";
import { TradeContext } from "../components/TradesList";

export async function getUserTrades(
  leagueId: string,
  userTeamId: string,
  type: Exclude<TradeContext, "league">
) {
  "use cache";

  const cacheKey =
    type === "sent"
      ? getMyProposedTradesTag(userTeamId)
      : getMyReceivedProposedTradesTag(userTeamId);

  cacheTag(getLeagueTradesTag(leagueId), cacheKey);

  const whereCondition =
    type === "sent"
      ? and(
          eq(leagueTradeProposals.leagueId, leagueId),
          eq(leagueTradeProposals.proposerTeamId, userTeamId)
        )
      : and(
          eq(leagueTradeProposals.leagueId, leagueId),
          eq(leagueTradeProposals.receiverTeamId, userTeamId)
        );

  const trades = await db.query.leagueTradeProposals.findMany({
    columns: {
      leagueId: false,
    },
    with: {
      proposerTeam: {
        columns: {
          name: true,
          managerName: true,
          imageUrl: true,
        },
      },
      receiverTeam: {
        columns: {
          name: true,
          managerName: true,
          imageUrl: true,
        },
      },
      proposedPlayers: {
        columns: {
          playerId: true,
          offeredByProposer: true,
        },
        with: {
          player: {
            columns: {
              avatarUrl: true,
            },
          },
        },
      },
    },
    where: whereCondition,
  });

  cacheTag(
    ...trades.flatMap((trade) => [
      getTeamIdTag(trade.proposerTeamId),
      getTeamIdTag(trade.receiverTeamId),
    ]),
    ...trades.flatMap((trade) =>
      trade.proposedPlayers.map((player) => getPlayersIdTag(player.playerId))
    )
  );

  return trades;
}

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

export type Trades = Awaited<ReturnType<typeof getUserTrades>>;
export type Trade = Awaited<ReturnType<typeof getTrade>>;
