"use client";

import {
  MyLineupContext,
  LineupPlayerWithoutVotes,
} from "@/contexts/MyLineupProvider";
import { RolePosition } from "@/drizzle/schema";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { useContext, useMemo } from "react";

export default function useMyLineup(teamPlayers: TeamPlayer[] = []) {
  const context = useContext(MyLineupContext);

  if (!context) {
    throw new Error("useMyLineup must be used within a MyLineupProvider");
  }

  const { myLineup, playersDialog, handleSetLineup } = context;
  const { roleId, type } = playersDialog;

  const addPlayerToLineup = (player: TeamPlayer) => {
    if (!myLineup.tacticalModule) {
      // Handle error: tactical module not selected
      return;
    }

    const { starterPlayers, benchPlayers } = myLineup;
    const playerType = playersDialog.type;

    const newLineupPlayer: LineupPlayerWithoutVotes = {
      ...player,
      positionId: "",
      positionOrder: null,
      lineupPlayerId: null,
    };

    if (playerType === "starter") {
      const { roleId } = playersDialog;
      const position = getNextAvailablePosition(
        starterPlayers,
        myLineup.tacticalModule.layout,
        roleId
      );

      if (position) {
        newLineupPlayer.positionId = position.positionId;
        newLineupPlayer.positionOrder = position.positionOrder;
        handleSetLineup({
          ...myLineup,
          starterPlayers: [...starterPlayers, newLineupPlayer],
        });
      }
    } else if (playerType === "bench") {
      newLineupPlayer.positionOrder = benchPlayers.length + 1;
      handleSetLineup({
        ...myLineup,
        benchPlayers: [...benchPlayers, newLineupPlayer],
      });
    }
  };

  const removePlayerFromLineup = (playerId: number) => {
    const { starterPlayers, benchPlayers } = myLineup;

    const newStarterPlayers = starterPlayers.filter((p) => p.id !== playerId);
    const newBenchPlayers = benchPlayers.filter((p) => p.id !== playerId);

    handleSetLineup({
      ...myLineup,
      starterPlayers: newStarterPlayers,
      benchPlayers: newBenchPlayers,
    });
  };

  const getNextAvailablePosition = (
    starterPlayers: LineupPlayerWithoutVotes[],
    layout: RolePosition[],
    roleId: number | null
  ) => {
    if (roleId === null) return null;

    const roleLayout = layout.find((r) => r.roleId === roleId);
    if (!roleLayout) return null;

    for (const positionId of roleLayout.positionsIds) {
      const isOccupied = starterPlayers.some(
        (p) => p.positionId === positionId
      );
      if (!isOccupied) {
        const positionOrder = parseInt(positionId.split("-")[1]);
        return { positionId, positionOrder };
      }
    }

    return null;
  };

  const availablePlayers = useMemo(() => {
    const { starterPlayers, benchPlayers } = myLineup;

    // Players already in the lineup
    const lineupPlayerIds = new Set(
      [...starterPlayers, ...benchPlayers].map((p) => p.id)
    );

    // Base available players (not in lineup yet)
    const baseAvailable = teamPlayers.filter((p) => !lineupPlayerIds.has(p.id));

    let swappablePlayers: LineupPlayerWithoutVotes[] = [];
    if (type === "starter") {
      swappablePlayers = benchPlayers;
    } else if (type === "bench") {
      swappablePlayers = starterPlayers;
    }

    const allAvailable = [...baseAvailable, ...swappablePlayers];

    return roleId
      ? allAvailable.filter((p) => p.role.id === roleId)
      : allAvailable;
  }, [teamPlayers, myLineup, roleId, type]);

  return {
    ...context,
    availablePlayers,
    addPlayerToLineup,
    removePlayerFromLineup,
  };
}
