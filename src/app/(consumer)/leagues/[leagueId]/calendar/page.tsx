import Container from "@/components/Container";
import CalendarEmptyState from "@/features/(league)/(admin)/calendar/components/CalendarEmptyState";
import SplitSelect from "@/features/splits/components/SplitSelect";
import {
  getLeagueCalendar,
  Match,
} from "@/features/(league)/(admin)/calendar/queries/calendar";
import {
  getCurrentMatchday,
  getSplits,
  Split,
  SplitMatchday,
} from "@/features/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { WarningTriangle } from "iconoir-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import MatchdaySection from "@/features/(league)/(admin)/calendar/components/MatchdaySection";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams: Promise<{ splitId: string }>;
};
export default async function LeagueCalendarPage({
  params,
  searchParams,
}: Props) {
  const [{ leagueId }, splits] = await Promise.all([params, getSplits()]);

  return (
    <Container
      headerLabel="Calendario"
      leagueId={leagueId}
      renderHeaderRight={() => (
        <Suspense>
          <SplitSelect splits={splits} />
        </Suspense>
      )}
    >
      <Suspense>
        <SuspenseBoundary
          leagueId={leagueId}
          splitIdPromise={searchParams.then((sp) => sp.splitId)}
          splits={splits}
        />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  splitIdPromise,
  splits,
}: {
  leagueId: string;
  splitIdPromise: Promise<string>;
  splits: Split[];
}) {
  const splitId = parseInt(await splitIdPromise);
  if (!validateSerialId(splitId).success) notFound();

  const split = splits.find((split) => split.id === splitId);
  if (!split) notFound();

  const calendar = await getLeagueCalendar(leagueId, split.id);
  if (!calendar) {
    const isUpcoming = split.status === "upcoming";

    return (
      <CalendarEmptyState
        icon={WarningTriangle}
        leagueId={leagueId}
        showButton={isUpcoming}
        description={
          !isUpcoming
            ? `Lo split e' ${
                split.status === "ended" ? "gia finito" : "appena iniziato"
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
          currentMatchday={await getCurrentMatchday(split.id)}
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
