import Container from "@/components/Container";
import TeamsCreditsProvider from "@/contexts/TeamsCreditsProvider";
import LeagueTeamCardWithCredits from "@/features/(league)/(admin)/handle-credits/components/LeagueTeamCardWithCredits";
import ResetCreditsDialog from "@/features/(league)/(admin)/handle-credits/components/ResetCreditsDialog";
import { getGeneralOptions } from "@/features/(league)/options/queries/leagueOptions";
import { getLeagueTeams } from "@/features/(league)/teams/queries/leagueTeam";
import { Suspense } from "react";

export default async function HandleCreditsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const leagueTeams = await getLeagueTeams(leagueId);

  return (
    <Container
      leagueId={leagueId}
      headerLabel="Gestisci crediti"
      renderHeaderRight={() => (
        <Suspense>
          <ResetCreditsDialog
            leagueId={leagueId}
            defaultCreditsPromise={getGeneralOptions(leagueId).then(
              (options) => options?.initialCredits ?? 500
            )}
          />
        </Suspense>
      )}
    >
      <TeamsCreditsProvider>
        <div className="space-y-4">
          {leagueTeams.map((team) => (
            <LeagueTeamCardWithCredits
              key={team.id}
              leagueId={leagueId}
              team={team}
            />
          ))}
        </div>
      </TeamsCreditsProvider>
    </Container>
  );
}
