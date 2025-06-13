"use client";

import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { getTeams } from "@/features/teams/queries/team";
import { createContext, useContext } from "react";

export type BasePlayer = {
  id: string;
  displayName: string;
  roleId: number;
  teamId: number;
  avatarUrl: string | null;
};

export type EnrichedPlayer = BasePlayer & {
  role: Role | null;
  team: Team | null;
};

export type Role = Awaited<ReturnType<typeof getPlayersRoles>>[number];
export type Team = Awaited<ReturnType<typeof getTeams>>[number];

interface PlayersContextType {
  players: BasePlayer[];
}

const PlayersContext = createContext<PlayersContextType | null>(null);

export function PlayersProvider({
  children,
  players,
}: {
  children: React.ReactNode;
  players: BasePlayer[];
}) {
  return (
    <PlayersContext.Provider value={{ players }}>
      {children}
    </PlayersContext.Provider>
  );
}

export function usePlayers() {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error("usePlayers must be used within PlayersProvider");
  }
  return context;
}
