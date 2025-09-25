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
    <OverviewContainer>
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

// TODO: Banner crea calendario: se l'ultima giornata non e' ancora stata calcolata

// TODO: Banner match della giornata corrente: se c'e un match (e quindi una giornata) in corso
// TODO: Banner match della giornata vinta: se c'e un match vinto e la giornata e' terminata
// TODO: Banner match della giornata persa: se c'e un match perso e la giornata e' terminata
// TODO: Banner match della giornata in arrivo: se c'e un match successivo e la giornata non e' live

// TODO: Classifica riassuntiva
