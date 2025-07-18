"use client";

import { LineupPlayerType, TacticalModule } from "@/drizzle/schema";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { createContext, useCallback, useEffect, useState } from "react";

export type LineupPlayerWithoutVotes = TeamPlayer & {
  positionId: string;
  positionOrder: number | null;
  lineupPlayerId: string | null;
};

type MyLineup = {
  id: string;
  benchPlayers: LineupPlayerWithoutVotes[];
  starterPlayers: LineupPlayerWithoutVotes[];
} | null;

export type MyLineupContext = {
  myLineup: MyLineup;
  tacticalModule: TacticalModule | null;
  dialogOpen: boolean;
  handleSetLineup: (lineup: MyLineup) => void;
  handleSetModule: (module: TacticalModule) => void;
  handleSetDialogOpen: (open: boolean) => void;
};

const LOCAL_STORAGE_KEY = "tacticalModule";

export const MyLineupContext = createContext<MyLineupContext | null>(null);

export default function MyLineupProvider({
  children,
  defaultTacticalModule,
}: {
  children: React.ReactNode;
  defaultTacticalModule?: TacticalModule;
}) {
  const [myLineup, setMyLineup] = useState<MyLineup>(null);
  const [tacticalModule, setTacticalModule] = useState<TacticalModule | null>(
    getInitialTacticalModule(defaultTacticalModule)
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (tacticalModule) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tacticalModule));
      } catch {}
    }
  }, [tacticalModule]);

  const handleSetLineup = useCallback(
    (lineup: MyLineup) => setMyLineup(lineup),
    []
  );

  const handleSetModule = useCallback(
    (module: TacticalModule) => setTacticalModule(module),
    []
  );

  const handleSetDialogOpen = useCallback(
    (open: boolean) => setDialogOpen(open),
    []
  );

  return (
    <MyLineupContext.Provider
      value={{
        myLineup,
        tacticalModule,
        dialogOpen,
        handleSetLineup,
        handleSetModule,
        handleSetDialogOpen,
      }}
    >
      {children}
    </MyLineupContext.Provider>
  );
}

function getInitialTacticalModule(
  defaultTacticalModule: TacticalModule | undefined
) {
  if (defaultTacticalModule) return defaultTacticalModule;

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
