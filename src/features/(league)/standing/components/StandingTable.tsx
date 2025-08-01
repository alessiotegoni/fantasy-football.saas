"use client";

import { StandingData } from "../queries/standing";
import { cn } from "@/lib/utils";
import { LeaderboardStar } from "iconoir-react";

type Props = {
  data: StandingData[];
  isExtended: boolean;
  isSplitEnded: boolean;
};

export default function StandingTable({
  data,
  isExtended,
  isSplitEnded,
}: Props) {
  const totalScores = data.map((s) => parseFloat(s.totalScore ?? "0"));

  const minScoreIndex = getMinScoreIndex(data, totalScores);
  const maxScoreIndex = getMaxScoreIndex(data, totalScores);

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
                index === 0 &&
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
                      {index + 1}
                    </span>
                  </>
                )}
                <span
                  className={cn(
                    "xs:text-sm sm:text-base font-medium truncate",
                    !isExtended ? "text-xs" : "text-sm",
                    isSplitEnded &&
                      index === 0 &&
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
                      index === maxScoreIndex && "text-green-500",
                      index === minScoreIndex && "text-destructive"
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
                      index === maxScoreIndex && "text-green-500",
                      index === minScoreIndex && "text-destructive"
                    )}
                  >
                    {formatTotalScore(standing.totalScore)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMinScoreIndex(data: StandingData[], scores: number[]) {
  const minTotalScore = Math.min(...scores);

  const minScoreIndex = data.findLastIndex(
    (s) => parseFloat(s.totalScore ?? "0") === minTotalScore
  );

  return minScoreIndex;
}

function getMaxScoreIndex(data: StandingData[], scores: number[]) {
  const maxTotalScore = Math.max(...scores);

  const maxScoreIndex = data.findIndex(
    (s) => parseFloat(s.totalScore ?? "0") === maxTotalScore
  );

  return maxScoreIndex;
}

function formatTotalScore(score: string | null) {
  const number = parseFloat(score ?? "0");
  return Math.ceil(number);
}
