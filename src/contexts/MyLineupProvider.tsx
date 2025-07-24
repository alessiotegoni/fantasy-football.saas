"use client";

import { LineupPlayerType, PositionId, TacticalModule } from "@/drizzle/schema";
import { tacticalModuleSchema } from "@/features/(league)/matches/schema/matchTacticalModule";
import {
  groupLineupsPlayers,
  LineupTeam,
  MyTeam,
} from "@/features/(league)/matches/utils/match";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type LineupPlayerWithoutVotes = TeamPlayer & {
  lineupPlayerType: LineupPlayerType;
  positionId: PositionId | null;
  positionOrder: number;
};

export type MyLineup = {
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
  isLineupDirty: boolean;
  handleSetLineup: (lineup: Partial<MyLineup>) => void;
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
  const [initialLineup] = useState<MyLineup>(
    getInitialLineup.bind(null, myTeam)
  );
  const [myLineup, setMyLineup] = useState<MyLineup>(
    getInitialLineup.bind(null, myTeam)
  );

  const [playersDialog, setPlayersDialog] = useState<PlayersDialog>(
    getInitialDialog()
  );

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

  const handleSetLineup = useCallback(
    (lineup: Partial<MyLineup>) => setMyLineup({ ...myLineup, ...lineup }),
    []
  );

  const handleSetModule = useCallback((tacticalModule: TacticalModule) => {
    setMyLineup((prev) => ({ ...prev, tacticalModule }));
  }, []);

  const handleSetPlayersDialog = useCallback(
    (dialog: Partial<PlayersDialog>) =>
      setPlayersDialog((prev) => ({ ...prev, ...dialog })),
    []
  );

  const isLineupDirty = useMemo(() => {
    if (myLineup.tacticalModule?.id !== initialLineup.tacticalModule?.id) {
      return true;
    }

    const starterIds = myLineup.starterPlayers.map((p) => p.id).sort();
    const initialStarterIds = initialLineup.starterPlayers
      .map((p) => p.id)
      .sort();

    if (JSON.stringify(starterIds) !== JSON.stringify(initialStarterIds)) {
      return true;
    }

    const benchIds = myLineup.benchPlayers.map((p) => p.id).sort();
    const initialBenchIds = initialLineup.benchPlayers.map((p) => p.id).sort();

    if (JSON.stringify(benchIds) !== JSON.stringify(initialBenchIds)) {
      return true;
    }

    return false;
  }, [myLineup, initialLineup]);

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
        isLineupDirty,
        handleSetLineup,
        handleSetPlayersDialog,
        handleSetModule,
      }}
    >
      {children}
    </MyLineupContext.Provider>
  );
}

function getInitialDialog() {
  return {
    open: false,
    type: null,
    roleId: null,
  };
}

function getInitialLineup(myTeam: MyTeam) {
  const groupedPlayers = groupLineupsPlayers(myTeam?.lineup.players ?? []);

  return {
    id: myTeam?.lineup?.id ?? null,
    tacticalModule: getInitialTacticalModule(myTeam?.lineup.tacticalModule),
    benchPlayers: groupedPlayers["bench"] ?? [],
    starterPlayers: groupedPlayers["starter"] ?? [],
  };
}

function getInitialTacticalModule(
  defaultTacticalModule: TacticalModule | undefined
): TacticalModule | null {
  if (defaultTacticalModule) return defaultTacticalModule;

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return tacticalModuleSchema.parse(parsed);
    }
    return null;
  } catch {
    return null;
  }
}
