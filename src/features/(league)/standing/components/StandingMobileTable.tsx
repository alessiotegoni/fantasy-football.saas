"use client";

import { StandingData } from "../queries/standing";

export function StandingMobileTable({
  data,
  isExtended,
}: {
  data: StandingData[];
  isExtended: boolean;
}) {
  if (isExtended) {
    return (
      <div className="bg-muted/30 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-4 py-3">
          <div className="grid grid-cols-8 gap-2 text-center text-white text-sm font-medium">
            <div>G</div>
            <div>V</div>
            <div>N</div>
            <div>P</div>
            <div>Gf</div>
            <div>Gs</div>
            <div>Pt</div>
            <div>Pt Totali</div>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-700">
          {data.map((standing, index) => (
            <div key={standing.team.id} className="p-4">
              {/* Team Info */}
              <div className="flex items-center mb-3">
                <div
                  className={`w-1 h-8 rounded-r mr-3 ${
                    index === 0
                      ? "bg-blue-500"
                      : index < 3
                      ? "bg-green-500"
                      : "bg-transparent"
                  }`}
                />
                <span className="text-blue-400 font-bold text-lg mr-3">
                  {index + 1}
                </span>
                <span className="text-white font-medium">
                  {standing.team.name}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-8 gap-2 text-center text-sm">
                <div className="text-gray-300">
                  {standing.wins + standing.draws + standing.losses}
                </div>
                <div className="text-gray-300">{standing.wins}</div>
                <div className="text-gray-300">{standing.draws}</div>
                <div className="text-gray-300">{standing.losses}</div>
                <div className="text-gray-300">{standing.goalsScored}</div>
                <div className="text-gray-300">{standing.goalsConceded}</div>
                <div className="text-blue-400 font-bold">{standing.points}</div>
                <div className="text-gray-300">{standing.totalScore}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Normal view
  return (
    <div className="bg-muted/30 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-2.5 xs:p-3 sm:p-4 px-4 py-3">
        <div className="grid grid-cols-[1fr_80px] gap-2.5 xs:gap-4 text-center text-sm font-medium">
          <h3 className="text-left font-sans text-base font-semibold">
            Squadra
          </h3>
          <div className="flex items-center justify-between gap-5 text-sm">
            <p>P Totali</p>
            <p>P</p>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-muted">
        {data.map((standing, index) => (
          <div key={standing.team.id} className="p-2.5 xs:p-3 sm:p-4">
            <div className="grid grid-cols-[1fr_80px] gap-2.5 xs:gap-4">
              {/* Team */}
              <div className="flex items-center">
                <div
                  className={`w-1 h-8 rounded-r mr-3 ${
                    index === 0
                      ? "bg-blue-500"
                      : index < 3
                      ? "bg-green-500"
                      : index === data.length - 1
                      ? "bg-destructive"
                      : "bg-transparent"
                  }`}
                />
                <span className="text-secondary font-bold text-lg mr-3">
                  {index + 1}
                </span>
                <span className="text-xs xs:text-sm sm:text-base font-medium truncate">
                  {standing.team.name}
                </span>
              </div>

              <div className="flex justify-between items-center gap-4">
                {/* Total Score */}
                <p className="text-muted-foreground text-sm font-medium">
                  {standing.totalScore}
                </p>

                {/* Points */}
                <p className="text-secondary font-bold sm:text-lg">
                  {standing.points}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
