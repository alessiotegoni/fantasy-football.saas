import { Calculation } from "../queries/calculate-matchday";
import ActionButton from "@/components/ActionButton";
import CalculateMatchdayButton from "./CalculateMatchdayButton";

export default function CalculationsList({
  calculations,
}: {
  calculations: Calculation[];
}) {
  return (
    <ul className="space-y-3">
      {calculations.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground"
        >
          <div>
            <p className="font-semibold">Giornata {c.matchday.number}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(c.calculatedAt).toLocaleDateString()}
            </p>
          </div>
          {c.status === "calculated" && (
            <ActionButton variant="destructive" loadingText="Annullo">
              Annulla
            </ActionButton>
          )}
          {c.status === "cancelled" && (
            <CalculateMatchdayButton
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
