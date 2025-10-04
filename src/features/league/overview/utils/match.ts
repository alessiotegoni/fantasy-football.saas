import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { Match } from "@/features/league/admin/calendar/regular/queries/calendar";
import { LeagueTeam } from "@/features/league/teams/queries/leagueTeam";

export function groupMatches(
  splitMatchdays: SplitMatchday[] | undefined,
  calendar: Match[],
  userTeam: LeagueTeam | undefined
) {
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

  const userUpcomingMatch = upcomingMatches?.filter((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );
  const userLiveMatch = liveMatches?.filter((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );
  const userEndedMatch = endedMatches?.filter((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );

  return {
    upcoming: {
      matchday: firstUpcomingMatchday,
      matches: upcomingMatches,
      userMatches: userUpcomingMatch,
    },
    live: {
      matchday: liveMatchday,
      matches: liveMatches,
      userMatches: userLiveMatch,
    },
    ended: {
      matchday: lastEndedMatchday,
      matches: endedMatches,
      userMatches: userEndedMatch,
    },
  };
}
