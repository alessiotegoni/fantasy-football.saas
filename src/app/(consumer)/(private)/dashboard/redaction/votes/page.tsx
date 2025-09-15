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
import MatchdayAccordionItem from "@/features/dashboard/admin/bonusMaluses/components/MatchdayAccordionItem";
import { Suspense } from "react";
import {
  BonusMalusType,
  getBonusMalusTypes,
} from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalusType";
import { getPlayerMatchdayVoteTag } from "@/features/dashboard/redaction/votes/db/cache/vote";

export default async function VotesPage() {
  const split = await getLiveSplit();
  if (!split) {
    return (
      <Container headerLabel="Assegna voti">
        <EmptyState
          title="Split non in corso"
          description="Puoi assegnare voti solamente alle giornate degli split in corso"
          renderButton={() => <BackButton />}
        />
      </Container>
    );
  }

  const matchdays = await getSplitMatchdays(split.id);
  if (!matchdays.length) {
    return (
      <Container headerLabel="Assegna voti">
        <EmptyState
          title="Giornate non trovate"
          description="Le giornate dello split devono ancora essere annunciate"
          renderButton={() => <BackButton />}
        />
      </Container>
    );
  }

  return (
    <Container headerLabel="Assegna voti">
      <Suspense fallback={<VotesWrapper matchdays={matchdays} />}>
        <SuspenseBoundary matchdays={matchdays} />
      </Suspense>
    </Container>
  );
}

function VotesWrapper({
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
      {matchdays.map((matchday) => (
        <MatchdayAccordionItem
          key={matchday.id}
          matchday={matchday}
          bonusMaluses={bonusMaluses.filter(
            (mb) => mb.matchdayId === matchday.id
          )}
          bonusMalusTypes={bonusMalusTypes}
        />
      ))}
    </Accordion>
  );
}

async function SuspenseBoundary({ matchdays }: { matchdays: SplitMatchday[] }) {
  const matchdaysIds = matchdays.map((m) => m.id);

  const [bonusMaluses, bonusMalusTypes] = await Promise.all([
    getMatchdaysBonusMaluses(matchdaysIds),
    getBonusMalusTypes(),
  ]);
  getPlayerMatchdayVoteTag
  return (
    <VotesWrapper
      matchdays={matchdays}
      bonusMaluses={bonusMaluses}
      bonusMalusTypes={bonusMalusTypes}
    />
  );
}
