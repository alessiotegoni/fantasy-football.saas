import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import { Button } from "@/components/ui/button";
import { regenerateCalendar } from "@/features/league/admin/calendar/regular/actions/calendar";
import { hasGeneratedCalendar } from "@/features/league/admin/calendar/regular/permissions/calendar";
import { getUpcomingSplit } from "@/features/dashboard/admin/splits/queries/split";
import { CalendarRotate, NavArrowRight, WarningTriangle } from "iconoir-react";
import Link from "next/link";
import { Suspense } from "react";
import GenerateCalendarBanner from "@/features/league/admin/calendar/regular/components/GenerateCalendarBanner";

export default async function GenerateCalendarPage({
  params,
}: PageProps<"/league/[leagueId]/admin/generate-calendar">) {
  const [{ leagueId }, upcomingSplit] = await Promise.all([
    params,
    getUpcomingSplit(),
  ]);

  return (
    <Container headerLabel="Genera calendario">
      {upcomingSplit ? (
        <Suspense>
          <SuspenseBoundary leagueId={leagueId} splitId={upcomingSplit.id} />
        </Suspense>
      ) : (
        <EmptyState
          icon={WarningTriangle}
          title="Calendario non generabile"
          description="Lo split è già iniziato o non è ancora stato annunciato. Non puoi generare un nuovo calendario."
          renderButton={() => <BackButton />}
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
  if (hasCalendar) {
    return (
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
              <CalendarRotate className="size-5" />
              Rigenera
            </ActionButton>
            <Button asChild className="sm:w-fit sm:mt-7 !px-5">
              <Link href={`/league/${leagueId}/calendar?splitId=${splitId}`}>
                Vedi
                <NavArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </MobileButtonsContainer>
      </>
    );
  }

  return <GenerateCalendarBanner />;
}
