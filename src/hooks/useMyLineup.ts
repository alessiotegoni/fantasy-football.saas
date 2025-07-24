"use client";

import { useContext, useMemo } from "react";
import {
  MyLineupContext,
  LineupPlayerWithoutVotes,
} from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { reorderBench } from "@/features/(league)/matches/utils/match";
import useSortPlayers from "./useSortPlayers";
import { PositionId } from "@/drizzle/schema";

export default function useMyLineup(teamPlayers: TeamPlayer[] = []) {
  const context = useContext(MyLineupContext);
  if (!context)
    throw new Error("useMyLineup must be used within a MyLineupProvider");

  const { myLineup, playersDialog, handleSetLineup } = context;
  const { starterPlayers, benchPlayers } = myLineup;
  const { roleId, type } = playersDialog;

  const { sortPlayers } = useSortPlayers();

  function addBenchPlayer(
    newPlayer: Omit<LineupPlayerWithoutVotes, "positionId">
  ) {
    editLineup({
      benchPlayers: [...benchPlayers, { ...newPlayer, positionId: null }],
      starterPlayers: starterPlayers.filter((p) => p.id !== newPlayer.id),
    });
  }

  function addStarterPlayer(
    newPlayer: Omit<LineupPlayerWithoutVotes, "positionId"> & {
      positionId: PositionId;
    }
  ) {
    editLineup({
      starterPlayers: [...starterPlayers, newPlayer],
      benchPlayers: benchPlayers.filter((p) => p.id !== newPlayer.id),
    });
  }

  function editLineup({
    starterPlayers,
    benchPlayers,
  }: {
    starterPlayers: LineupPlayerWithoutVotes[];
    benchPlayers: LineupPlayerWithoutVotes[];
  }) {
    handleSetLineup({ ...myLineup, starterPlayers, benchPlayers });
  }

  console.log(starterPlayers);

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
      target.positionOrder = source.positionOrder;
      filteredBench.push(target);
    } else {
      source.lineupPlayerType = "bench";
      source.positionId = null;
      source.positionOrder = target.positionOrder;
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
    addBenchPlayer,
    addStarterPlayer,
    removePlayerFromLineup,
    movePlayer,
  };
}
