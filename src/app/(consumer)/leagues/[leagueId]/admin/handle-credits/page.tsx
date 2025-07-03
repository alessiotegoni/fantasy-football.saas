import ActionButton from "@/components/ActionButton";
import Container from "@/components/Container";
import { getGeneralOptions } from "@/features/(league)/options/queries/leagueOptions";

export default async function HandleCreditsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return <Container leagueId={leagueId} headerLabel="Gestisci crediti" renderHeaderRight={}>

  </Container>
}

async function ResetCreditsButton({ leagueId }: { leagueId: string }) {
  const leagueOptions = await getGeneralOptions(leagueId)
  if (!leagueOptions) return

  return <ActionButton>
    Resetta crediti
  </ActionButton>
}
