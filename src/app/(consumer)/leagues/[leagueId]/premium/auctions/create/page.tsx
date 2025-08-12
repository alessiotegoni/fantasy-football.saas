import Container from "@/components/Container";
import { getLeaguePlayersPerRole } from "@/features/(league)/leagues/queries/league";
import { getGeneralSettings } from "@/features/(league)/settings/queries/setting";

export default async function CreateAuctionPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const [leaguePlayersPerRole, { initialCredits }] = await Promise.all([
    getLeaguePlayersPerRole(leagueId),
    getGeneralSettings(leagueId),
  ]);

  return <Container leagueId={leagueId} headerLabel="Crea asta"></Container>;
}
