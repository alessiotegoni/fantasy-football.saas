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
import { Suspense } from "react";
import { default as PlayerSelectionButton } from "./PlayerSelection";

type FilterType = "search" | "teams" | "roles";

interface PlayersListProps {
  players: TeamPlayer[];
  leagueId: string;
  title?: string;
  enabledFilters?: FilterType[];
  virtualized?: boolean;
  showSelectionButton?: boolean;
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
  leagueId,
  title,
  showSelectionButton = true,
  virtualized = false,
  actionsDialog,
  emptyState,
  leagueTeams,
}: PlayersListProps) {
  const { filteredPlayers } = usePlayersFilters();

  if (children) {
    return <>{children(filteredPlayers)}</>;
  }

  if (!leagueTeams) return null

  return (
    <PlayerSelectionProvider leagueTeams={leagueTeams}>
      <div className="flex h-full flex-col">
        <div className="mb-3.5 flex items-center">
          <h2 className="grow text-xl">{title}</h2>
          {showSelectionButton && (
            <Suspense>
              <PlayerSelectionButton leagueId={leagueId} />
            </Suspense>
          )}
        </div>
        <PlayersListContent
          virtualized={virtualized!}
          actionsDialog={actionsDialog}
          emptyState={emptyState!}
        />
      </div>
    </PlayerSelectionProvider>
  );
}
