import Link from "next/link";
import { Match } from "../queries/calendar";
import MatchTeam from "../../../matches/components/MatchTeam";
import MatchPoints from "./MatchPoints";
import MatchScores from "./MatchScores";

export default function CalendarMatchCard({
  id,
  homeTeam,
  awayTeam,
  matchResults,
  isBye,
  leagueId,
}: Match & { leagueId: string }) {
  const homeResult = matchResults?.find(
    (result) => result.teamId === homeTeam?.id
  );
  const awayResult = matchResults?.find(
    (result) => result.teamId === awayTeam?.id
  );

  const homeGoals = homeResult?.goals ?? 0;
  const awayGoals = awayResult?.goals ?? 0;
  const isHomeWinner = homeGoals > awayGoals;
  const isAwayWinner = awayGoals > homeGoals;

  return (
    <Link href={`/leagues/${leagueId}/matches/${id}`} className="group">
      <div className="bg-input/30 p-4 sm:p-6 flex items-center justify-between group-last:rounded-b-2xl">
        <MatchTeam
          team={homeTeam}
          isBye={isBye}
          isWinner={isHomeWinner}
          className="items-start"
        />

        <div className="shrink-0 text-center">
          <MatchPoints
            homePoints={homeGoals}
            awayPoints={awayGoals}
            isMatchPlayed={matchResults.length > 0}
            isHomeWinner={isHomeWinner}
            isAwayWinner={isAwayWinner}
          />
          <MatchScores
            homeScore={homeResult?.totalScore}
            awayScore={awayResult?.totalScore}
            isHomeWinner={isHomeWinner}
            isAwayWinner={isAwayWinner}
          />
        </div>

        <MatchTeam
          team={awayTeam}
          isBye={isBye}
          isWinner={isAwayWinner}
          className="items-end"
        />
      </div>
    </Link>
  );
}
