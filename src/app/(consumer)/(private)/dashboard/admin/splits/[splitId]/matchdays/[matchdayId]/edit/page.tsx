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
      <SplitMatchdayForm matchday={matchday} />
    </Container>
  );
}
