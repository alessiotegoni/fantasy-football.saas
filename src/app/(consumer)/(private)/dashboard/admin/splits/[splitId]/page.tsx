import Container from "@/components/Container";
import LinkButton from "@/components/LinkButton";
import { StatusBadge } from "@/features/dashboard/admin/splits/components/SplitStatus";
import { Plus } from "iconoir-react";
import { Split, SplitStatusType } from "@/drizzle/schema/splits";
import { SplitMatchday } from "@/drizzle/schema/splitMatchdays";
import { SplitMatchdayCard } from "@/features/dashboard/admin/splits/components/SplitMatchdayCard";

export default async function SplitDetailPage({
  params,
}: PageProps<"/dashboard/admin/splits/[splitId]">) {
  const { splitId } = await params;
  // Mock data for a single split
  const split: Split = {
    id: parseInt(splitId),
    name: `Split ${splitId} - Example Split`,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    status: "live" as SplitStatusType, // Cast to SplitStatusType
  };

  // Mock data for split matchdays
  const splitMatchdays: SplitMatchday[] = [
    {
      id: 101,
      splitId: parseInt(splitId),
      number: 1,
      startAt: new Date("2025-09-01T10:00:00Z"),
      endAt: new Date("2025-09-02T10:00:00Z"),
      status: "live" as SplitStatusType,
      type: "regular",
    },
    {
      id: 102,
      splitId: parseInt(splitId),
      number: 2,
      startAt: new Date("2025-09-08T10:00:00Z"),
      endAt: new Date("2025-09-09T10:00:00Z"),
      status: "upcoming" as SplitStatusType,
      type: "regular",
    },
    {
      id: 103,
      splitId: parseInt(splitId),
      number: 3,
      startAt: new Date("2025-09-15T10:00:00Z"),
      endAt: new Date("2025-09-16T10:00:00Z"),
      status: "ended" as SplitStatusType,
      type: "regular",
    },
  ].sort((a, b) => a.number - b.number); // Sort in ascending order

  return (
    <Container
      headerLabel={split.name}
      renderHeaderRight={() => (
        <div className="flex items-center space-x-4">
          <StatusBadge status={split.status} />
          <LinkButton
            href={`/admin/splits/${split.id}/matchdays/create`}
            className="w-fit"
          >
            <Plus className="size-5" />
            Crea giornate
          </LinkButton>
        </div>
      )}
    >
      <h2 className="text-xl font-semibold mb-4">Matchdays</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {splitMatchdays.map((matchday) => (
          <SplitMatchdayCard
            key={matchday.id}
            matchday={matchday}
            splitId={split.id}
          />
        ))}
      </div>
    </Container>
  );
}
