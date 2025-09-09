import Container from "@/components/Container";
import { notFound } from "next/navigation";
import { getSplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import SplitMatchdayForm from "@/features/dashboard/admin/splits/components/SplitMatchdayForm";

export default async function SplitMatchdayEditPage({
  params,
}: PageProps<"/dashboard/admin/splits/[splitId]/matchdays/[matchdayId]/edit">) {
  const p = await params;

  const matchdayId = parseInt(p.matchdayId);
  const matchday = await getSplitMatchday(matchdayId);

  if (!matchday) notFound();

  return (
    <Container headerLabel={`Modifica giornata ${matchday.number}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modifica</h2>
        </div>
        <SplitMatchdayForm matchday={matchday} />
      </div>
    </Container>
  );
}
