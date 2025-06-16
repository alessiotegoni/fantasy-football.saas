import { db } from "@/drizzle/db";
import { getLeagueTradeTag } from "@/features/(league)/trades/db/cache/trade";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function LeagueTradesPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  return (
    <Suspense>
      <SuspenseBoundary leagueIdPromise={params.then((p) => p.leagueId)} />
    </Suspense>
  );
}

async function SuspenseBoundary({
  leagueIdPromise,
}: {
  leagueIdPromise: Promise<string>;
}) {
  const [leagueId, userId] = await Promise.all([leagueIdPromise, getUserId()]);

  if (!userId) return;

  const userTeamId = await getUserTeamId({ leagueId, userId });
  if (!userTeamId) redirect(`/leagues/${leagueId}/teams/create`);

  const trades = await getLeagueTrades(leagueId, userTeamId);

  return <></>;
}

async function getLeagueTrades(leagueId: string, userTeamId: string) {
  "use cache";
  cacheTag(getLeagueTradeTag(leagueId));

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
    ...trades
      .flatMap((trade) => trade.proposalPlayers.map((player) => player.playerId))
  );

  return trades;
}
