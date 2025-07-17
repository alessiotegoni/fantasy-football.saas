"use client";

import { LineupPlayerType, TacticalModule } from "@/drizzle/schema";
import { LineupPlayer } from "@/features/(league)/matches/queries/match";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type LineupPlayerWithoutVotes = TeamPlayer &
  Pick<LineupPlayer, "positionId" | "positionOrder"> & {
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
};

export type MyLineupContext = {
  myLineup: MyLineup;
  tacticalModule: TacticalModule | null;
  playersDialog: PlayersDialog;
  handleSetLineup: (lineup: MyLineup) => void;
  handleSetModule: (module: TacticalModule) => void;
  handleSetPlayersDialog: (dialog: PlayersDialog) => void;
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
    (dialog: PlayersDialog) => setPlayersDialog(dialog),
    []
  );

  const value = useMemo<MyLineupContext>(
    () => ({
      myLineup,
      tacticalModule,
      playersDialog,
      handleSetLineup,
      handleSetModule,
      handleSetPlayersDialog,
    }),
    [
      myLineup,
      tacticalModule,
      playersDialog,
      handleSetLineup,
      handleSetModule,
      handleSetPlayersDialog,
    ]
  );

  return (
    <MyLineupContext.Provider value={value}>
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
