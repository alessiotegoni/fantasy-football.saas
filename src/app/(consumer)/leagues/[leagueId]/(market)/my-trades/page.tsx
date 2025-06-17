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
import Link from "next/link";
import { ArrowLeft } from "iconoir-react";

export default async function MyTradesPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <div className="flex items-center mb-4 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">I miei scambi</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        I miei scambi
      </h2>

      <Tabs defaultValue="proposed" className="max-w-[700px] mx-auto">
        <TabsList>
          <TabsTrigger value="proposed">Proposte inviate</TabsTrigger>
          <TabsTrigger value="received">Proposte ricevute</TabsTrigger>
        </TabsList>
        <TabsContent value="proposed">
          <Suspense>
            <TradesList
              leagueId={leagueId}
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
              leagueId={leagueId}
              getTrades={getMyReceivedProposedTrades}
              emptyState={{
                description:
                  "Non hai ancora ricevuto proposte di scambio da altre squadre",
              }}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
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
