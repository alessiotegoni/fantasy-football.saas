"use client";

import { LineupPlayerType, TacticalModule } from "@/drizzle/schema";
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

type PlayersDialog = {
  open: boolean;
  type: LineupPlayerType | null;
};

type MyLineupContext = {
  myLineup: MyLineup;
  tacticalModule: TacticalModule | null;
  playersDialog: PlayersDialog;
  handleSetLineup: (lineup: MyLineup) => void;
  handleSetModule: (module: TacticalModule) => void;
  handleSetPlayersDialog: (dialog: PlayersDialog) => void;
};

export const MyLineupContext = createContext<MyLineupContext | null>(null);

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
  const [playersDialog, setPlayersDialog] = useState<PlayersDialog>({
    open: false,
    type: null,
  });

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
