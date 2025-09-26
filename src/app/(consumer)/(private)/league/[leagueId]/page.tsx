import {
  getLastEndedMatchday,
  getSplits,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import { isAlreadyCalculated } from "@/features/league/admin/calculate-matchday/permissions/calculate-matchday";
import { getCalculation } from "@/features/league/admin/calculate-matchday/queries/calculate-matchday";
import { isMatchdayCalculable } from "@/features/league/admin/calculate-matchday/utils/calculate-matchday";
import { default as CalculateMatchday } from "@/features/league/admin/calculate-matchday/components/CalculateMatchdayBanner";
import { getLeagueTeams } from "@/features/league/teams/queries/leagueTeam";
import { Suspense } from "react";
import LeagueSwitcher from "@/features/league/leagues/components/LeagueSwitcher";
import TeamsCarousel from "@/features/league/teams/components/TeamsCarousel";
import Container from "@/components/Container";
import LeagueBanners from "@/features/league/overview/components/LeagueBanners";

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
      <Suspense>
        <LeagueBanners
          leagueId={leagueId}
          leagueTeams={leagueTeams}
          lastEndedMatchday={lastEndedMatchday}
          lastSplit={lastSplit}
        />
      </Suspense>
      <div className="flex flex-col lg:flex-row">
        <div className="basis-2/3">dwdw</div>
        <div className="basis-1/3">
          <TeamsCarousel teams={leagueTeams} />
        </div>
      </div>
    </Container>
  );
}

async function CalculateMatchdayBanner({
  leagueId,
  matchday,
}: {
  leagueId: string;
  matchday: SplitMatchday;
}) {
  if (
    !isMatchdayCalculable(matchday) ||
    (await isAlreadyCalculated(leagueId, matchday.id))
  ) {
    return null;
  }

  const calculation = await getCalculation(leagueId, matchday.id);

  return (
    <CalculateMatchday matchday={matchday} calculationId={calculation?.id} />
  );
}

// TODO: Banner con background dove all'interno possono essere mostrate info
// TODO: Accanto a banner carousel con tutti i team della lega (primo team da motrare e' il team dell'utente)
// TODO: Sotto ultima giornata e prossima giornata (se l'ultima giornata c'e)
// TODO: accanto classifica non estesa (solo se se l'ultima giornata c'e)
