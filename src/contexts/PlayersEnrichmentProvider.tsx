"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { EnrichedPlayer, Role, Team, usePlayers } from "./PlayersProvider";

interface PlayerEnrichmentContextType {
  enrichedPlayers: EnrichedPlayer[];
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

const PlayerEnrichmentContext =
  createContext<PlayerEnrichmentContextType | null>(null);

export function PlayersEnrichmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { players } = usePlayers()

  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

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
  }, [players, roles, teams]);

  return (
    <PlayerEnrichmentContext.Provider
      value={{
        enrichedPlayers,
        teams,
        setTeams,
        roles,
        setRoles,
      }}
    >
      {children}
    </PlayerEnrichmentContext.Provider>
  );
}

export function usePlayersEnrichment() {
  const context = useContext(PlayerEnrichmentContext);
  if (!context) {
    throw new Error(
      "usePlayerEnrichment must be used within PlayerEnrichmentProvider"
    );
  }
  return context;
}
