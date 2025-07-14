"use client";

import { TacticalModule } from "@/drizzle/schema";
import { createContext, useCallback, useState } from "react";

type LineupPlayer = {
  id: string;
  playerId: string;
  roleId: number;
  positionId: string;
  positionOrder: number;
  totalVote: number;
};

type MyLineup = {
  id: string;
  tacticalModule: TacticalModule;
  benchPlayers: LineupPlayer[];
  starterPlayers: LineupPlayer[];
} | null;

type MyLineupContext = {
  myLineup: MyLineup;
  handleSetLineup: (lineup: MyLineup) => void;
};

const MyLineupContext = createContext<MyLineupContext | null>(null);

export default function MyLineupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [myLineup, setMyLineup] = useState<MyLineup>(null);
  const handleSetLineup = useCallback(
    (lineup: MyLineup) => setMyLineup(lineup),
    []
  );

  return (
    <MyLineupContext.Provider
      value={{
        myLineup,
        handleSetLineup,
      }}
    >
      {children}
    </MyLineupContext.Provider>
  );
}
