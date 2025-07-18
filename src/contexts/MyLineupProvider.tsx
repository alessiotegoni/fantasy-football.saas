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

type PlayersDialog = {
  open: boolean;
  type: LineupPlayerType | null;
  roleId: number | null
};

export type MyLineupContext = {
  myLineup: MyLineup;
  tacticalModule: TacticalModule | null;
  playersDialog: PlayersDialog;
  handleSetLineup: (lineup: MyLineup) => void;
  handleSetModule: (module: TacticalModule) => void;
  handleSetPlayersDialog: (dialog: Partial<PlayersDialog>) => void;
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
  const [playersDialog, setPlayersDialog] = useState<PlayersDialog>({
    open: false,
    type: null,
    roleId: null
  });

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

  const handleSetPlayersDialog = useCallback(
    (dialog: Partial<PlayersDialog>) =>
      setPlayersDialog({ ...playersDialog, ...dialog }),
    []
  );

  return (
    <MyLineupContext.Provider
      value={{
        myLineup,
        tacticalModule,
        playersDialog,
        handleSetLineup,
        handleSetModule,
        handleSetPlayersDialog,
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
