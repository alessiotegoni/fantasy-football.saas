import Container from "@/components/Container";
import CalendarEmptyState from "@/features/(league)/(admin)/calendar/components/CalendarEmptyState";
import SplitSelect from "@/features/(league)/(admin)/calendar/components/SplitSelect";
import { getLeagueCalendar } from "@/features/(league)/(admin)/calendar/queries/calendar";
import { getSplits, Split } from "@/features/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

  const calendar = await getLeagueCalendar(leagueId, splitId);
  if (calendar) {
    const isUpcoming = split.status === "upcoming";

    return (
      <CalendarEmptyState
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

  console.log(calendar);

  return <></>;
}
