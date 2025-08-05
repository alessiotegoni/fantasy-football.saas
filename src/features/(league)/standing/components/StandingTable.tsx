"use client";

import { StandingData } from "../queries/standing";
import { cn } from "@/lib/utils";
import StandingTableRow from "./StandingTableRow";
import { FinalPhaseAccess } from "../../(admin)/calendar/final-phase/utils/calendar";

type Props = {
  data: StandingData[];
  isExtended: boolean;
  isSplitEnded: boolean;
  finalPhaseAccess: FinalPhaseAccess;
};

export default function StandingTable({
  data,
  isExtended,
  isSplitEnded,
  finalPhaseAccess,
}: Props) {
  const totalScores = data.map((s) => parseFloat(s.totalScore ?? "0"));

  return (
    <div className="bg-muted/30 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-2.5 xs:p-3 sm:p-4 px-4 py-3">
        <div
          className={cn(
            "grid grid-cols-[1fr_80px] gap-2.5 xs:gap-4 sm:text-center text-sm sm:text-base font-semibold",
            isExtended && "grid-cols-8 gap-1"
          )}
        >
          {isExtended ? (
            <>
              <p>G</p>
              <p>V</p>
              <p>N</p>
              <p>P</p>
              <p>Gf</p>
              <p>Gs</p>
              <p>Pt</p>
              <p>Totali</p>
            </>
          ) : (
            <>
              <h3 className="text-left font-sans font-semibold">Squadra</h3>
              <div className="flex items-center justify-between gap-5 text-sm xs:text-base">
                <p>Pt</p>
                <p>Totali</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-muted">
        {data.map((standing, index) => (
          <StandingTableRow
            key={standing.team.id}
            rank={index}
            standing={standing}
            isExtended={isExtended}
            isSplitEnded={isSplitEnded}
            isMinScore={index === getMinScoreIndex(data, totalScores)}
            isMaxScore={index === getMaxScoreindex(data, totalScores)}
            phase={getTeamPhase(standing.team.id, finalPhaseAccess)}
          />
        ))}
      </div>
    </div>
  );
}

function getTeamPhase(
  teamId: string,
  finalPhaseAccess: FinalPhaseAccess
): keyof FinalPhaseAccess | null {
  for (const [phase, list] of Object.entries(finalPhaseAccess)) {
    if (
      Array.isArray(list) &&
      list.some((id: any) =>
        Array.isArray(id) ? id.includes(teamId) : id === teamId
      )
    ) {
      return phase as keyof FinalPhaseAccess;
    }
  }
  return null;
}

function getMinScoreIndex(data: StandingData[], scores: number[]) {
  const minTotalScore = Math.min(...scores);

  const minScoreIndex = data.findLastIndex(
    (s) => parseFloat(s.totalScore ?? "0") === minTotalScore
  );

  return minScoreIndex;
}

function getMaxScoreindex(data: StandingData[], scores: number[]) {
  const maxTotalScore = Math.max(...scores);

  const maxScoreIndex = data.findIndex(
    (s) => parseFloat(s.totalScore ?? "0") === maxTotalScore
  );

  return maxScoreIndex;
}
