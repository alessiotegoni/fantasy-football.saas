import ActionButton from "@/components/ActionButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { leagueMatches, splitMatchdays, splits } from "@/drizzle/schema";
import { generateCalendar } from "@/features/(league)/(admin)/calendar/actions/calendar";
import { getUpcomingSplit } from "@/features/splits/queries/split";
import { cn } from "@/lib/utils";
import { and, count, eq } from "drizzle-orm";
import { NavArrowRight, WarningTriangle } from "iconoir-react";
import Link from "next/link";
import { ComponentPropsWithoutRef, Suspense } from "react";

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
      <div className="flex gap-3">
        <Button asChild className="!px-5">
          <Link href={`/leagues/${leagueId}/calendar`}>
            Vedi
            <NavArrowRight className="size-5" />
          </Link>
        </Button>
        <GenerateCalendarButton
          loadingText="Rigenero calendario"
          leagueId={leagueId}
        >
          Rigenera
        </GenerateCalendarButton>
      </div>
    </>
  ) : (
    <EmptyState
      title="Nessun calendario trovato"
      description="Non hai ancora generato un calendario abbinamenti, fallo cliccando sul bottone qui sotto"
      renderButton={() => (
        <GenerateCalendarButton
          loadingText="Genero calendario"
          leagueId={leagueId}
          action={generateCalendar.bind(null, leagueId)}
        >
          Genera calendario
        </GenerateCalendarButton>
      )}
    />
  );
}

// TODO: add generateCalendar server actions to buttons

function GenerateCalendarButton({
  leagueId,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ActionButton> & { leagueId: string }) {
  return (
    <ActionButton className={cn("w-fit mt-7 !px-5", className)} {...props} />
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
