"use client";

import { Calculator, WarningTriangle } from "iconoir-react";
import CalculateMatchdayButton from "./CalculateMatchdayButton";
import { isMatchdayCalculable } from "../utils/calculate-matchday";
import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";

export default function CalculateMatchdayBanner({
  matchday,
}: {
  matchday: SplitMatchday;
}) {
  if (!isMatchdayCalculable(matchday)) return <NotCalculable />;

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
      <CalculateMatchdayButton
        matchdayId={matchday.id}
        variant="gradient"
        className="min-w-30 w-fit max-w-36 mt-6 md:mt-0 gap-4 p-2.5 md:py-3.5 md:px-4 rounded-lg sm:rounded-2xl"
      >
        Calcola
      </CalculateMatchdayButton>
    </div>
  );
}

function NotCalculable() {
  return (
    <div
      className="flex flex-col md:flex-row items-center gap-2 md:gap-4 p-6 md:p-4 bg-muted/30 rounded-2xl
      mb-4 md:mb-8 border border-destructive"
    >
      <div className="size-16 bg-muted rounded-full flex items-center justify-center">
        <WarningTriangle className="size-8 text-destructive" />
      </div>
      <div className="text-center md:text-start">
        <h3 className="text-lg md:text-xl font-heading">
          Giornata non calcolabile
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Potrai calcolare la giornata dopo la mezzanotte e mezza
        </p>
      </div>
    </div>
  );
}
