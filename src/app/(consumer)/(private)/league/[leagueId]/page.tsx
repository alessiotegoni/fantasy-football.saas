import {
  getLastEndedMatchday,
  getSplits,
  Split,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import {
  getLeagueTeams,
  LeagueTeam,
} from "@/features/league/teams/queries/leagueTeam";
import { Suspense } from "react";
import LeagueSwitcher from "@/features/league/leagues/components/LeagueSwitcher";
import TeamsCarousel from "@/features/league/teams/components/TeamsCarousel";
import Container from "@/components/Container";
import LeagueBanners from "@/features/league/overview/components/LeagueBanners";
import { getUserId } from "@/features/dashboard/user/utils/user";

export default async function LeagueOverviewPage({
  params,
}: PageProps<"/league/[leagueId]">) {
  const { leagueId } = await params;

  const [splits, leagueTeams] = await Promise.all([
    getSplits(),
    getLeagueTeams(leagueId),
  ]);

  const lastSplit = splits.at(-1);

  let lastEndedMatchday: SplitMatchday | undefined;
  if (lastSplit) {
    lastEndedMatchday = await getLastEndedMatchday(lastSplit.id);
  }

  return (
    <Container
      className="max-w-4xl"
      headerLabel="Home"
      headerRight={
        <Suspense>
          <LeagueSwitcher leagueId={leagueId} />
        </Suspense>
      }
    >
      <Suspense></Suspense>
      <div className="flex flex-col lg:flex-row">
        <div className="basis-2/3">dwdw</div>
        <div className="basis-1/3">
          <TeamsCarousel teams={leagueTeams} />
        </div>
      </div>
    </Container>
  );
}

async function SuspenseBoundary(props: {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  lastEndedMatchday?: SplitMatchday;
  lastSplit?: Split;
}) {
  const userId = await getUserId();
  if (!userId) return null;

  return (
    <>
      <LeagueBanners {...props} />
    </>
  );
}

// TODO: Banner con background dove all'interno possono essere mostrate info
// TODO: Sotto ultima giornata e prossima giornata (se l'ultima giornata c'e)
// TODO: accanto classifica non estesa (solo se se l'ultima giornata c'e)
