import Container from "@/components/Container";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
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
}: PageProps<"/league/[leagueId]/admin/handle-credits">) {
  const { leagueId } = await params;
  const leagueTeams = await getLeagueTeams(leagueId);

  return (
    <TeamsCreditsProvider>
      <Container
        leagueId={leagueId}
        headerLabel="Gestisci crediti"
        renderHeaderRight={() => (
          <Suspense>
            <HeaderRightButtons leagueId={leagueId} />
          </Suspense>
        )}
      >
        <div className="space-y-4 pb-28 sm:pb-0">
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

async function HeaderRightButtons(props: { leagueId: string }) {
  const generalSettings = await getGeneralSettings(props.leagueId);

  return (
    <div className="flex gap-2">
      <MobileButtonsContainer className="flex flex-col-reverse sm:flex-row gap-2">
        <UpdateCreditsButton {...props} />
        <AddCreditsDialog {...props} {...generalSettings} />
      </MobileButtonsContainer>
      <ResetCreditsDialog {...props} {...generalSettings} />
    </div>
  );
}
