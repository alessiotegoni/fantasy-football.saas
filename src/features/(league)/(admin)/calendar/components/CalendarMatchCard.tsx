import Link from "next/link";
import { Match } from "../queries/calendar";
import MatchTeam from "../../../matches/components/MatchTeam";
import MatchPoints from "./MatchPoints";

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

  return (
    <Link href={`/leagues/${leagueId}/matches/${id}`} className="group">
      <div className="bg-input/30 p-6 flex items-center justify-between group-last:rounded-b-2xl">
        <div className="flex-1">
          <MatchTeam team={homeTeam} isBye={isBye} className="items-start" />
        </div>

        <div className="shrink-0 mx-6">
          <div className="text-center">
            <MatchPoints
              homePoints={homeResult?.goals ?? 0}
              awayPoints={awayResult?.goals ?? 0}
              isMatchPlayed={matchResults.length > 0}
            />
            <Score
              homeScore={homeResult?.totalScore}
              awayScore={awayResult?.totalScore}
            />
          </div>
        </div>

        <div className="flex-1">
          <MatchTeam team={awayTeam} isBye={isBye} className="items-end" />
        </div>
      </div>
    </Link>
  );
}
