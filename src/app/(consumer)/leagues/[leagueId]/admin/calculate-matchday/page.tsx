import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { getCalculableMatchday } from "@/features/(league)/(admin)/calculate-matchday/queries/calculate-matchday";
import { getLiveSplit } from "@/features/splits/queries/split";
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
      className="max-w-[700px]"
    >
      {liveSplit ? (
        <>
          <Suspense>
            <CalculateMatchdayBanner splitId={liveSplit.id} />
          </Suspense>
        </>
      ) : (
        <EmptyState
          title="Split non ancora iniziato"
          description="Potrai calcolare le giornate successivamente quando lo split sara iniziato"
        />
      )}
    </Container>
  );
}

