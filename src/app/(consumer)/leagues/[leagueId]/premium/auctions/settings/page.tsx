import Container from "@/components/Container";

export default async function AuctionsSettingsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <Container leagueId={leagueId} headerLabel="Impostazioni aste"></Container>
  );
}
