import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { getLiveSplit, getSplitMatchdays } from "@/features/dashboard/admin/splits/queries/split";

export default async function AssignBonusMalusesPage() {
  const split = await getLiveSplit();
  if (!split) {
    return (
      <Container headerLabel="Assegna bonus malus">
        <EmptyState
          title="Split non in corso"
          description="Puoi assegnare bonus e malus solamente alle giornate degli split in corso"
          renderButton={() => <BackButton />}
        />
      </Container>
    );
  }

  const matchdays = await getSplitMatchdays(split.id)
  if (!matchdays.length) {
    return (
      <Container headerLabel="Assegna bonus malus">
        <EmptyState
          title="Giornate non trovate"
          description="Le giornate dello split devono ancora essere annunciate"
          renderButton={() => <BackButton />}
        />
      </Container>
    );
  }

  return <div>AssignBonusMalusesPage</div>;
}
