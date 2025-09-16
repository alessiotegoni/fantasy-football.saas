import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { Accordion } from "@/components/ui/accordion";
import {
  getLiveSplit,
  getSplitMatchdays,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import MatchdayAccordionItem from "@/features/dashboard/admin/splits/components/MatchdayAccordionItem";
import { Suspense } from "react";
import {
  getMatchdaysVotes,
  MatchdayVote,
} from "@/features/dashboard/redaction/queries/vote";
import VotesTable from "@/features/dashboard/redaction/components/VotesTable";
import { getUserId } from "@/features/dashboard/user/utils/user";
import {
  getUserRedaction,
  UserRedaction,
} from "@/features/dashboard/user/queries/user";

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
  votes = [],
}: {
  matchdays: SplitMatchday[];
  votes?: MatchdayVote[];
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
        const matchdayVotes = votes.filter((v) => v.matchdayId === matchday.id);
        return (
          <MatchdayAccordionItem
            key={matchday.id}
            matchday={matchday}
            assignHref="/dashboard/redaction/votes/assign"
          >
            {matchdayVotes.length > 0 ? (
              <VotesTable
                matchday={matchday}
                votes={matchdayVotes}
              />
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nessun voto assegnato per questa giornata.
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
  const votes = await getMatchdaysVotes(matchdaysIds);

  return <VotesWrapper matchdays={matchdays} votes={votes} />;
}
