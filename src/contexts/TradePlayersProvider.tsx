"use client"

import { createContext, useContext, useMemo } from "react";
import { EnrichedPlayer } from "./PlayersProvider";
import { usePlayersEnrichment } from "./PlayersEnrichmentProvider";

interface TradePlayersContextType {
  proposerTeamPlayers: EnrichedPlayer[];
  receiverTeamPlayers: EnrichedPlayer[];
}

const TradePlayersContext = createContext<TradePlayersContextType | null>(null);

export default function TradePlayersProvider({
  children,
  proposerTeamId,
  receiverTeamId,
}: {
  children: React.ReactNode;
  proposerTeamId: string | undefined;
  receiverTeamId: string | undefined;
}) {
  const { enrichedPlayers } = usePlayersEnrichment();

  const proposerTeamPlayers = useMemo(() => {
    if (!proposerTeamId) return [];
    return enrichedPlayers.filter(
      (player) => player.leagueTeamId === proposerTeamId
    );
  }, [enrichedPlayers, proposerTeamId]);

  const receiverTeamPlayers = useMemo(() => {
    if (!receiverTeamId) return [];
    return enrichedPlayers.filter(
      (player) => player.leagueTeamId === receiverTeamId
    );
  }, [enrichedPlayers, receiverTeamId]);

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
