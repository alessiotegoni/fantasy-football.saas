"use client";

import { StandingData } from "../queries/standing";
import { cn } from "@/lib/utils";

export default function StandingTable({
  data,
  isExtended,
}: {
  data: StandingData[];
  isExtended: boolean;
}) {
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
                <div
                  className={`w-1 h-8 rounded-r mr-2 xs:mr-3 ${
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
                <span
                  className={cn(
                    "xs:text-sm sm:text-base font-medium truncate",
                    !isExtended ? "text-xs" : "text-sm"
                  )}
                >
                  {standing.team.name}
                </span>
              </div>

              {isExtended ? (
                <div className="grid grid-cols-8 gap-2 sm:text-center text-sm sm:text-base font-medium text-muted-foreground">
                  <p>{standing.wins + standing.draws + standing.losses}</p>
                  <p>{standing.wins}</p>
                  <p>{standing.draws}</p>
                  <p>{standing.losses}</p>
                  <p>{standing.goalsScored}</p>
                  <p>{standing.goalsConceded}</p>
                  <p className="text-secondary font-bold sm:text-lg">
                    {standing.points}
                  </p>
                  <p>{standing.totalScore}</p>
                </div>
              ) : (
                <div className="flex justify-between items-center gap-4">
                  <p className="text-secondary font-bold sm:text-lg">
                    {standing.points}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">
                    {standing.totalScore}
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
