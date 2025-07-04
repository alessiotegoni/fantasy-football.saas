import Container from "@/components/Container";
import TeamsCreditsProvider from "@/contexts/TeamsCreditsProvider";
import LeagueTeamCardWithCredits from "@/features/(league)/(admin)/handle-credits/components/LeagueTeamCardWithCredits";
import ResetCreditsDialog from "@/features/(league)/(admin)/handle-credits/components/ResetCreditsDialog";
import UpdateCreditsButton from "@/features/(league)/(admin)/handle-credits/components/UpdateCreditsButton";
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
    <TeamsCreditsProvider>
      <Container
        leagueId={leagueId}
        headerLabel="Gestisci crediti"
        renderHeaderRight={() => (
          <div className="flex gap-2">
            <Suspense>
              <ResetCreditsDialog
                leagueId={leagueId}
                defaultCreditsPromise={getGeneralOptions(leagueId).then(
                  (options) => options?.initialCredits ?? 500
                )}
              />
            </Suspense>
            <UpdateCreditsButton leagueId={leagueId} />
          </div>
        )}
      >
        <div className="space-y-4">
          {leagueTeams.map((team) => (
            <LeagueTeamCardWithCredits
              key={team.id}
              leagueId={leagueId}
              team={team}
            />
          ))}
        </div>
      </Container>
    </TeamsCreditsProvider>
  );
}
