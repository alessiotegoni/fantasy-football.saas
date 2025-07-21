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

  function addPlayerToLineup(player: TeamPlayer) {
    if (!myLineup.tacticalModule || !type) {
      return;
    }

    const { starterPlayers, benchPlayers } = myLineup;
    const playerType = playersDialog.type;

    const newLineupPlayer: LineupPlayerWithoutVotes = {
      ...player,
      lineupPlayerType: type,
      positionId: null,
      positionOrder: null,
      lineupPlayerId: null,
    };

    if (playerType === "starter") {
      const { roleId } = playersDialog;
      if (roleId === 1) {
        // Presidente role
        newLineupPlayer.positionId = "PR-1";
        newLineupPlayer.positionOrder = 1;
      } else {
        const position = getNextAvailablePosition(
          starterPlayers,
          myLineup.tacticalModule.layout,
          roleId
        );

        if (position) {
          newLineupPlayer.positionId = position.positionId;
          newLineupPlayer.positionOrder = position.positionOrder;
        }
      }
      handleSetLineup({
        ...myLineup,
        starterPlayers: [...starterPlayers, newLineupPlayer],
      });
    } else if (playerType === "bench") {
      newLineupPlayer.positionOrder = benchPlayers.length + 1;
      handleSetLineup({
        ...myLineup,
        benchPlayers: [...benchPlayers, newLineupPlayer],
      });
    }
  }

  function removePlayerFromLineup(playerId: number) {
    const { starterPlayers, benchPlayers } = myLineup;

    const newStarterPlayers = starterPlayers.filter((p) => p.id !== playerId);
    const newBenchPlayers = benchPlayers.filter((p) => p.id !== playerId);

    handleSetLineup({
      ...myLineup,
      starterPlayers: newStarterPlayers,
      benchPlayers: newBenchPlayers,
    });
  }

  function getNextAvailablePosition(
    starterPlayers: LineupPlayerWithoutVotes[],
    layout: RolePosition[],
    roleId: number | null
  ) {
    if (!roleId) return null;

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
  }

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

  function movePlayer(
    playerToMove: LineupPlayerWithoutVotes,
    playerToSwapWith: LineupPlayerWithoutVotes
  ) {
    const { starterPlayers, benchPlayers } = myLineup;

    // Remove both players from their current lineups
    const newStarterPlayers = starterPlayers.filter(
      (p) => p.id !== playerToMove.id && p.id !== playerToSwapWith.id
    );
    const newBenchPlayers = benchPlayers.filter(
      (p) => p.id !== playerToMove.id && p.id !== playerToSwapWith.id
    );

    // Assign new positions and orders based on swap
    if (playerToSwapWith.lineupPlayerType === "starter") {
      // playerToMove becomes a starter
      playerToMove.lineupPlayerType = "starter";
      playerToMove.positionId = playerToSwapWith.positionId;
      playerToMove.positionOrder = playerToSwapWith.positionOrder;
      newStarterPlayers.push(playerToMove);

      // playerToSwapWith becomes a bench player
      playerToSwapWith.lineupPlayerType = "bench";
      playerToSwapWith.positionId = null;
      playerToSwapWith.positionOrder = null; // Will be reordered later
      newBenchPlayers.push(playerToSwapWith);
    } else if (playerToSwapWith.lineupPlayerType === "bench") {
      // playerToMove becomes a bench player
      playerToMove.lineupPlayerType = "bench";
      playerToMove.positionId = null;
      playerToMove.positionOrder = null; // Will be reordered later
      newBenchPlayers.push(playerToMove);

      // playerToSwapWith becomes a starter
      playerToSwapWith.lineupPlayerType = "starter";
      playerToSwapWith.positionId = playerToMove.positionId; // Inherit from playerToMove's original starter position
      playerToSwapWith.positionOrder = playerToMove.positionOrder;
      newStarterPlayers.push(playerToSwapWith);
    }

    // Reorder bench players
    newBenchPlayers.sort(
      (a, b) => (a.positionOrder ?? 0) - (b.positionOrder ?? 0)
    );

    handleSetLineup({
      ...myLineup,
      starterPlayers: newStarterPlayers,
      benchPlayers: newBenchPlayers.map((player, index) => ({
        ...player,
        positionOrder: index + 1,
      })),
    });
  }

  return {
    ...context,
    availablePlayers,
    addPlayerToLineup,
    removePlayerFromLineup,
    movePlayer,
  };
}
