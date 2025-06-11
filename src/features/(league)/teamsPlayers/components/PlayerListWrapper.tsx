import { PlayersListProvider } from "@/contexts/PlayersListProvider";
import PlayersListSearchBar from "@/features/(league)/teamsPlayers/components/PlayersListSearchBar";
import PlayersRolesFilters from "@/features/(league)/teamsPlayers/components/PlayersRolesFilters";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import TeamsFilters from "@/features/teams/components/TeamsFilters";
import { getTeams } from "@/features/teams/queries/team";
import { Suspense } from "react";
import { PlayerSelectionProvider } from "@/contexts/PlayerSelectionProvider";
import PlayerSelection from "@/features/(league)/teamsPlayers/components/PlayerSelection";
import { getLeagueTeams } from "@/features/(league)/leagueTeams/queries/leagueTeam";
import VirtualizedPlayersList from "./VirtualizedPlayersList";

type Props = {
  title?: string;
  players: {
    id: string;
    displayName: string;
    roleId: number;
    teamId: number;
    avatarUrl: string | null;
  }[];
  leagueId: string;
} & React.ComponentPropsWithoutRef<typeof VirtualizedPlayersList>;

export default function PlayerListWrapper({
  title = "Giocatori",
  players,
  leagueId,
  actionsDialog,
  emptyState,
}: Props) {
  return (
    <PlayersListProvider players={players}>
      <PlayersListSearchBar />
      <Suspense>
        <TeamsFilters teamsPromise={getTeams()} />
        <PlayersRolesFilters playersRolesPromise={getPlayersRoles()} />
      </Suspense>
      <PlayerSelectionProvider
        leagueTeamsPromise={getLeagueTeams(leagueId).then((team) =>
          team.map(({ id, name }) => ({ id, name }))
        )}
      >
        <div className="flex items-center mb-3.5">
          <h2 className="text-xl grow">{title}</h2>
          <Suspense>
            <PlayerSelection leagueId={leagueId} />
          </Suspense>
        </div>
        <VirtualizedPlayersList
          actionsDialog={actionsDialog}
          emptyState={emptyState}
        />
      </PlayerSelectionProvider>
    </PlayersListProvider>
  );
}
