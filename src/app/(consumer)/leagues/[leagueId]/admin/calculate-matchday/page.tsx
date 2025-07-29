import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import CalculateEmptyState from "@/features/(league)/(admin)/calculate-matchday/components/CalculateEmptyState";
import CalculateMatchdayBanner from "@/features/(league)/(admin)/calculate-matchday/components/CalculateMatchdayBanner";
import CalculationsList from "@/features/(league)/(admin)/calculate-matchday/components/CalculationsList";
import { getCalculations } from "@/features/(league)/(admin)/calculate-matchday/queries/calculate-matchday";
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
  const [matchday, matchdayCalcs] = await Promise.all([
    getLastEndedMatchday(splitId),
    getCalculations(leagueId, splitId),
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
        {!isAlreadyCalculated && (
          <h2 className="text-xl font-bold tracking-tight">
            Giornate calcolate
          </h2>
        )}
        {matchdayCalcs.length > 0 ? (
          <CalculationsList calculations={matchdayCalcs} />
        ) : (
          <p className="text-muted-foreground mt-2">
            Nessuna giornata è stata ancora calcolata.
          </p>
        )}
      </div>
    </>
  );
}
