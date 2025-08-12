import Container from "@/components/Container";
import AuctionForm from "@/features/(league)/auctions/components/AuctionForm";
import { getLeaguePlayersPerRole } from "@/features/(league)/leagues/queries/league";
import { getGeneralSettings } from "@/features/(league)/settings/queries/setting";
import { getRolesWithoutPresident } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";

export default async function CreateAuctionPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const [playersPerRole, playerRoles, { initialCredits }] = await Promise.all([
    getLeaguePlayersPerRole(leagueId),
    getRolesWithoutPresident(),
    getGeneralSettings(leagueId),
  ]);

  return (
    <Container leagueId={leagueId} headerLabel="Crea asta">
      <AuctionForm
        auction={{ playersPerRole, initialCredits }}
        playersRoles={playerRoles}
      />
    </Container>
  );
}
