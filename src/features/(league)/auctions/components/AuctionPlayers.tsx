import { getAuctionAvailablePlayers } from "@/features/(league)/auctions/queries/auction";
import { getTeams } from "@/features/teams/queries/team";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { AuctionWithSettings } from "../queries/auction";
import AuctionPlayersDialog from "./AuctionPlayersDialog";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";

type Props = {
  auction: NonNullable<AuctionWithSettings>;
};

export default async function AuctionPlayers({ auction }: Props) {
  const [players, teams, roles] = await Promise.all([
    getAuctionAvailablePlayers(auction.id),
    getTeams(),
    getPlayersRoles(),
  ]);

  const mappedPlayers: TeamPlayer[] = players.map((p) => ({
    ...p,
    purchaseCost: 0,
    leagueTeamId: "",
  }));

  return (
    <AuctionPlayersDialog
      players={mappedPlayers}
      teams={teams}
      roles={roles}
      leagueId={auction.leagueId}
    />
  );
}
