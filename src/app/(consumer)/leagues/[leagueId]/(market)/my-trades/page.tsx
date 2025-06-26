import TradesList from "@/features/(league)/trades/components/TradesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import Container from "@/components/Container";
import TradeProposalButton from "@/features/(league)/trades/components/TradeProposalButton";
import { getUserId } from "@/features/users/utils/user";
import { getUserTeamId } from "@/features/users/queries/user";
import { redirect } from "next/navigation";

export default async function MyTradesPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <Suspense fallback={<TradesPageSkeleton />}>
      <TradesPageContent leagueId={leagueId} />
    </Suspense>
  );
}

async function TradesPageContent({ leagueId }: { leagueId: string }) {
  const userId = await getUserId();
  if (!userId) return null;

  const userTeamId = await getUserTeamId(userId, leagueId);
  if (!userTeamId) redirect(`/leagues/${leagueId}/teams/create`);

  return (
    <Container
      leagueId={leagueId}
      headerLabel="I miei scambi"
      renderHeaderRight={() => (
        <div className="fixed bottom-[99px] left-1/2 -translate-x-1/2 w-full px-4 sm:px-0 sm:static sm:translate-none sm:w-fit">
          <TradeProposalButton
            leagueId={leagueId}
            userTeamId={userTeamId}
            className="mt-0 w-full sm:w-fit"
          />
        </div>
      )}
    >
      <Tabs defaultValue="proposed" className="max-w-[700px] mx-auto">
        <TabsList>
          <TabsTrigger value="proposed">Proposte inviate</TabsTrigger>
          <TabsTrigger value="received">Proposte ricevute</TabsTrigger>
        </TabsList>

        <TabsContent value="proposed">
          <Suspense>
            <TradesList
              leagueId={leagueId}
              userTeamId={userTeamId}
              type="proposed"
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
              userTeamId={userTeamId}
              type="received"
              emptyState={{
                description:
                  "Non hai ancora ricevuto proposte di scambio da altre squadre",
              }}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </Container>
  );
}

function TradesPageSkeleton() {
  return (
    <Container
      leagueId=""
      headerLabel="I miei scambi"
      renderHeaderRight={() => (
        <div className="w-32 h-10 bg-gray-200 animate-pulse rounded" />
      )}
    >
      <div className="max-w-[700px] mx-auto">
        <div className="flex space-x-1 mb-6">
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded" />
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-full h-24 bg-gray-200 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
