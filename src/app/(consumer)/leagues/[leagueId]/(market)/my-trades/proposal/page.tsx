import Container from "@/components/Container";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { getTeamPlayers } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import TradeProposalForm from "@/features/(league)/trades/components/TradeProposalForm";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams?: Promise<{ proposerTeamId?: string; receiverTeamId?: string }>;
};

export default async function TradeProposalPage(props: Props) {
  return (
    <Container className="max-w-[1000px]" headerLabel="Proponi scambio">
      <Suspense>
        <SuspenseBoundary {...props} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({ params, searchParams }: Props) {
  const [{ leagueId }, searchP] = await Promise.all([params, searchParams]);
  if (!searchP?.proposerTeamId) notFound();

  const leagueTeams = await getLeagueTeams(leagueId);
  const teamsPlayers = searchP.receiverTeamId ? await getTeamPlayers()

  return (
    <TradeProposalForm
      leagueId={leagueId}
      leagueTeams={leagueTeams}
    />
  );
}
