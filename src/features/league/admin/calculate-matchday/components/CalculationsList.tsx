import { Calculation } from "../queries/calculate-matchday";
import ActionButton from "@/components/ActionButton";
import CalculateMatchdayButton from "./CalculateMatchdayButton";
import { cancelCalculation } from "../actions/calculate-matchday";

export default function CalculationsList({
  leagueId,
  calculations,
}: {
  leagueId: string;
  calculations: Calculation[];
}) {
  return (
    <ul className="space-y-3">
      {calculations.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between rounded-3xl border bg-input/30 p-4 text-card-foreground"
        >
          <div>
            <p className="font-semibold mb-1">Giornata {c.matchday.number}</p>
            {c.status === "calculated" && (
              <p className="text-sm text-muted-foreground">
                Calcolata il {new Date(c.calculatedAt).toLocaleDateString()}
              </p>
            )}
            {c.status === "cancelled" && (
              <p className="text-sm text-destructive">Calcolo annullato</p>
            )}
          </div>
          {c.status === "calculated" && (
            <CancelCalculationButton leagueId={leagueId} calculation={c} />
          )}
          {c.status === "cancelled" && (
            <CalculateMatchdayButton
              className="w-fit"
              calculationId={c.id}
              matchdayId={c.matchday.id}
            >
              Ricalcola
            </CalculateMatchdayButton>
          )}
        </li>
      ))}
    </ul>
  );
}

function CancelCalculationButton({
  leagueId,
  calculation: {
    id: calculationId,
    matchday: { id: matchdayId },
  },
}: {
  leagueId: string;
  calculation: Calculation;
}) {
  return (
    <ActionButton
      className="w-fit"
      action={cancelCalculation.bind(null, {
        calculationId,
        leagueId,
        matchdayId,
      })}
      variant="destructive"
      loadingText="Annullo"
      requireAreYouSure
      areYouSureDescription="Sei sicuro di voler annullare la giornata? Tutti i risultati dei match di questa giornata verranno azzerati, puoi comunque ricalcolarla quando vuoi prima della fine dello split"
    >
      Annulla
    </ActionButton>
  );
}
