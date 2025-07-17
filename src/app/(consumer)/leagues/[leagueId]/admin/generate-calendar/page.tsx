import ActionButton from "@/components/ActionButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { leagueMatches, splitMatchdays, splits } from "@/drizzle/schema";
import { regenerateCalendar } from "@/features/(league)/(admin)/calendar/actions/calendar";
import CalendarEmptyState from "@/features/(league)/(admin)/calendar/components/CalendarEmptyState";
import { getUpcomingSplit } from "@/features/splits/queries/split";
import { and, count, eq } from "drizzle-orm";
import { NavArrowRight, WarningTriangle } from "iconoir-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function GenerateCalendarPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const [{ leagueId }, upcomingSplit] = await Promise.all([
    params,
    getUpcomingSplit(),
  ]);

  return (
    <Container leagueId={leagueId} headerLabel="Genera calendario">
      {upcomingSplit ? (
        <Suspense>
          <SuspenseBoundary leagueId={leagueId} splitId={upcomingSplit.id} />
        </Suspense>
      ) : (
        <EmptyState
          icon={WarningTriangle}
          title="Split non disponibile"
          description="Lo split è già iniziato o non è ancora stato annunciato. Non puoi generare un nuovo calendario."
        />
      )}
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  splitId,
}: {
  leagueId: string;
  splitId: number;
}) {
  const hasCalendar = await hasGeneratedCalendar(leagueId, splitId);

  return hasCalendar ? (
    <>
      <p className="text-muted-foreground mb-4">
        Il calendario è già stato generato. Puoi rigenerarlo se necessario.
      </p>
      <MobileButtonsContainer>
        <div
          className="mt-7 sm:mt-0 flex flex-col sm:flex-row
      sm:items-center sm:justify-end gap-3"
        >
          <ActionButton
            className="sm:w-fit sm:mt-7 !px-5"
            variant="outline"
            loadingText="Rigenero calendario"
            action={regenerateCalendar.bind(null, leagueId)}
          >
            Rigenera
          </ActionButton>
          <Button asChild className="sm:w-fit sm:mt-7 !px-5">
            <Link href={`/leagues/${leagueId}/calendar?splitId=${splitId}`}>
              Vedi
              <NavArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </MobileButtonsContainer>
    </>
  ) : (
    <CalendarEmptyState leagueId={leagueId} />
  );
}

async function hasGeneratedCalendar(leagueId: string, splitId: number) {
  const [result] = await db
    .select({ count: count() })
    .from(leagueMatches)
    .innerJoin(
      splitMatchdays,
      eq(splitMatchdays.id, leagueMatches.splitMatchdayId)
    )
    .innerJoin(splits, eq(splits.id, splitMatchdays.splitId))
    .where(and(eq(splits.id, splitId), eq(leagueMatches.leagueId, leagueId)));

  return result.count > 0;
}
