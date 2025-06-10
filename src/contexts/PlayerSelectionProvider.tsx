"use client";
import { createContext, useCallback, useState } from "react";

type PlayerSelectionContextType = {
  leagueTeamsPromise: Promise<{ id: string; name: string }[]>;
  isSelectionMode: boolean;
  selectedPlayerId: string | null;
  selectedTeamId: string | null;
  startSelectionMode: () => void;
  stopSelectionMode: () => void;
  toggleSelectPlayer: (playerId: string | null) => void;
  toggleSelectTeam: (teamId: string | null) => void;
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
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const startSelectionMode = useCallback(() => setIsSelectionMode(true), []);
  const stopSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedPlayerId(null);
  }, []);

  const toggleSelectPlayer = useCallback(setSelectedPlayerId, []);
  const toggleSelectTeam = useCallback(setSelectedTeamId, []);

  return (
    <PlayerSelectionContext.Provider
      value={{
        leagueTeamsPromise,
        isSelectionMode,
        selectedPlayerId,
        toggleSelectPlayer,
        selectedTeamId,
        toggleSelectTeam,
        startSelectionMode,
        stopSelectionMode,
      }}
    >
      <div className="mb-36 mt-4 lg:mb-8">{children}</div>
    </PlayerSelectionContext.Provider>
  );
}
