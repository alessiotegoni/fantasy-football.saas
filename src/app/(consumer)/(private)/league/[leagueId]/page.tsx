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
import { groupMatches } from "@/features/league/overview/utils/match";

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
      className="md:p-0 max-w-[1300px]"
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

  const userTeam = leagueTeams.find((team) => team.userId === userId);
  const matches = groupMatches(splitMatchdays, calendar, userTeam);

  const props = {
    userId,
    leagueId,
    leagueTeams,
    lastSplit,
    splitMatchdays,
    calendar,
    standingData,
    matches,
    isDefaultStanding: false,
  };

  return (
    <>
      <LeagueBanners {...props} />
      <LeagueWrapper {...props} />
    </>
  );
}
