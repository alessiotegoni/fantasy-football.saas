import Container from "@/components/Container";
import { getUpcomingSplit } from "@/features/splits/queries/split";

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
    <Container leagueId={leagueId} headerLabel="Genera calendario"></Container>
  );
}
