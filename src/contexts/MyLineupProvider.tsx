"use client";

import { TacticalModule } from "@/drizzle/schema";
import { createContext, useCallback, useContext, useState } from "react";

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
  benchPlayers: LineupPlayer[];
  starterPlayers: LineupPlayer[];
} | null;

type MyLineupContext = {
  myLineup: MyLineup;
  tacticalModule: TacticalModule | null;
  handleSetLineup: (lineup: MyLineup) => void;
  handleSetModule: (module: TacticalModule) => void;
};

const MyLineupContext = createContext<MyLineupContext | null>(null);

export default function MyLineupProvider({
  children,
  defaultTacticalModule,
}: {
  children: React.ReactNode;
  defaultTacticalModule: TacticalModule | undefined;
}) {
  const [myLineup, setMyLineup] = useState<MyLineup>(null);
  const [tacticalModule, setTacticalModule] = useState<TacticalModule | null>(
    defaultTacticalModule ?? null
  );

  const handleSetLineup = useCallback(
    (lineup: MyLineup) => setMyLineup(lineup),
    []
  );
  const handleSetModule = useCallback(
    (module: TacticalModule) => setTacticalModule(module),
    []
  );

  return (
    <MyLineupContext.Provider
      value={{
        myLineup,
        tacticalModule,
        handleSetLineup,
        handleSetModule,
      }}
    >
      {children}
    </MyLineupContext.Provider>
  );
}

export function useMyLineup() {
  const context = useContext(MyLineupContext);

  if (!context) {
    throw new Error("useMyLineupProvider must be used within MyLineupProvider");
  }

  return context;
};
