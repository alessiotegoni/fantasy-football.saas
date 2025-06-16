import { db } from "@/drizzle/db";
import TradesList from "@/features/(league)/trades/components/TradesList";
import { getLeagueTradesTag } from "@/features/(league)/trades/db/cache/trade";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";

export default async function LeagueTradesPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  return (
    <Suspense>
      <TradesList
        leagueIdPromise={params.then((p) => p.leagueId)}
        getTrades={getLeagueTrades}
      />
    </Suspense>
  );
}

async function getLeagueTrades(leagueId: string, userTeamId: string) {
  "use cache";
  cacheTag(getLeagueTradesTag(leagueId));

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
      proposalPlayers: {
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
    where: (trade, { and, or, eq, ne }) =>
      and(
        eq(trade.leagueId, leagueId),
        or(
          ne(trade.proposerTeamId, userTeamId),
          ne(trade.receiverTeamId, userTeamId)
        )
      ),
  });

  cacheTag(
    ...trades.flatMap((trade) => [trade.proposerTeamId, trade.receiverTeamId]),
    ...trades.flatMap((trade) =>
      trade.proposalPlayers.map((player) => player.playerId)
    )
  );

  return trades;
}
