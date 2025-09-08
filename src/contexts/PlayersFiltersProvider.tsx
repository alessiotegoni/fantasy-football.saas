"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTeams, Team } from "@/features/dashboard/admin/teams/queries/team";
import {
  getPlayersRoles,
  PlayerRole,
  TeamPlayer,
} from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { useFilter } from "@/hooks/useFilter";
import PlayersListSearchBar from "@/features/(league)/teamsPlayers/components/PlayersListSearchBar";
import TeamsFilters from "@/features/dashboard/admin/teams/components/TeamsFilters";
import PlayersRolesFilters from "@/features/(league)/teamsPlayers/components/PlayersRolesFilters";

type Filters = {
  search: string;
  teams: number[];
  roles: number[];
};

type FilterType = "search" | "teams" | "roles";

interface PlayersFiltersContextType {
  teams: Team[];
  roles: PlayerRole[];
  filteredPlayers: TeamPlayer[];
  filters: Filters;
  handleSetFilters: (filter: Partial<Filters>) => void;
  handleResetFilters: () => void;
}

const PlayersFiltersContext = createContext<PlayersFiltersContextType | null>(
  null
);

export type PlayersFiltersProviderProps = {
  children: React.ReactNode;
  players: TeamPlayer[];
  enabledFilters?: FilterType[];
  defaultFilters?: Partial<Filters>;
  teams: Team[];
  roles: PlayerRole[];
};

export function PlayersFiltersProvider({
  children,
  players,
  enabledFilters = ["search", "teams", "roles"],
  defaultFilters,
  teams,
  roles,
}: PlayersFiltersProviderProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    teams: [],
    roles: [],
  });

  useEffect(() => {
    if (defaultFilters) setFilters((prev) => ({ ...prev, ...defaultFilters }));
  }, [defaultFilters]);

  const handleSetFilters = useCallback(
    (newFilters: Partial<Filters>) =>
      setFilters((prev) => ({ ...prev, ...newFilters })),
    []
  );

  const handleResetFilters = useCallback(
    () => setFilters({ search: "", teams: [], roles: [] }),
    []
  );

  const { filteredItems: filteredPlayers } = useFilter(players, {
    defaultFilters: filters,
    filterFn,
  });

  const isFilterEnabled = useCallback(
    (filter: FilterType) => enabledFilters.includes(filter),
    [enabledFilters]
  );

  const renderFilters = () => (
    <div className="space-y-2">
      {isFilterEnabled("search") && <PlayersListSearchBar />}
      {isFilterEnabled("teams") && <TeamsFilters />}
      {isFilterEnabled("roles") && <PlayersRolesFilters />}
    </div>
  );

  return (
    <PlayersFiltersContext.Provider
      value={{
        teams,
        roles,
        filteredPlayers,
        filters,
        handleSetFilters,
        handleResetFilters,
      }}
    >
      {renderFilters()}
      {children}
    </PlayersFiltersContext.Provider>
  );
}

function filterFn(player: TeamPlayer, filters: Filters) {
  const matchesSearch = player.displayName
    .toLowerCase()
    .includes(filters.search.toLowerCase());
  const matchesTeam =
    filters.teams.length === 0 || filters.teams.includes(player.team.id);
  const matchesRole =
    filters.roles.length === 0 || filters.roles.includes(player.role.id);

  return matchesSearch && matchesTeam && matchesRole;
}

export function usePlayersFilters() {
  const context = useContext(PlayersFiltersContext);
  if (!context) {
    throw new Error(
      "usePlayersFilters must be used within PlayersFiltersProvider"
    );
  }

  return context;
}
