import Container from "@/components/Container";
import AuctionForm from "@/features/(league)/auctions/components/AuctionForm";
import { getLeaguePlayersPerRole } from "@/features/(league)/leagues/queries/league";
import { getGeneralSettings } from "@/features/(league)/settings/queries/setting";

export default async function CreateAuctionPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const [playersPerRole, { initialCredits }] = await Promise.all([
    getLeaguePlayersPerRole(leagueId),
    getGeneralSettings(leagueId),
  ]);

  return (
    <Container leagueId={leagueId} headerLabel="Crea asta">
      <AuctionForm auction={{ playersPerRole, initialCredits }} />
    </Container>
  );
}
