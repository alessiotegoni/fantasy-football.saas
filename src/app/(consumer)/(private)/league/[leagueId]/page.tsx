import {
  getSplitMatchdays,
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
import Container from "@/components/Container";
import LeagueBanners from "@/features/league/overview/components/LeagueBanners";
import { getUserId } from "@/features/dashboard/user/utils/user";
import LeagueWrapper from "@/features/league/overview/components/LeagueWrapper";
import {
  getRegularCalendar,
  Match,
} from "@/features/league/admin/calendar/regular/queries/calendar";
import {
  getAdjustedStandingData,
  getDefaultStandingData,
  getLeagueStandingData,
  StandingData,
} from "@/features/league/standing/queries/standing";

export default async function LeagueOverviewPage({
  params,
}: PageProps<"/league/[leagueId]">) {
  const { leagueId } = await params;

  const [splits, leagueTeams] = await Promise.all([
    getSplits(),
    getLeagueTeams(leagueId),
  ]);

  const lastSplit = splits.at(-1);

  let splitMatchdays: SplitMatchday[] | undefined;
  if (lastSplit) {
    splitMatchdays = await getSplitMatchdays(lastSplit.id);
  }

  const props = {
    leagueId,
    leagueTeams,
    splitMatchdays,
    lastSplit,
    standingData: getDefaultStandingData(leagueTeams),
  };

  return (
    <Container
      className="max-w-[1300px]"
      headerLabel="Home"
      headerRight={
        <Suspense>
          <LeagueSwitcher leagueId={leagueId} />
        </Suspense>
      }
    >
      <Suspense fallback={<LeagueWrapper {...props} />}>
        <SuspenseBoundary {...props} defaultStandingData={props.standingData} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  lastSplit,
  leagueTeams,
  defaultStandingData,
  splitMatchdays,
}: {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  defaultStandingData: StandingData[];
  splitMatchdays?: SplitMatchday[];
  lastSplit?: Split;
}) {
  const userId = await getUserId();
  if (!userId) return null;

  let infos: [Match[], StandingData[]] | undefined;
  if (lastSplit) {
    infos = await Promise.all([
      getRegularCalendar(leagueId, lastSplit.id),
      getLeagueStandingData(leagueId, lastSplit.id),
    ]);
  }

  let [calendar = [], standingData = []] = infos ?? [];

  if (standingData?.length !== leagueTeams.length) {
    standingData = getAdjustedStandingData(standingData, defaultStandingData);
  }

  const firstUpcomingMatchday = splitMatchdays?.find(
    (matchday) => matchday.status === "upcoming"
  );
  const liveMatchday = splitMatchdays?.find(
    (matchday) => matchday.status === "live"
  );
  const lastEndedMatchday = splitMatchdays?.findLast(
    (matchday) => matchday.status === "ended"
  );

  const liveMatches = calendar?.filter(
    (c) => c.splitMatchday.id === liveMatchday?.id
  );
  const upcomingMatches = calendar?.filter(
    (c) => c.splitMatchday.id === firstUpcomingMatchday?.id
  );
  const endedMatches = calendar?.filter(
    (c) => c.splitMatchday.id === lastEndedMatchday?.id
  );

  const props = {
    leagueId,
    leagueTeams,
    lastSplit,
    splitMatchdays,
    firstUpcomingMatchday,
    upcomingMatches,
    liveMatchday,
    liveMatches,
    lastEndedMatchday,
    endedMatches,
    calendar,
    standingData,
    isDefaultStanding: false,
  };

  return (
    <>
      <LeagueBanners {...props} userId={userId} />
      <LeagueWrapper {...props} userId={userId} />
    </>
  );
}


// TODO: Prendere da calendar un match con una giornata con status live e team id uguale
//  a quello dell'utente (acquisibile filtrando leagueTeams con lo userId)
// Mandare a schermo una simil MatchCard ma con vedi match in verde
// TODO: Prendere da calendar gli endedMatches (spostarli quindi nel boundary e passarli come prop)
//  filtrare per il match con il team dell'utente
//  a quello dell'utente (acquisibile filtrando leagueTeams con lo userId)
// Mandare a schermo una simil MatchCard ma con vedi match in verde
