import { db } from "@/drizzle/db";
import TradesList from "@/features/(league)/trades/components/TradesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getLeagueTradesTag,
  getMyProposedTradesTag,
  getMyReceivedProposedTradesTag,
} from "@/features/(league)/trades/db/cache/trade";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

export default async function MyTradesPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const leagueIdPromise = params.then((p) => p.leagueId);

  return (
    <Tabs defaultValue="proposed" className="max-w-[700px] mx-auto">
      <TabsList>
        <TabsTrigger value="proposed">Proposte inviate</TabsTrigger>
        <TabsTrigger value="received">Proposte ricevute</TabsTrigger>
      </TabsList>
      <TabsContent value="proposed">
        <Suspense>
          <TradesList
            leagueIdPromise={leagueIdPromise}
            getTrades={getMyProposedTrades}
            emptyState={{
              description:
                "Non hai ancora fatto proposte di scambio ad altre squadre",
            }}
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="received">
        <Suspense>
          <TradesList
            leagueIdPromise={leagueIdPromise}
            getTrades={getMyReceivedProposedTrades}
            emptyState={{
              description:
                "Non hai ancora ricevuto proposte di scambio da altre squadre",
            }}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}

async function getMyProposedTrades(leagueId: string, userTeamId: string) {
  "use cache";
  cacheTag(getLeagueTradesTag(leagueId), getMyProposedTradesTag(userTeamId));

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
    where: (trade, { and, eq }) =>
      and(eq(trade.leagueId, leagueId), eq(trade.proposerTeamId, userTeamId)),
  });

  cacheTag(
    ...trades.flatMap((trade) => [trade.proposerTeamId, trade.receiverTeamId]),
    ...trades.flatMap((trade) =>
      trade.proposalPlayers.map((player) => player.playerId)
    )
  );

  return trades;
}

async function getMyReceivedProposedTrades(
  leagueId: string,
  userTeamId: string
) {
  "use cache";
  cacheTag(
    getLeagueTradesTag(leagueId),
    getMyReceivedProposedTradesTag(userTeamId)
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
    where: (trade, { and, eq }) =>
      and(eq(trade.leagueId, leagueId), eq(trade.receiverTeamId, userTeamId)),
  });

  cacheTag(
    ...trades.flatMap((trade) => [trade.proposerTeamId, trade.receiverTeamId]),
    ...trades.flatMap((trade) =>
      trade.proposalPlayers.map((player) => player.playerId)
    )
  );

  return trades;
}
