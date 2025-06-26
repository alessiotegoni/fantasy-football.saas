import Container from "@/components/Container";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import TradeProposalWrapper from "@/features/(league)/trades/components/TradeProposalWrapper";
import { getUUIdSchema } from "@/schema/helpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParamsarams?: Promise<{
    proposerTeamId?: string;
    receiverTeamId?: string;
  }>;
};

export default async function TradeProposalPage({
  params,
  searchParamsarams,
}: Props) {
  const [{ leagueId }, searchParams] = await Promise.all([
    params,
    searchParamsarams,
  ]);
  if (!searchParams?.proposerTeamId) notFound();

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
  searchParams: { proposerTeamId?: string; receiverTeamId?: string };
}) {
  const idsValidations = Object.values(searchParams).map((teamId) =>
    getUUIdSchema("Id del team invalido").safeParse(teamId)
  );
  if (idsValidations.some((validation) => !validation.success)) notFound();

  const leagueTeams = await getLeagueTeams(leagueId);

  const proposerTeam = leagueTeams.find(
    (team) => team.id === searchParams.proposerTeamId
  );
  const receiverTeam = leagueTeams.find(
    (team) => team.id === searchParams.receiverTeamId
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
