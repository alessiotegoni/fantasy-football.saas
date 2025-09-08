import { LeaderboardStar } from "iconoir-react";
import { StandingData } from "../queries/standing";
import { cn } from "@/lib/utils";
import { FinalPhaseAccess } from "../../admin/calendar/final-phase/utils/calendar";
import { getFinalPhaseColor } from "../utils/standing";
import { default as TotalScore } from "./StandingTableRowTotalScore";

type Props = {
  standing: StandingData;
  rank: number;
  isExtended: boolean;
  isSplitEnded: boolean;
  isMinScore: boolean;
  isMaxScore: boolean;
  isDefaultStanding: boolean;
  phase: keyof FinalPhaseAccess | null;
};

export default function StandingTableRow({
  standing,
  isExtended,
  rank,
  phase,
  isSplitEnded,
  ...props
}: Props) {
  const isWinner =
    isSplitEnded && rank === 0 && parseInt(standing?.points ?? "0") > 0;

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
          {isWinner ? (
            <LeaderboardStar className="text-primary size-6 mr-2 xs:mr-3" />
          ) : (
            <>
              {!props.isDefaultStanding && (
                <div
                  className={cn(
                    `w-1 h-5 sm:h-8 rounded-r mr-2 xs:mr-3`,
                    phase ? getFinalPhaseColor(phase) : "bg-transparent"
                  )}
                />
              )}
              <span className="text-secondary font-bold text-lg mr-2 xs:mr-3">
                {rank + 1}
              </span>
            </>
          )}
          <span
            className={cn(
              "xs:text-sm sm:text-base font-medium truncate",
              !isExtended ? "text-xs" : "text-sm",
              isWinner && "text-primary"
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
            <TotalScore {...props} {...standing} />
          </div>
        ) : (
          <div className="flex justify-between items-center gap-5">
            <p className="text-secondary font-bold sm:text-lg">
              {standing.points}
            </p>
            <TotalScore
              className="text-muted-foreground text-sm font-medium"
              {...props}
              {...standing}
            />
          </div>
        )}
      </div>
    </div>
  );
}
