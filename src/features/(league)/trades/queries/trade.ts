import { db } from "@/drizzle/db";
import {
  leagueTradeProposalPlayers,
  leagueTradeProposals,
} from "@/drizzle/schema";
import { and, eq, ne, or, SQL } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getLeagueTradesTag,
  getMyProposedTradesTag,
  getMyReceivedProposedTradesTag,
  getNotMineTradesTag,
  getTradeIdTag,
  getTradePlayersIdTag,
} from "../db/cache/trade";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";
import { getPlayerIdTag } from "@/features/dashboard/admin/players/db/cache/player";
import { TradeContext } from "../components/TradesList";

export async function getUserTrades(
  leagueId: string,
  userTeamId: string,
  type: TradeContext
) {
  "use cache";

  const myTradeTag =
    type === "sent"
      ? getMyProposedTradesTag(userTeamId)
      : getMyReceivedProposedTradesTag(userTeamId);

  cacheTag(getLeagueTradesTag(leagueId), myTradeTag);

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

  const trades = await getBaseTradesQuery(whereCondition);
  cacheTag(...getTradesTeamsTags(trades), ...getTradesPlayersTags(trades));

  return trades;
}

export async function getLeagueTrades(leagueId: string, userTeamId: string) {
  "use cache";
  cacheTag(getNotMineTradesTag(userTeamId), getLeagueTradesTag(leagueId));

  const whereCondition = and(
    eq(leagueTradeProposals.leagueId, leagueId),
    and(
      ne(leagueTradeProposals.proposerTeamId, userTeamId),
      ne(leagueTradeProposals.receiverTeamId, userTeamId)
    )
  );

  const trades = await getBaseTradesQuery(whereCondition);
  cacheTag(...getTradesTeamsTags(trades), ...getTradesPlayersTags(trades));

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

function getBaseTradesQuery(whereCondition: SQL | undefined) {
  return db.query.leagueTradeProposals.findMany({
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
          offeredByProposer: true,
        },
        with: {
          player: {
            with: {
              team: true,
              role: true,
            },
          },
        },
      },
    },
    where: whereCondition,
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });
}

function getTradesTeamsTags(trades: Trades) {
  return trades.flatMap((trade) => [
    getTeamIdTag(trade.proposerTeamId),
    getTeamIdTag(trade.receiverTeamId),
  ]);
}
function getTradesPlayersTags(trades: Trades) {
  return trades.flatMap((trade) =>
    trade.proposedPlayers.map(({ player }) => getPlayerIdTag(player.id))
  );
}

export type Trades = Awaited<ReturnType<typeof getBaseTradesQuery>>;
export type Trade = Awaited<ReturnType<typeof getTrade>>;
