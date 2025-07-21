"use client";

import { LineupPlayerType, TacticalModule } from "@/drizzle/schema";
import { LineupTeam, MyTeam } from "@/features/(league)/matches/utils/match";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { createContext, useCallback, useEffect, useState } from "react";

export type LineupPlayerWithoutVotes = TeamPlayer & {
  positionId: string;
  positionOrder: number | null;
  lineupPlayerId: string | null;
};

type MyLineup = {
  id: string | null;
  tacticalModule: TacticalModule | null;
  benchPlayers: LineupPlayerWithoutVotes[];
  starterPlayers: LineupPlayerWithoutVotes[];
};

type PlayersDialog = {
  open: boolean;
  type: LineupPlayerType | null;
  roleId: number | null;
};

export type MyLineupContext = {
  myTeam: Omit<LineupTeam, "lineup">;
  myLineup: MyLineup;
  playersDialog: PlayersDialog;
  handleSetLineup: (lineup: MyLineup) => void;
  handleSetPlayersDialog: (dialog: Partial<PlayersDialog>) => void;
  handleSetModule: (module: TacticalModule) => void;
};

const LOCAL_STORAGE_KEY = "tacticalModule";

export const MyLineupContext = createContext<MyLineupContext | null>(null);

export default function MyLineupProvider({
  children,
  myTeam,
}: {
  children: React.ReactNode;
  myTeam: MyTeam;
}) {
  const [myLineup, setMyLineup] = useState(getInitialLineup(myTeam));

  const [playersDialog, setPlayersDialog] = useState<PlayersDialog>({
    open: false,
    type: null,
    roleId: null,
  });

  useEffect(() => {
    if (myLineup.tacticalModule) {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(myLineup.tacticalModule)
        );
      } catch {}
    }
  }, [myLineup.tacticalModule]);

  const handleSetLineup = useCallback((lineup: MyLineup) => setMyLineup(lineup), []);

  const handleSetModule = useCallback((tacticalModule: TacticalModule) => {
    setMyLineup((prev) => ({ ...prev, tacticalModule }));
  }, []);

  const handleSetPlayersDialog = useCallback(
    (dialog: Partial<PlayersDialog>) =>
      setPlayersDialog((prev) => ({ ...prev, ...dialog })),
    []
  );

  return (
    <MyLineupContext.Provider
      value={{
        myTeam: {
          id: myTeam?.id ?? null,
          imageUrl: myTeam?.imageUrl ?? null,
          name: myTeam?.name ?? null,
        },
        myLineup,
        playersDialog,
        handleSetLineup,
        handleSetPlayersDialog,
        handleSetModule,
      }}
    >
      {children}
    </MyLineupContext.Provider>
  );
}

function getInitialLineup(myTeam: MyTeam) {
  return {
    id: myTeam?.lineup?.id ?? null,
    tacticalModule: getInitialTacticalModule(myTeam?.lineup.tacticalModule),
    benchPlayers: myTeam?.lineup.players["bench"] ?? [],
    starterPlayers: myTeam?.lineup.players["starter"] ?? [],
  };
}

function getInitialTacticalModule(
  defaultTacticalModule: TacticalModule | undefined
): TacticalModule | null {
  if (defaultTacticalModule) return defaultTacticalModule;

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

