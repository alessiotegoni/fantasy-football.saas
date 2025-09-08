"use client";

import { createContext, useContext, useMemo } from "react";
import { TeamPlayer } from "@/features/league/teamsPlayers/queries/teamsPlayer";
import useSortPlayers from "@/hooks/useSortPlayers";

interface TradePlayersContextType {
  proposerTeamPlayers: TeamPlayer[];
  receiverTeamPlayers: TeamPlayer[];
}

const TradePlayersContext = createContext<TradePlayersContextType | null>(null);

type Props = {
  children: React.ReactNode;
  proposerTeamId: string | undefined;
  receiverTeamId: string | undefined;
  teamsPlayers: TeamPlayer[];
};

export default function TradePlayersProvider({
  children,
  proposerTeamId,
  receiverTeamId,
  teamsPlayers,
}: Props) {
  const { sortedPlayers } = useSortPlayers(teamsPlayers);

  const proposerTeamPlayers = useMemo(() => {
    if (!proposerTeamId) return [];
    return sortedPlayers.filter(
      (player) => player.leagueTeamId === proposerTeamId
    );
  }, [sortedPlayers, proposerTeamId]);

  const receiverTeamPlayers = useMemo(() => {
    if (!receiverTeamId) return [];
    return sortedPlayers.filter(
      (player) => player.leagueTeamId === receiverTeamId
    );
  }, [sortedPlayers, receiverTeamId]);

  return (
    <TradePlayersContext.Provider
      value={{ proposerTeamPlayers, receiverTeamPlayers }}
    >
      {children}
    </TradePlayersContext.Provider>
  );
}

export function useTradePlayers() {
  const context = useContext(TradePlayersContext);
  if (!context) {
    throw new Error("useTradePlayers must be used within TradePlayersProvider");
  }
  return context;
}
