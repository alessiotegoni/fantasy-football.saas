"use client";

import {
  CustomBonusMalus,
  LineupPlayerType,
  PositionId,
  TacticalModule,
} from "@/drizzle/schema";
import { LineupPlayer } from "@/features/league/matches/queries/match";
import { tacticalModuleSchema } from "@/features/league/matches/schema/matchTacticalModule";
import { groupLineupsPlayers } from "@/features/league/matches/utils/lineupPlayers";
import { LineupTeam, MyTeam } from "@/features/league/matches/utils/match";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type MyLineup = {
  id: string | null;
  tacticalModule: TacticalModule | null;
  benchPlayers: LineupPlayer[];
  starterPlayers: LineupPlayer[];
};

type PlayersDialog = {
  open: boolean;
  type: LineupPlayerType | null;
  roleId: number | null;
  positionId: PositionId | null;
};

export type MyLineupContext = {
  leagueBonusMalus: CustomBonusMalus;
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
  ...props
}: {
  children: React.ReactNode;
  leagueBonusMalus: CustomBonusMalus;
  myTeam: MyTeam;
}) {
  const [initialLineup, setInitialLineup] = useState<MyLineup>(
    getInitialLineup.bind(null, myTeam)
  );

  useEffect(() => {
    setInitialLineup(getInitialLineup(myTeam));
  }, [myTeam]);

  const [myLineup, setMyLineup] = useState<MyLineup>(
    getInitialLineup.bind(null, myTeam)
  );

  const [playersDialog, setPlayersDialog] = useState<PlayersDialog>(
    getInitialDialog()
  );

  const [, setTacticalModule] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    myLineup.tacticalModule
  );

  const handleSetLineup = useCallback(
    (lineup: Partial<MyLineup>) =>
      setMyLineup((prev) => ({ ...prev, ...lineup })),
    []
  );

  const handleSetModule = useCallback((tacticalModule: TacticalModule) => {
    handleSetLineup({ tacticalModule });
    setTacticalModule(tacticalModule);
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

    const getStarterSignature = (p: LineupPlayer) => `${p.id}@${p.positionId}`;
    const starterSignature = myLineup.starterPlayers
      .map(getStarterSignature)
      .sort();
    const initialStarterSignature = initialLineup.starterPlayers
      .map(getStarterSignature)
      .sort();

    if (
      JSON.stringify(starterSignature) !==
      JSON.stringify(initialStarterSignature)
    ) {
      return true;
    }

    const getBenchSignature = (p: LineupPlayer) => `${p.id}@${p.positionOrder}`;
    const benchSignature = myLineup.benchPlayers.map(getBenchSignature).sort();
    const initialBenchSignature = initialLineup.benchPlayers
      .map(getBenchSignature)
      .sort();

    if (
      JSON.stringify(benchSignature) !== JSON.stringify(initialBenchSignature)
    ) {
      return true;
    }

    return false;
  }, [myLineup, initialLineup]);

  return (
    <MyLineupContext.Provider
      value={{
        ...props,
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

function getInitialDialog(): PlayersDialog {
  return {
    open: false,
    type: null,
    roleId: null,
    positionId: null,
  };
}

function getInitialLineup(myTeam: MyTeam): MyLineup {
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
