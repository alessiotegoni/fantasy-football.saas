"use client";

import {
  PlayersFiltersProvider,
  usePlayersFilters,
} from "@/contexts/PlayersFiltersProvider";
import { PlayerSelectionProvider } from "@/contexts/PlayerSelectionProvider";
import { Team } from "@/features/teams/queries/team";
import {
  PlayerRole,
  TeamPlayer,
} from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import PlayersListContent from "./PlayerListContent";

type FilterType = "search" | "teams" | "roles";

interface PlayersListProps {
  players: TeamPlayer[];
  title?: string;
  enabledFilters?: FilterType[];
  virtualized?: boolean;
  selectionButton?: React.ReactNode;
  actionsDialog?: React.ReactNode;
  emptyState?: React.ReactNode;
  teams: Team[];
  roles: PlayerRole[];
  leagueTeams?: { id: string; name: string }[];
  children?: (players: TeamPlayer[]) => React.ReactNode;
}

export default function PlayersList({ children, ...props }: PlayersListProps) {
  return (
    <PlayersFiltersProvider {...props}>
      <PlayersListInner {...props}>{children}</PlayersListInner>
    </PlayersFiltersProvider>
  );
}

function PlayersListInner({
  children,
  title = "Giocatori",
  selectionButton,
  virtualized = false,
  actionsDialog,
  emptyState,
  leagueTeams,
}: PlayersListProps) {
  const { filteredPlayers } = usePlayersFilters();

  if (children) {
    return <>{children(filteredPlayers)}</>;
  }

  if (!leagueTeams) return null;

  return (
    <PlayerSelectionProvider leagueTeams={leagueTeams}>
      <div className="flex h-full flex-col">
        <div className="mb-3.5 flex items-center">
          <h2 className="grow text-xl">{title}</h2>
          {selectionButton}
        </div>
        <PlayersListContent
          virtualized={virtualized}
          actionsDialog={actionsDialog}
          emptyState={emptyState}
        />
      </div>
    </PlayerSelectionProvider>
  );
}
