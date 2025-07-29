import EmptyState from "@/components/EmptyState";
import { SplitMatchday } from "@/features/splits/queries/split";
import BackButton from "@/components/BackButton";
import { Calculator } from "iconoir-react";
import ActionButton from "@/components/ActionButton";

export default async function CalculateMatchdayBanner({
  matchday,
  leagueId,
}: {
  matchday: SplitMatchday;
  leagueId: string;
}) {
  const calculableFromDate = new Date(matchday.endAt);
  calculableFromDate.setDate(calculableFromDate.getDate() + 1);
  calculableFromDate.setHours(0, 30, 0, 0);

  const isCalculable = new Date() > calculableFromDate;

  if (!isCalculable) return <CalculateEmptyState />;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-4 bg-muted/30 rounded-2xl mb-4 md:mb-8">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <div className="size-16 bg-muted rounded-full flex items-center justify-center">
          <Calculator className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center md:text-start">
          <h3 className="text-lg md:text-xl font-heading">
            Giornata {matchday.number}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Calcola subito la giornata e vedi la classifica aggiornata!
          </p>
        </div>
      </div>
      <ActionButton
        loadingText="Calcolo"
        variant="gradient"
        className="min-w-30 w-fit max-w-36 mt-6 md:mt-0 gap-4 p-2.5 md:py-3.5 md:px-4 rounded-lg sm:rounded-2xl"
      >
        Calcola
      </ActionButton>
    </div>
  );
}

