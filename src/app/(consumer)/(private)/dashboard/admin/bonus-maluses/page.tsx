import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import {
  getMatchdaysBonusMaluses,
  MatchdayBonusMalus,
} from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalus";
import { Accordion } from "@/components/ui/accordion";
import {
  getLiveSplit,
  getSplitMatchdays,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import MatchdayAccordionItem from "@/features/dashboard/admin/splits/components/MatchdayAccordionItem";
import { Suspense } from "react";
import {
  BonusMalusType,
  getBonusMalusTypes,
} from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalusType";
import BonusMalusesTable from "@/features/dashboard/admin/bonusMaluses/components/BonusMalusesTable";

export default async function BonusMalusesPage() {
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

  return (
    <Container headerLabel="Assegna bonus malus">
      <Suspense fallback={<BonusMalusWrapper matchdays={matchdays} />}>
        <SuspenseBoundary matchdays={matchdays} />
      </Suspense>
    </Container>
  );
}

function BonusMalusWrapper({
  matchdays,
  bonusMaluses = [],
  bonusMalusTypes = [],
}: {
  matchdays: SplitMatchday[];
  bonusMaluses?: MatchdayBonusMalus[];
  bonusMalusTypes?: BonusMalusType[];
}) {
  const liveMatchday = matchdays.find((matchday) => matchday.status === "live");

  return (
    <Accordion
      type="single"
      collapsible
      className="space-y-3"
      defaultValue={liveMatchday?.id.toString()}
    >
      {matchdays.map((matchday) => {
        const matchdayBonusMaluses = bonusMaluses.filter(
          (bm) => bm.matchdayId === matchday.id
        );
        return (
          <MatchdayAccordionItem
            key={matchday.id}
            matchday={matchday}
            assignHref="/dashboard/admin/bonus-maluses/assign"
          >
            {matchdayBonusMaluses.length > 0 ? (
              <BonusMalusesTable
                matchday={matchday}
                bonusMaluses={matchdayBonusMaluses}
                bonusMalusTypes={bonusMalusTypes}
              />
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nessun bonus/malus assegnato per questa giornata.
              </p>
            )}
          </MatchdayAccordionItem>
        );
      })}
    </Accordion>
  );
}


async function SuspenseBoundary({ matchdays }: { matchdays: SplitMatchday[] }) {
  const matchdaysIds = matchdays.map((m) => m.id);

  const [bonusMaluses, bonusMalusTypes] = await Promise.all([
    getMatchdaysBonusMaluses(matchdaysIds),
    getBonusMalusTypes(),
  ]);

  return (
    <BonusMalusWrapper
      matchdays={matchdays}
      bonusMaluses={bonusMaluses}
      bonusMalusTypes={bonusMalusTypes}
    />
  );
}
