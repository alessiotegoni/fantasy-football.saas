import {
  getLastEndedMatchday,
  getSplits,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import { isAlreadyCalculated } from "@/features/league/admin/calculate-matchday/permissions/calculate-matchday";
import { getCalculation } from "@/features/league/admin/calculate-matchday/queries/calculate-matchday";
import { isMatchdayCalculable } from "@/features/league/admin/calculate-matchday/utils/calculate-matchday";
import InviteMembersBanner from "@/features/league/members/components/InviteMembersBanner";
import { default as CalculateMatchday } from "@/features/league/admin/calculate-matchday/components/CalculateMatchdayBanner";
import OverviewContainer from "@/features/league/overview/components/OverviewContainer";
import { getLeagueTeams } from "@/features/league/teams/queries/leagueTeam";
import { Suspense } from "react";
import { hasGeneratedCalendar } from "@/features/league/admin/calendar/regular/permissions/calendar";
import GenerateCalendarBanner from "@/features/league/admin/calendar/regular/components/GenerateCalendarBanner";
import { Skeleton } from "@/components/ui/skeleton";
import LeagueSwitcher from "@/features/league/leagues/components/LeagueSwitcher";

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
    <OverviewContainer
      headerRight={
        <Suspense fallback={<Skeleton className="h-10 w-[180px]" />}>
          <LeagueSwitcher leagueId={leagueId} />
        </Suspense>
      }
    >
      <div className="space-y-4">
        {leagueTeams.length < 4 && <InviteMembersBanner />}
        {lastEndedMatchday?.status === "ended" && (
          <Suspense>
            <CalculateMatchdayBanner
              matchday={lastEndedMatchday}
              leagueId={leagueId}
            />
          </Suspense>
        )}
        {lastSplit?.status === "upcoming" && (
          <Suspense>
            {!(await hasGeneratedCalendar(leagueId, lastSplit.id)) && (
              <GenerateCalendarBanner leagueId={leagueId} />
            )}
          </Suspense>
        )}
      </div>
    </OverviewContainer>
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
