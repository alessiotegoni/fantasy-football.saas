"use client";

import { useContext, useMemo } from "react";
import { MyLineupContext } from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import useSortPlayers from "./useSortPlayers";
import { LineupPlayer } from "@/features/(league)/matches/queries/match";
import { formatTeamPlayer } from "@/features/(league)/matches/utils/LineupPlayers";
import { PositionId } from "@/drizzle/schema";

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
      benchPlayers: [...benchPlayers, { ...newPlayer, positionId: null }],
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
      positionId,
    });
    handleSetLineup({ benchPlayers, starterPlayers: newStartersPlayers });
  }

  function switchPlayers(source: LineupPlayer, target: LineupPlayer) {
    if (source.role.id !== target.role.id) return;

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
    }
    if (target.lineupPlayerType === "bench") {
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
    switchPlayerPosition,
    switchPlayers,
  };
}
