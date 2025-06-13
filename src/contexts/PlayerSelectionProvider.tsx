"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { EnrichedPlayer } from "./PlayersProvider";

type PlayerSelectionContextType = {
  leagueTeamsPromise: Promise<{ id: string; name: string }[]>;
  isDialogOpen: boolean;
  isSelectionMode: boolean;
  selectedPlayer: EnrichedPlayer | null;
  selectedTeamId: string | null;
  startSelectionMode: () => void;
  stopSelectionMode: () => void;
  toggleSelectPlayer: (player: EnrichedPlayer | null) => void;
  toggleSelectTeam: (teamId: string | null) => void;
  toggleSelectDialog: (open: boolean) => void;
};

export const PlayerSelectionContext =
  createContext<PlayerSelectionContextType | null>(null);

export function PlayerSelectionProvider({
  leagueTeamsPromise,
  children,
}: {
  leagueTeamsPromise: Promise<{ id: string; name: string }[]>;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState<EnrichedPlayer | null>(
    null
  );
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const startSelectionMode = useCallback(() => setIsSelectionMode(true), []);
  const stopSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedPlayer(null);
    setSelectedTeamId(null);
  }, []);

  const toggleSelectPlayer = useCallback(setSelectedPlayer, []);
  const toggleSelectTeam = useCallback(setSelectedTeamId, []);

  const toggleSelectDialog = useCallback(setIsDialogOpen, []);

  return (
    <PlayerSelectionContext.Provider
      value={{
        leagueTeamsPromise,
        isDialogOpen,
        isSelectionMode,
        selectedPlayer,
        toggleSelectPlayer,
        selectedTeamId,
        toggleSelectTeam,
        startSelectionMode,
        stopSelectionMode,
        toggleSelectDialog,
      }}
    >
      <div className="mb-36 mt-4 lg:mb-8">{children}</div>
    </PlayerSelectionContext.Provider>
  );
}

export function usePlayerSelection() {
  const context = useContext(PlayerSelectionContext);
  if (!context) {
    throw new Error(
      "usePlayerSelection must be used within PlayerSelectionContext"
    );
  }
  return context;
}
