import Link from "next/link";
import { Match } from "../queries/calendar";
import MatchTeam from "../../../matches/components/MatchTeam";

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
          <MatchTeam
            team={homeTeam}
            isBye={isBye}
            className="items-start"
          />
        </div>

        <div className="shrink-0 mx-6">
          <div className="text-center">
            <Points
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
          <MatchTeam
            team={awayTeam}
            isBye={isBye}
            className="items-end"
          />
        </div>
      </div>
    </Link>
  );
}

function Points({
  isMatchPlayed,
  homePoints,
  awayPoints,
}: {
  isMatchPlayed: boolean;
  homePoints: number;
  awayPoints: number;
}) {
  if (isMatchPlayed) {
    return (
      <div className="bg-primary/20 rounded-full px-4.5 py-1.5 mb-2">
        <span className="text-xl font-bold text-primary">
          {homePoints} - {awayPoints}
        </span>
      </div>
    );
  }

  <span className="text-xl font-bold text-primary">
    {homePoints || null} - {awayPoints || null}
  </span>;
}

function Score({
  homeScore,
  awayScore,
}: {
  homeScore?: string;
  awayScore?: string;
}) {
  return (
    homeScore ||
    (awayScore && (
      <div className="text-sm text-gray-400">
        <span>{homeScore || "-"}</span>
        <span className="mx-2">-</span>
        <span>{awayScore || "-"}</span>
      </div>
    ))
  );
}
