import { FinalPhaseAccess } from "../../(admin)/calendar/final-phase/utils/calendar";
import { getFinalPhaseColor } from "../utils/standing";

export default function StandingLegend({
  finalPhaseAccess,
}: {
  finalPhaseAccess: FinalPhaseAccess;
}) {
  const activePhases = Object.entries(finalPhaseAccess).filter(
    ([_, teams]) => teams.length > 0
  ) as [keyof FinalPhaseAccess, string[] | [string, string][]][];

  if (!activePhases.length) return null

  return (
    <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
      <h3 className="text-white font-medium mb-3">Legenda</h3>
      <div className="flex flex-col items-start sm:flex-row justify-between sm:items-center gap-5 text-sm">
        {activePhases.map(([phase]) => (
          <div key={phase} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded ${getFinalPhaseColor(phase)}`} />
            <span className="text-gray-300">{PHASE_LABELS[phase]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PHASE_LABELS: Record<keyof FinalPhaseAccess, string> = {
  final: "Finale",
  semifinal: "Semifinale",
  quarterfinal: "Quarti di finale",
  playIn: "Play-in",
  excluded: "Esclusi",
};
