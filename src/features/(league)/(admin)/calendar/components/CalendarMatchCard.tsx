import Link from "next/link";
import { Match } from "../queries/calendar";
import MatchTeam from "../../../matches/components/MatchTeam";
import MatchPoints from "./MatchPoints";
import MatchScores from "./MatchScores";
import { cn } from "@/lib/utils";

type Props = Omit<Match, "splitMatchday"> & {
  leagueId: string;
  homeModule?: string | null;
  awayModule?: string | null;
  isLink?: boolean;
  className?: string;
};

export default function CalendarMatchCard({
  id,
  homeTeam,
  homeModule,
  awayTeam,
  awayModule,
  matchResults,
  isBye,
  leagueId,
  isLink = true,
  className,
  ...teamProps
}: Props) {
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

  const content = (
    <div
      className={cn(
        `bg-input/30 p-4 sm:p-6 flex items-center justify-between group-last:rounded-b-2xl
    group-last:border-t group-last:border-border`,
        className
      )}
    >
      <MatchTeam
        team={homeTeam}
        isBye={isBye}
        isWinner={isHomeWinner}
        className="items-start"
        module={homeModule}
        {...teamProps}
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
        module={awayModule}
        {...teamProps}
      />
    </div>
  );

  return isBye && !isLink ? (
    <div className="group">{content}</div>
  ) : (
    <Link href={`/leagues/${leagueId}/matches/${id}`} className="group">
      {content}
    </Link>
  );
}
