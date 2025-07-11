import Container from "@/components/Container";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import TradeProposalWrapper from "@/features/(league)/trades/components/TradeProposalWrapper";
import { getUUIdSchema, validateUUIds } from "@/schema/helpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams?: Promise<{
    proposerTeamId?: string;
    receiverTeamId?: string;
  }>;
};

export default async function TradeProposalPage({
  params,
  searchParams,
}: Props) {
  const { leagueId } = await params;

  return (
    <Container
      leagueId={leagueId}
      className="max-w-[1000px]"
      headerLabel="Proponi scambio"
    >
      <Suspense fallback={<p>loading...</p>}>
        <SuspenseBoundary leagueId={leagueId} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  searchParams,
}: {
  leagueId: string;
} & Pick<Props, "searchParams">) {
  const searchP = await searchParams;
  if (!searchP?.proposerTeamId) notFound();

  if (!validateUUIds(searchP).success) notFound();

  const leagueTeams = await getLeagueTeams(leagueId);

  const proposerTeam = leagueTeams.find(
    (team) => team.id === searchP.proposerTeamId
  );
  const receiverTeam = leagueTeams.find(
    (team) => team.id === searchP.receiverTeamId
  );

  const props = {
    leagueId: leagueId,
    leagueTeams: leagueTeams,
    proposerTeam: proposerTeam,
    receiverTeam: receiverTeam,
  };

  return (
    <Suspense fallback={<TradeProposalWrapper {...props} />}>
      <TradeProposalWrapper {...props} />
    </Suspense>
  );
}
