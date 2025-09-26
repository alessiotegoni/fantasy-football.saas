import Container from "@/components/Container";
import TeamsList from "@/features/league/teams/components/TeamsList";
import { getLeagueTeams } from "@/features/league/teams/queries/leagueTeam";
import { getUserId } from "@/features/dashboard/user/utils/user";
import { Suspense } from "react";
import TeamsEmptyState from "@/features/league/teams/components/TeamsEmptyState";

export default async function LeagueTeamsPage({
  params,
}: PageProps<"/league/[leagueId]/teams">) {
  const { leagueId } = await params;
  const leagueTeams = await getLeagueTeams(leagueId);

  return (
    <Container headerLabel="Squadre" className="max-w-[900px]">
      {!leagueTeams.length ? (
        <TeamsEmptyState />
      ) : (
        <Suspense
          fallback={<TeamsList teams={leagueTeams} leagueId={leagueId} />}
        >
          <SuspenseBoundary teams={leagueTeams} leagueId={leagueId} />
        </Suspense>
      )}
    </Container>
  );
}

async function SuspenseBoundary(props: {
  teams: Awaited<ReturnType<typeof getLeagueTeams>>;
  leagueId: string;
}) {
  const userId = await getUserId();

  return <TeamsList {...props} userId={userId} />;
}
