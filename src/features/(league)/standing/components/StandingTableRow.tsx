import { LeaderboardStar } from "iconoir-react";
import { StandingData } from "../queries/standing";
import { cn } from "@/lib/utils";

type Props = {
  standing: StandingData;
  rank: number;
  isExtended: boolean;
  isSplitEnded: boolean;
  isMinScore: boolean;
  isMaxScore: boolean;
};

export default function StandingTableRow({
  standing,
  rank,
  isExtended,
  isSplitEnded,
  isMinScore,
  isMaxScore,
}: Props) {
  return (
    <div key={standing.team.id} className="p-2.5 xs:p-3 sm:p-4">
      <div
        className={cn(
          "grid grid-cols-[1fr_80px] gap-2.5 xs:gap-4",
          isExtended && "grid-cols-1"
        )}
      >
        {/* Team Info */}
        <div className="flex items-center">
          {isSplitEnded &&
          rank === 0 &&
          parseInt(standing?.points ?? "0") > 0 ? (
            <LeaderboardStar className="text-primary size-6 mr-2 xs:mr-3" />
          ) : (
            <>
              <div
                className={`w-1 h-5 sm:h-8 rounded-r mr-2 xs:mr-3 ${
                  index === 0
                    ? "bg-blue-500"
                    : index < 3
                    ? "bg-green-500"
                    : isExtended
                    ? "bg-transparent"
                    : index === data.length - 1
                    ? "bg-destructive"
                    : "bg-transparent"
                }`}
              />
              <span className="text-secondary font-bold text-lg mr-2 xs:mr-3">
                {rank + 1}
              </span>
            </>
          )}
          <span
            className={cn(
              "xs:text-sm sm:text-base font-medium truncate",
              !isExtended ? "text-xs" : "text-sm",
              isSplitEnded &&
                rank === 0 &&
                parseInt(standing?.points ?? "0") > 0 &&
                "text-primary"
            )}
          >
            {standing.team.name}
          </span>
        </div>

        {isExtended ? (
          <div className="grid grid-cols-8 gap-1 xs:gap-4 sm:text-center text-sm sm:text-base font-medium text-muted-foreground">
            <p>{standing.wins + standing.draws + standing.losses}</p>
            <p>{standing.wins}</p>
            <p>{standing.draws}</p>
            <p>{standing.losses}</p>
            <p>{standing.goalsScored}</p>
            <p>{standing.goalsConceded}</p>
            <p className="text-secondary font-bold sm:text-lg">
              {standing.points}
            </p>
            <p
              className={cn(
                isMaxScore && "text-green-500",
                isMinScore && "text-destructive"
              )}
            >
              {formatTotalScore(standing.totalScore)}
            </p>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-5">
            <p className="text-secondary font-bold sm:text-lg">
              {standing.points}
            </p>
            <p
              className={cn(
                "text-muted-foreground text-sm font-medium",
                isMaxScore && "text-green-500",
                isMinScore && "text-destructive"
              )}
            >
              {formatTotalScore(standing.totalScore)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTotalScore(score: string | null) {
  const number = parseFloat(score ?? "0");
  return Math.ceil(number);
}
