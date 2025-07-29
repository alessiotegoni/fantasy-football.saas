import Container from "@/components/Container";

export default async function CalculateMatchdayPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <Container
      headerLabel="Calcola giornate"
      leagueId={leagueId}
      className="max-w-[700px]"
    ></Container>
  );
}
