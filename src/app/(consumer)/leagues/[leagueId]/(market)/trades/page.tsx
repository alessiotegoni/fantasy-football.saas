import Container from "@/components/Container";
import { db } from "@/drizzle/db";
import { getTeamIdTag } from "@/features/(league)/teams/db/cache/leagueTeam";
import TradesList from "@/features/(league)/trades/components/TradesList";
import { getLeagueTradesTag } from "@/features/(league)/trades/db/cache/trade";
import { getPlayersIdTag } from "@/features/players/db/cache/player";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";

export default async function LeagueTradesPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <Container leagueId={leagueId} headerLabel="Scambi della lega">
      <Suspense>
        <TradesList leagueId={leagueId} getTrades={getLeagueTrades} />
      </Suspense>
    </Container>
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
