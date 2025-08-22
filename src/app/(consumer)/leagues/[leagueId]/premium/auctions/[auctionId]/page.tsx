import { getAuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";

type Props = {
  params: Promise<{
    leagueId: string;
    auctionId: string;
  }>;
};

export default async function AuctionPage({ params }: Props) {
  const { leagueId, auctionId } = await params;

  const [auction, playerRoles] = await Promise.all([
    getAuctionWithSettings(auctionId),
    getPlayersRoles(),
  ]);

  return <div>AuctionPage</div>;
}
