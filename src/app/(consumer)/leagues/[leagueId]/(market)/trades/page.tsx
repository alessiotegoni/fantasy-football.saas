import Container from "@/components/Container";
import TradesList from "@/features/(league)/trades/components/TradesList";
import { getLeagueTrades } from "@/features/(league)/trades/queries/trade";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
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
        <SuspendedComponent leagueId={leagueId} />
      </Suspense>
    </Container>
  );
}

async function SuspendedComponent({ leagueId }: { leagueId: string }) {
  const userId = await getUserId();
  if (!userId) return;

  const userTeamId = await getUserTeamId(userId, leagueId);

  return (
    <TradesList
      leagueId={leagueId}
      getTrades={getLeagueTrades}
      userTeamId={userTeamId}
      context="league"
      emptyState={{
        description:
          "Non sono ancora state effetuate proposte di scambio in questa lega, le proposte che riguardano la tua squadra saranno mostrate nella sezione 'I miei scambi'",
      }}
    />
  );
}
