import {
  Split,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import LeagueMatchCard from "./LeagueMatchCard";
import { ComponentProps } from "react";
import LinkButton from "@/components/LinkButton";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  calendar?: Match[];
  firstUpcomingMatchday?: SplitMatchday;
  upcomingMatches?: Match[];
  liveMatchday?: SplitMatchday;
  liveMatches?: Match[];
  lastEndedMatchday?: SplitMatchday;
  endedMatches?: Match[];
  lastSplit?: Split;
  userId?: string;
};

export default function LeagueWidget({
  leagueId,
  leagueTeams,
  userId,
  upcomingMatches,
  liveMatches,
  endedMatches,
}: Props) {
  const userTeam = leagueTeams.find((team) => team.userId === userId);

  const userUpcomingMatch = upcomingMatches?.find((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );
  const userLiveMatch = liveMatches?.find((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );
  const userEndedMatch = endedMatches?.find((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );

  function renderContent() {
    if (userLiveMatch) {
      return (
        <LeagueMatchCard
          leagueId={leagueId}
          match={userLiveMatch}
          buttonProps={{
            children: "Vedi match",
            className: "bg-green-500",
          }}
        />
      );
    }

    if (userUpcomingMatch && userEndedMatch) {
      return (
        <div className="flex gap-4 p-6 w-full justify-around items-center">
          <LeagueMatchCard
            leagueId={leagueId}
            match={userEndedMatch}
            buttonProps={getEndedMatchButtonProps(userEndedMatch, userTeam?.id)}
          />
          <LeagueMatchCard
            leagueId={leagueId}
            match={userUpcomingMatch}
            buttonProps={{
              children: "Inserisci formazione",
              className: "bg-blue-500 hover:bg-blue-600",
            }}
          />
        </div>
      );
    }

    if (userUpcomingMatch) {
      return (
        <LeagueMatchCard
          leagueId={leagueId}
          match={userUpcomingMatch}
          buttonProps={{
            children: "Inserisci formazione",
            className: "bg-blue-500 hover:bg-blue-600",
          }}
        />
      );
    }

    if (userEndedMatch) {
      return (
        <LeagueMatchCard
          leagueId={leagueId}
          match={userEndedMatch}
          buttonProps={getEndedMatchButtonProps(userEndedMatch, userTeam?.id)}
        />
      );
    }

    return null;
  }

  return (
    <div className="league-widget">
      <div className="size-full backdrop-blur-2xl flex justify-center items-center">
        {renderContent()}
      </div>
    </div>
  );
}

function getEndedMatchButtonProps(
  match: Match,
  userTeamId: string | undefined
): Omit<ComponentProps<typeof LinkButton>, "href"> {
  const { matchResults, homeTeam, awayTeam } = match;

  if (!matchResults.length) {
    return {
      children: "Vedi finale",
      className: "bg-green-900 hover:bg-green-800 text-white",
    };
  }

  const homeScore = matchResults.find(
    (r) => r.teamId === homeTeam.id
  )?.totalScore;
  const awayScore = matchResults.find(
    (r) => r.teamId === awayTeam.id
  )?.totalScore;

  if (typeof homeScore !== "number" || typeof awayScore !== "number") {
    return {
      children: "Vedi finale",
      className: "bg-green-900 hover:bg-green-800 text-white",
    };
  }

  const isDraw = homeScore === awayScore;
  if (isDraw) {
    return { children: "Hai pareggiato", className: "bg-gray-500" };
  }

  const isUserHomeTeam = homeTeam.id === userTeamId;
  const userWon =
    (isUserHomeTeam && homeScore > awayScore) ||
    (!isUserHomeTeam && awayScore > homeScore);

  if (userWon) {
    return { children: "Hai vinto!", className: "bg-primary" };
  }

  return { children: "Hai perso", variant: "destructive" };
}
