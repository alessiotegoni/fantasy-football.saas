"use client";

import {
  PlayersFiltersProvider,
  PlayersFiltersProviderProps,
  usePlayersFilters,
} from "@/contexts/PlayersFiltersProvider";
import { PlayerSelectionProvider } from "@/contexts/PlayerSelectionProvider";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import PlayersListContent from "../features/(league)/teamsPlayers/components/PlayerListContent";
import useSortPlayers from "@/hooks/useSortPlayers";

type PlayersListProps = {
  title?: string;
  virtualized?: boolean;
  selectionButton?: React.ReactNode;
  actionsDialog?: React.ReactNode;
  emptyState?: React.ReactNode;
  leagueTeams?: { id: string; name: string }[];
  children?: (players: TeamPlayer[]) => React.ReactNode;
} & Omit<PlayersFiltersProviderProps, "children">;

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
  const { sortedPlayers } = useSortPlayers(filteredPlayers);

  if (children) {
    return <>{children(sortedPlayers)}</>;
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
