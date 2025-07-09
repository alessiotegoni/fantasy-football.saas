import Link from "next/link";
import { Match } from "../queries/calendar";

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

  const homePoints = homeResult?.goals ?? 0;
  const awayPoints = awayResult?.goals ?? 0;
  const homeFantasyScore = homeResult?.totalScore;
  const awayFantasyScore = awayResult?.totalScore;

  return (
    <Link
      href={`/leagues/${leagueId}/matches/${id}`}
      className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        {/* Home Team */}
        <div className="flex-1">
          <TeamCard
            team={homeTeam}
            isBye={isBye && !awayTeam}
            fantasyScore={homeFantasyScore}
            className="items-start"
          />
        </div>

        {/* Score Section */}
        {matchResults.length > 0 && (
          <div className="flex-shrink-0 mx-6">
            <div className="text-center">
              {/* Match Score */}
              <div className="bg-blue-500/20 rounded-full px-4 py-2 mb-2">
                <span className="text-xl font-bold text-white">
                  {homePoints} - {awayPoints}
                </span>
              </div>
              {/* Fantasy Scores */}
              {(homeFantasyScore || awayFantasyScore) && (
                <div className="text-sm text-gray-400">
                  <span>{homeFantasyScore || "-"}</span>
                  <span className="mx-2">-</span>
                  <span>{awayFantasyScore || "-"}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Away Team */}
        <div className="flex-1">
          <TeamCard
            team={awayTeam}
            isBye={isBye && !homeTeam}
            fantasyScore={awayFantasyScore}
            className="items-end"
          />
        </div>
      </div>
    </Link>
  );
}
