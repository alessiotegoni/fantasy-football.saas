import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { getLiveSplit } from "@/features/splits/queries/split";

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
        <></>
      ) : (
        <EmptyState
          title="Split non ancora iniziato"
          description="Potrai calcolare le giornate successivamente quando lo split sara iniziato"
        />
      )}
    </Container>
  );
}
