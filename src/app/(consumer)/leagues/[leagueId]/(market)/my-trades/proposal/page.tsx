import Container from "@/components/Container";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import TradeProposalWrapper from "@/features/(league)/trades/components/TradeProposalWrapper";
import { getUUIdSchema } from "@/schema/helpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams?: Promise<{ proposerTeamId?: string; receiverTeamId?: string }>;
};

export default async function TradeProposalPage(props: Props) {
  return (
    <Container className="max-w-[1000px]" headerLabel="Proponi scambio">
      <Suspense fallback={<p>loading...</p>}>
        <SuspenseBoundary {...props} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({ params, searchParams }: Props) {
  const [{ leagueId }, searchP] = await Promise.all([params, searchParams]);
  if (!searchP?.proposerTeamId) notFound();

  const idsValidations = Object.values(searchP).map((teamId) =>
    getUUIdSchema("Id del team invalido").safeParse(teamId)
  );
  if (idsValidations.some((validation) => !validation.success)) notFound();

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
