import Container from "@/components/Container";
import SplitSelect from "@/features/splits/components/SplitSelect";
import {
  getCurrentMatchday,
  getSplits,
  Split,
  SplitMatchday,
} from "@/features/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { WarningTriangle } from "iconoir-react";
import { Suspense } from "react";
import EmptyState from "@/components/EmptyState";
import BackButton from "@/components/BackButton";
import CalendarEmptyState from "@/features/(league)/(admin)/calendar/regular/components/CalendarEmptyState";
import {
  getRegularCalendar,
  Match,
} from "@/features/(league)/(admin)/calendar/regular/queries/calendar";
import MatchdaySection from "@/features/(league)/(admin)/calendar/regular/components/MatchdaySection";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams: Promise<{ splitId?: string }>;
};
export default async function LeagueCalendarPage({
  params,
  searchParams,
}: Props) {
  const [{ leagueId }, splits] = await Promise.all([params, getSplits()]);

  const lastSplit = splits.at(-1);

  return (
    <Container
      headerLabel="Calendario"
      leagueId={leagueId}
      renderHeaderRight={() => (
        <Suspense>
          <SplitSelect splits={splits} defaultSplit={lastSplit} />
        </Suspense>
      )}
    >
      <Suspense>
        <SuspenseBoundary
          leagueId={leagueId}
          selectedSplitPromise={searchParams.then((sp) => sp.splitId)}
          splits={splits}
          lastSplit={lastSplit}
        />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  selectedSplitPromise,
  splits,
  lastSplit,
}: {
  leagueId: string;
  selectedSplitPromise: Promise<string | undefined>;
  splits: Split[];
  lastSplit?: Split;
}) {
  let selectedSplit = lastSplit;

  const selectedSplitId = parseInt((await selectedSplitPromise) ?? "0");
  if (selectedSplitId && validateSerialId(selectedSplitId).success) {
    selectedSplit = splits.find((split) => split.id === selectedSplitId);
  }

  if (!selectedSplit) {
    return (
      <EmptyState
        icon={WarningTriangle}
        title="Calendario non disponibile"
        description="Il calendario sara disponibile quando dopo l'annuncio dello split lo genererai"
        renderButton={() => <BackButton />}
      />
    );
  }

  const calendar = await getRegularCalendar(leagueId, selectedSplit.id);
  if (!calendar) {
    const isUpcoming = selectedSplit.status === "upcoming";

    return (
      <CalendarEmptyState
        icon={WarningTriangle}
        leagueId={leagueId}
        showButton={isUpcoming}
        description={
          !isUpcoming
            ? `Lo split e' ${
                selectedSplit.status === "ended"
                  ? "gia finito"
                  : "appena iniziato"
              } e non puoi piu generare il calendario`
            : undefined
        }
      />
    );
  }

  const groupedMatches = Object.groupBy(
    calendar,
    (match) => match.splitMatchday.number
  );

  return (
    <div className="space-y-8">
      <Suspense fallback={<CalendarSections matches={groupedMatches} />}>
        <CalendarSections
          matches={groupedMatches}
          currentMatchday={await getCurrentMatchday(selectedSplit.id)}
        />
      </Suspense>
    </div>
  );
}

function CalendarSections({
  matches,
  currentMatchday,
}: {
  matches: Partial<Record<number, Match[]>>;
  currentMatchday?: SplitMatchday;
}) {
  return Object.entries(matches).map(
    ([matchdayNum, matches]) =>
      matches && (
        <MatchdaySection
          key={matchdayNum}
          matchday={matches[0].splitMatchday}
          matches={matches}
          currentMatchday={currentMatchday}
        />
      )
  );
}
