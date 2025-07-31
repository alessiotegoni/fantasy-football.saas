import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import CalculateMatchdayBanner from "@/features/(league)/(admin)/calculate-matchday/components/CalculateMatchdayBanner";
import CalculationsList from "@/features/(league)/(admin)/calculate-matchday/components/CalculationsList";
import { getCalculations } from "@/features/(league)/(admin)/calculate-matchday/queries/calculate-matchday";
import { hasGeneratedCalendar } from "@/features/(league)/(admin)/calendar/permissions/calendar";
import {
  getLastEndedMatchday,
  getLiveSplit,
} from "@/features/splits/queries/split";
import { Suspense } from "react";

export default async function CalculateMatchdayPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const [liveSplit, { leagueId }] = await Promise.all([getLiveSplit(), params]);

  return (
    <Container
      headerLabel="Calcola giornate"
      leagueId={leagueId}
      className="max-w-[800px]"
    >
      {liveSplit ? (
        <Suspense>
          <SuspenseBoundary leagueId={leagueId} splitId={liveSplit.id} />
        </Suspense>
      ) : (
        <EmptyState
          title="Split non ancora iniziato"
          description="Potrai calcolare le giornate successivamente quando lo split sara iniziato"
          renderButton={() => <BackButton className="min-w-36" />}
        />
      )}
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  splitId,
}: {
  leagueId: string;
  splitId: number;
}) {
  const [matchday, matchdayCalcs, isCalendarGenerated] = await Promise.all([
    getLastEndedMatchday(splitId),
    getCalculations(leagueId, splitId),
    hasGeneratedCalendar(leagueId, splitId)
  ]);

  if (!matchday) {
    return (
      <EmptyState
        title="Giornata non ancora calcolabile"
        description="Potrai calcolare la giornata dopo la mezzanotte e mezza"
        renderButton={() => <BackButton className="min-w-36" />}
      />
    );
  }

  const isAlreadyCalculated = matchdayCalcs.some(
    (matchdayCalc) => matchdayCalc.matchday.id === matchday.id
  );

  return (
    <>
      {!isAlreadyCalculated && <CalculateMatchdayBanner matchday={matchday} />}
      <div>
        <h2 className="text-lg font-semibold mb-2">Giornate calcolate</h2>
        {matchdayCalcs.length > 0 ? (
          <CalculationsList leagueId={leagueId} calculations={matchdayCalcs} />
        ) : (
          <p className="text-muted-foreground">
            Nessuna giornata è stata ancora calcolata.
          </p>
        )}
      </div>
    </>
  );
}
