"use client";

import { Player } from "@/features/players/queries/player";
import { createContext, useCallback, useContext, useState } from "react";

type AuctionPlayerContextType = {
  selectedPlayer: Player | null;
  toggleSelectPlayer: (player: Player | null) => void;
};

const AuctionPlayerContext = createContext<AuctionPlayerContextType | null>(
  null
);

export default function AuctionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const toggleSelectPlayer = useCallback(setSelectedPlayer, []);

  return (
    <AuctionPlayerContext.Provider
      value={{
        selectedPlayer,
        toggleSelectPlayer,
      }}
    >
      {children}
    </AuctionPlayerContext.Provider>
  );
}

export function useAuctionPlayer() {
  const context = useContext(AuctionPlayerContext);
  if (!context) {
    throw new Error(
      "useAuctionPlayer must be used within AuctionPlayerContext"
    );
  }
  return context;
}
