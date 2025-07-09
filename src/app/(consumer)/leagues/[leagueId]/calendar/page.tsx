import Container from "@/components/Container";
import CalendarEmptyState from "@/features/(league)/(admin)/calendar/components/CalendarEmptyState";
import SplitSelect from "@/features/(league)/(admin)/calendar/components/SplitSelect";
import { getLeagueCalendar } from "@/features/(league)/(admin)/calendar/queries/calendar";
import { getSplits, Split } from "@/features/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { WarningTriangle } from "iconoir-react";
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

  console.log(calendar);

  const groupedMatches = Object.groupBy(
    calendar,
    (match) => match.splitMatchday.number
  );

  return (
    <div className="space-y-6 pb-20">
      {Object.entries(groupedMatches).map(
        ([day, matches]) =>
          matches && (
            <div key={day}>
              <div className="bg-primary text-white font-semibold text-sm px-4 py-2 rounded-t-md">
                {day}ª giornata - {matches[0].splitMatchday.status}
              </div>

              <div className="bg-white rounded-b-md shadow-sm divide-y">
                {matches.map((match) => {
                  const home = match.homeTeam;
                  const away = match.awayTeam;

                  const homeResult = match.matchResults?.find(
                    (r) => r.teamId === home.id
                  );
                  const awayResult = match.matchResults?.find(
                    (r) => r.teamId === away.id
                  );

                  return (
                    <div key={match.id} className="flex items-center px-4 py-3">
                      {/* Home */}
                      <div className="flex-1 flex items-center gap-2">
                        {/* {home.imageUrl && (
                          <Image
                            src={home.imageUrl}
                            alt={home.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )} */}
                        <div className="text-sm font-medium">{home?.name}</div>
                      </div>

                      {/* Score */}
                      <div className="text-center min-w-[80px]">
                        <div className="text-primary text-xl font-bold">
                          {homeResult ? homeResult.goals : 0} -{" "}
                          {awayResult ? awayResult.goals : 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {homeResult?.totalScore ?? "-"}{" "}
                          <span className="text-gray-300">·</span>{" "}
                          {awayResult?.totalScore ?? "-"}
                        </div>
                      </div>

                      {/* Away */}
                      <div className="flex-1 flex items-center justify-end gap-2 text-right">
                        <div className="text-sm font-medium">{away?.name}</div>
                        {/* {away.imageUrl && (
                          <Image
                            src={away.imageUrl}
                            alt={away.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )} */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
      )}
    </div>
  );
}
