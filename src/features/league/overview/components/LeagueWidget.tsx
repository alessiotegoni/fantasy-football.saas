import { Split } from "@/features/dashboard/admin/splits/queries/split";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import LeagueMatchCard from "./LeagueMatchCard";
import { ComponentProps } from "react";
import LinkButton from "@/components/LinkButton";

import { groupMatches } from "@/features/league/overview/utils/match";

type Props = {
  leagueId: string;
  userTeam?: LeagueTeam;
  calendar?: Match[];
  matches?: ReturnType<typeof groupMatches>;
  lastSplit?: Split;
};

export default function LeagueWidget({ leagueId, userTeam, matches }: Props) {
  function renderContent() {
    if (!matches) return null;

    const {
      live: { userMatches: userLiveMatches },
      upcoming: { userMatches: userUpcomingMatches },
      ended: { userMatches: userEndedMatches },
    } = matches;

    if (userLiveMatches.length) {
      return (
        <LeagueMatchCard
          leagueId={leagueId}
          match={userLiveMatches.at(0)!}
          buttonProps={{
            children: "Vedi live",
            className: "bg-green-500",
          }}
        />
      );
    }

    if (userUpcomingMatches.length && userEndedMatches.length) {
      return (
        <div className="flex gap-4 p-6 w-full justify-around items-center">
          <LeagueMatchCard
            leagueId={leagueId}
            match={userEndedMatches.at(-1)!}
            title="Ultima Giornata"
            buttonProps={getEndedMatchButtonProps(
              userEndedMatches.at(-1)!,
              userTeam?.id
            )}
          />
          <LeagueMatchCard
            leagueId={leagueId}
            match={userUpcomingMatches.at(0)!}
            title="Prossima Giornata"
            buttonProps={{
              children: "Inserisci formazione",
              className: "bg-blue-500 hover:bg-blue-600",
            }}
          />
        </div>
      );
    }

    if (userUpcomingMatches.length) {
      return (
        <LeagueMatchCard
          leagueId={leagueId}
          match={userUpcomingMatches.at(0)!}
          title="Prossima Giornata"
          buttonProps={{
            children: "Inserisci formazione",
            className: "bg-blue-500 hover:bg-blue-600",
          }}
        />
      );
    }

    if (userEndedMatches.length) {
      return (
        <LeagueMatchCard
          leagueId={leagueId}
          match={userEndedMatches.at(-1)!}
          title="Ultima Giornata"
          buttonProps={getEndedMatchButtonProps(
            userEndedMatches.at(-1)!,
            userTeam?.id
          )}
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
