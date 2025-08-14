import Container from "@/components/Container";
import TeamsCreditsProvider from "@/contexts/TeamsCreditsProvider";
import AddCreditsDialog from "@/features/(league)/(admin)/handle-credits/components/AddCreditsDialog";
import LeagueTeamCardWithCredits from "@/features/(league)/(admin)/handle-credits/components/LeagueTeamCardWithCredits";
import ResetCreditsDialog from "@/features/(league)/(admin)/handle-credits/components/ResetCreditsDialog";
import UpdateCreditsButton from "@/features/(league)/(admin)/handle-credits/components/UpdateCreditsButton";
import { getGeneralSettings } from "@/features/(league)/settings/queries/setting";
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
        renderHeaderRight={() => <HeaderRightButtons leagueId={leagueId} />}
      >
        <div className="space-y-4 pb-16 sm:pb-0">
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

function HeaderRightButtons({ leagueId }: { leagueId: string }) {
  const generalSettings = getGeneralSettings(leagueId);

  return (
    <div className="flex gap-2">
      <AddCreditsDialog leagueId={leagueId} />
      <Suspense>
        <ResetCreditsDialog
          leagueId={leagueId}
          defaultCreditsPromise={generalSettings.then(
            (settings) => settings.initialCredits
          )}
        />
      </Suspense>
      <UpdateCreditsButton leagueId={leagueId} />
    </div>
  );
}
