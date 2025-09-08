import { getAuctionAvailablePlayers } from "@/features/league/auctions/queries/auction";
import { getTeams } from "@/features/dashboard/admin/teams/queries/team";
import { AuctionWithSettings } from "../queries/auction";
import AuctionPlayersDialog from "./AuctionPlayersDialog";
import { PlayerRole, TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";

type Props = {
  defaultAuction: NonNullable<AuctionWithSettings>;
  playersRoles: PlayerRole[];
};

export default async function AuctionPlayers({
  defaultAuction,
  ...props
}: Props) {
  const [players, teams] = await Promise.all([
    getAuctionAvailablePlayers(defaultAuction.id),
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
