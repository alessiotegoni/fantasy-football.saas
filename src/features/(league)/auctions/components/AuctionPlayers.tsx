import { getAuctionAvailablePlayers } from "@/features/(league)/auctions/queries/auction";
import { getTeams } from "@/features/teams/queries/team";
import { AuctionWithSettings } from "../queries/auction";
import AuctionPlayersDialog from "./AuctionPlayersDialog";
import { PlayerRole, TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";

type Props = {
  auction: NonNullable<AuctionWithSettings>;
  playersRoles: PlayerRole[];
};

export default async function AuctionPlayers({ auction, ...props }: Props) {
  const [players, teams] = await Promise.all([
    getAuctionAvailablePlayers(auction.id),
    getTeams(),
  ]);

  const mappedPlayers: TeamPlayer[] = players.map((p) => ({
    ...p,
    purchaseCost: 0,
    leagueTeamId: "",
  }));

  return (
    <AuctionPlayersDialog players={mappedPlayers} teams={teams} {...props} />
  );
}
