"use client";

import { useContext, useMemo } from "react";
import { MyLineupContext } from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import useSortPlayers from "./useSortPlayers";
import { LineupPlayer } from "@/features/(league)/matches/queries/match";
import {
  formatTeamPlayer,
  getPositionOrder,
} from "@/features/(league)/matches/utils/LineupPlayers";
import { PositionId } from "@/drizzle/schema";
import { reorderBench } from "@/features/(league)/matches/utils/Lineup";
import { arrayMove } from "@dnd-kit/sortable";

export default function useMyLineup(teamPlayers: TeamPlayer[] = []) {
  const context = useContext(MyLineupContext);
  if (!context) {
    throw new Error("useMyLineup must be used within a MyLineupProvider");
  }

  const {
    myLineup: { starterPlayers, benchPlayers },
    playersDialog: { roleId, type },
    handleSetLineup,
  } = context;

  const { sortPlayers } = useSortPlayers();

  function addBenchPlayer(newPlayer: LineupPlayer) {
    addLineupPlayers({
      benchPlayers: [
        ...benchPlayers,
        {
          ...newPlayer,
          positionId: null,
          positionOrder: benchPlayers.length + 1,
        },
      ],
      starterPlayers: starterPlayers.filter((p) => p.id !== newPlayer.id),
    });
  }

  function addStarterPlayer(newPlayer: LineupPlayer) {
    addLineupPlayers({
      starterPlayers: [...starterPlayers, newPlayer],
      benchPlayers: reorderBench(
        benchPlayers.filter((p) => p.id !== newPlayer.id)
      ),
    });
  }

  function addLineupPlayers({
    starterPlayers,
    benchPlayers,
  }: {
    starterPlayers: LineupPlayer[];
    benchPlayers: LineupPlayer[];
  }) {
    handleSetLineup({ starterPlayers, benchPlayers });
  }

  function removePlayerFromLineup(playerId: number) {
    const updatedStarter = starterPlayers.filter((p) => p.id !== playerId);
    const updatedBench = benchPlayers.filter((p) => p.id !== playerId);

    handleSetLineup({
      starterPlayers: updatedStarter,
      benchPlayers: reorderBench(updatedBench),
    });
  }

  function switchPlayerPosition(
    starterPlayer: LineupPlayer,
    positionId: PositionId
  ) {
    const playerIndex = starterPlayers.findIndex(
      (player) => player.id === starterPlayer.id
    );
    if (playerIndex === -1) return;

    const newStartersPlayers = starterPlayers.with(playerIndex, {
      ...starterPlayer,
      positionOrder: getPositionOrder(positionId),
      positionId,
    });
    handleSetLineup({ benchPlayers, starterPlayers: newStartersPlayers });
  }

  function reorderBenchPlayers(activeId: number, overId: number) {
    const oldIndex = benchPlayers.findIndex((p) => p.id === activeId);
    const newIndex = benchPlayers.findIndex((p) => p.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newBench = arrayMove(benchPlayers, oldIndex, newIndex);

    handleSetLineup({
      starterPlayers,
      benchPlayers: reorderBench(newBench),
    });
  }

  function swapStarterPlayers(source: LineupPlayer, target: LineupPlayer) {
    if (source.role.id !== target.role.id) return;

    const newStarters = [...starterPlayers];
    const sourceIndex = newStarters.findIndex((p) => p.id === source.id);
    const targetIndex = newStarters.findIndex((p) => p.id === target.id);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const sourcePlayer = newStarters[sourceIndex];
    const targetPlayer = newStarters[targetIndex];

    newStarters[sourceIndex] = {
      ...sourcePlayer,
      positionId: targetPlayer.positionId,
      positionOrder: targetPlayer.positionOrder,
    };
    newStarters[targetIndex] = {
      ...targetPlayer,
      positionId: sourcePlayer.positionId,
      positionOrder: sourcePlayer.positionOrder,
    };

    handleSetLineup({
      starterPlayers: newStarters,
      benchPlayers,
    });
  }

  function swapStarterWithBench(source: LineupPlayer, target: LineupPlayer) {
    if (source.role.id !== target.role.id) return;

    const starter = source.lineupPlayerType === "starter" ? source : target;
    const bench = source.lineupPlayerType === "bench" ? source : target;

    const starterInfo = starterPlayers.find((p) => p.id === starter.id);
    if (!starterInfo) return;

    const updatedStarters = starterPlayers
      .filter((p) => p.id !== starter.id)
      .concat({
        ...bench,
        lineupPlayerType: "starter",
        positionId: starterInfo.positionId,
        positionOrder: starterInfo.positionOrder,
      });

    const updatedBench = benchPlayers
      .filter((p) => p.id !== bench.id)
      .concat({
        ...starter,
        lineupPlayerType: "bench",
        positionId: null,
        positionOrder: null,
      });

    handleSetLineup({
      starterPlayers: updatedStarters,
      benchPlayers: reorderBench(updatedBench),
    });
  }

  function switchPlayers(source: LineupPlayer, target: LineupPlayer) {
    const isSourceStarter = source.lineupPlayerType === "starter";
    const isTargetStarter = target.lineupPlayerType === "starter";
    const isSourceBench = source.lineupPlayerType === "bench";
    const isTargetBench = target.lineupPlayerType === "bench";

    if (isSourceStarter && isTargetStarter) {
      swapStarterPlayers(source, target);
      return;
    }

    if (
      (isSourceStarter && isTargetBench) ||
      (isSourceBench && isTargetStarter)
    ) {
      swapStarterWithBench(source, target);
      return;
    }
  }

  const availablePlayers = useMemo(() => {
    const inLineupIds = new Set(
      [...starterPlayers, ...benchPlayers].map((p) => p.id)
    );
    const baseAvailable = teamPlayers.filter((p) => !inLineupIds.has(p.id));

    const swappable =
      type === "starter"
        ? benchPlayers
        : type === "bench"
        ? starterPlayers
        : [];

    const fullList = sortPlayers([...baseAvailable, ...swappable]);

    const players = roleId
      ? fullList.filter((p) => p.role.id === roleId)
      : fullList;

    return players.map((player) => formatTeamPlayer(player));
  }, [teamPlayers, starterPlayers, benchPlayers, type, roleId]);

  return {
    ...context,
    availablePlayers,
    addBenchPlayer,
    addStarterPlayer,
    removePlayerFromLineup,
    switchPlayers,
    switchPlayerPosition,
    reorderBenchPlayers,
  };
}
