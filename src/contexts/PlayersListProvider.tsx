"use client";

import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/player";
import { getTeams } from "@/features/teams/queries/team";
import { createContext, useCallback, useMemo, useState } from "react";

type Player = {
  id: string;
  displayName: string;
  roleId: number;
  teamId: number;
  avatarUrl: string | null;
};

export type Role = Awaited<ReturnType<typeof getPlayersRoles>>[number];
export type Team = Awaited<ReturnType<typeof getTeams>>[number];

export type EnrichPlayer = Omit<Player, "roleId" | "teamId"> & {
  role: Role | null;
  team: Team | null;
};

type Filters = { search: string; teams: number[]; roles: number[] };

export interface PlayerListContext {
  players: EnrichPlayer[];
  filters: Filters;
  handleSetFilters: (filter: Partial<Filters>) => void;
  handleResetFilters: () => void;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const playersListContext = createContext<PlayerListContext | null>(null);

export function PlayersListProvider({
  players,
  children,
}: {
  players: Player[];
  children: React.ReactNode;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    teams: [],
    roles: [],
  });

  const handleSetFilters = useCallback(
    (filters: Partial<Filters>) =>
      setFilters((prev) => ({ ...prev, ...filters })),
    [filters]
  );

  const handleResetFilters = useCallback(
    () => setFilters({ search: "", teams: [], roles: [] }),
    []
  );

  const enrichedPlayers = useMemo(() => {
    const rolesMap = new Map(roles.map((r) => [r.id, r]));
    const teamsMap = new Map(teams.map((t) => [t.id, t]));

    return players
      .map((player) => ({
        ...player,
        role: rolesMap.get(player.roleId) ?? null,
        team: teamsMap.get(player.teamId) ?? null,
      }))
      .sort((a, b) => a.roleId - b.roleId);
  }, [players, teams, roles]);

  return (
    <playersListContext.Provider
      value={{
        players: enrichedPlayers,
        filters,
        handleSetFilters,
        handleResetFilters,
        teams,
        setTeams,
        roles,
        setRoles,
      }}
    >
      <div className="space-y-2">{children}</div>
    </playersListContext.Provider>
  );
}
