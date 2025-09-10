import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { getMatchdaysBonusMaluses } from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalus";
import { Accordion } from "@/components/ui/accordion";
import {
  getLiveSplit,
  getSplitMatchdays,
} from "@/features/dashboard/admin/splits/queries/split";
import MatchdayAccordionItem from "@/features/dashboard/admin/bonusMaluses/components/MatchdayAccordionItem";

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

  const matchdays = await getSplitMatchdays(split.id);
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

  const matchdaysBonusMaluses = await getMatchdaysBonusMaluses(
    matchdays.map((m) => m.id)
  );

  const liveMatchday = matchdays.find((matchday) => matchday.status === "live");

  return (
    <Container headerLabel="Assegna bonus malus">
      <Accordion
        type="single"
        collapsible
        className="space-y-3"
        defaultValue={liveMatchday?.id.toString()}
      >
        {matchdays.map((matchday) => (
          <MatchdayAccordionItem
            key={matchday.id}
            matchday={matchday}
            bonusMaluses={matchdaysBonusMaluses.filter(
              (mb) => mb.matchdayId === matchday.id
            )}
          />
        ))}
      </Accordion>
    </Container>
  );
}
