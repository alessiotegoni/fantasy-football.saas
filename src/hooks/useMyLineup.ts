"use client";

import { useContext, useMemo } from "react";
import {
  MyLineupContext,
  LineupPlayerWithoutVotes,
} from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import {
  getPositionOrder,
  isValidPositionId,
  reorderBench,
} from "@/features/(league)/matches/utils/match";
import useSortPlayers from "./useSortPlayers";

export default function useMyLineup(teamPlayers: TeamPlayer[] = []) {
  const context = useContext(MyLineupContext);
  if (!context)
    throw new Error("useMyLineup must be used within a MyLineupProvider");

  const { myLineup, playersDialog, handleSetLineup } = context;
  const { tacticalModule, starterPlayers, benchPlayers } = myLineup;
  const { roleId, positionId, type } = playersDialog;

  const { sortPlayers } = useSortPlayers();

  // console.log(starterPlayers, benchPlayers);

  function addPlayerToLineup(player: TeamPlayer) {
    if (!tacticalModule || !type) return;

    const newPlayer: LineupPlayerWithoutVotes = {
      ...player,
      lineupPlayerType: type,
      positionId: null,
      positionOrder: null,
      lineupPlayerId: null,
    };

    if (
      type === "starter" &&
      roleId &&
      positionId &&
      isValidPositionId(positionId, roleId, tacticalModule.layout)
    ) {
      newPlayer.positionId = positionId;
      newPlayer.positionOrder = getPositionOrder(positionId);
      handleSetLineup({
        ...myLineup,
        starterPlayers: [...starterPlayers, newPlayer],
      });
    }

    if (type === "bench") {
      newPlayer.positionOrder = benchPlayers.length + 1;
      handleSetLineup({
        ...myLineup,
        benchPlayers: [...benchPlayers, newPlayer],
      });
    }
  }

  function removePlayerFromLineup(playerId: number) {
    const updatedStarter = starterPlayers.filter((p) => p.id !== playerId);
    const updatedBench = benchPlayers.filter((p) => p.id !== playerId);
    handleSetLineup({
      ...myLineup,
      starterPlayers: updatedStarter,
      benchPlayers: updatedBench,
    });
  }

  function movePlayer(
    source: LineupPlayerWithoutVotes,
    target: LineupPlayerWithoutVotes
  ) {
    const filteredStarters = starterPlayers.filter(
      (p) => p.id !== source.id && p.id !== target.id
    );
    const filteredBench = benchPlayers.filter(
      (p) => p.id !== source.id && p.id !== target.id
    );

    if (target.lineupPlayerType === "starter") {
      source.lineupPlayerType = "starter";
      source.positionId = target.positionId;
      source.positionOrder = target.positionOrder;
      filteredStarters.push(source);

      target.lineupPlayerType = "bench";
      target.positionId = null;
      target.positionOrder = null;
      filteredBench.push(target);
    } else {
      source.lineupPlayerType = "bench";
      source.positionId = null;
      source.positionOrder = null;
      filteredBench.push(source);

      target.lineupPlayerType = "starter";
      target.positionId = source.positionId;
      target.positionOrder = source.positionOrder;
      filteredStarters.push(target);
    }

    handleSetLineup({
      ...myLineup,
      starterPlayers: filteredStarters,
      benchPlayers: reorderBench(filteredBench),
    });
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

    return roleId ? fullList.filter((p) => p.role.id === roleId) : fullList;
  }, [teamPlayers, starterPlayers, benchPlayers, type, roleId]);

  return {
    ...context,
    availablePlayers,
    addPlayerToLineup,
    removePlayerFromLineup,
    movePlayer,
  };
}
