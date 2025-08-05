import { FinalPhaseAccess } from "../../(admin)/calendar/final-phase/utils/calendar";

export default function StandingLegend({
  finalPhaseAccess,
}: {
  finalPhaseAccess: FinalPhaseAccess;
}) {
  return (
    <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
      <h3 className="text-white font-medium mb-3">Legenda</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-gray-300">1° posto</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-gray-300">Zona Champions</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-300">Zona retrocessione</span>
        </div>
      </div>
    </div>
  );
}
