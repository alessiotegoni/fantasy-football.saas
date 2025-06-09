"use client";
import { createContext, useCallback, useState } from "react";

type MultiplayerSelectionContextType = {
  isSelectionMode: boolean;
  selectedPlayerId: string | null;
  selectedTeamId: number | null;
  startSelectionMode: () => void;
  stopSelectionMode: () => void;
  toggleSelectPlayer: (playerId: string | null) => void;
  toggleSelectTeam: (teamId: number | null) => void;
};

export const MultiplayerSelectionContext =
  createContext<MultiplayerSelectionContextType | null>(null);

export function MultiPlayerSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const startSelectionMode = useCallback(() => setIsSelectionMode(true), []);
  const stopSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedPlayerId(null);
  }, []);

  const toggleSelectPlayer = useCallback(setSelectedPlayerId, []);
  const toggleSelectTeam = useCallback(setSelectedTeamId, []);

  return (
    <MultiplayerSelectionContext.Provider
      value={{
        isSelectionMode,
        selectedPlayerId,
        toggleSelectPlayer,
        selectedTeamId,
        toggleSelectTeam,
        startSelectionMode,
        stopSelectionMode,
      }}
    >
      <div className="mt-4">{children}</div>
    </MultiplayerSelectionContext.Provider>
  );
}
