import Container from "@/components/Container";
import { getLeagueCalendar } from "@/features/(league)/(admin)/calendar/queries/calendar";
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
  const { leagueId } = await params;

  return (
    <Container headerLabel="Calendario" leagueId={leagueId}>
      <Suspense>
        <SuspenseBoundary leagueId={leagueId} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  searchParams,
}: Pick<Props, "searchParams"> & {
  leagueId: string;
}) {
  const { splitId } = await searchParams;

  const parsedSplitId = parseInt(splitId);
  if (!validateSerialId(parsedSplitId).success) notFound();

  const calendar = await getLeagueCalendar(leagueId, parsedSplitId);

  return <></>
}
