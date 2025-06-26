import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import TradesEmptyState from "./TradesEmptyState";
import { getTeamIdTag } from "../../teams/db/cache/leagueTeam";
import { getPlayersIdTag } from "@/features/players/db/cache/player";
import {
  getLeagueTradesTag,
  getMyProposedTradesTag,
  getMyReceivedProposedTradesTag,
} from "../db/cache/trade";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { leagueTradeProposals } from "@/drizzle/schema";

type Props = {
  leagueId: string;
  userTeamId: string;
  type: "proposed" | "received";
  emptyState?: {
    title?: string;
    description?: string;
  };
};

export default async function TradesList({
  leagueId,
  userTeamId,
  type,
  emptyState,
}: Props) {
  const trades = await getUserTrades(leagueId, userTeamId, type);

  if (!trades.length) {
    return (
      <TradesEmptyState
        {...emptyState}
        leagueId={leagueId}
        userTeamId={userTeamId}
      />
    );
  }

  // // Renderizza la lista dei trade
  // return (
  //   <div className="space-y-4">
  //     {trades.map((trade) => (
  //       <TradeCard key={trade.id} trade={trade} />
  //     ))}
  //   </div>
  // );
}

async function getUserTrades(
  leagueId: string,
  userTeamId: string,
  type: "proposed" | "received"
) {
  "use cache";

  const cacheKey =
    type === "proposed"
      ? getMyProposedTradesTag(userTeamId)
      : getMyReceivedProposedTradesTag(userTeamId);

  cacheTag(getLeagueTradesTag(leagueId), cacheKey);

  const whereCondition =
    type === "proposed"
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
