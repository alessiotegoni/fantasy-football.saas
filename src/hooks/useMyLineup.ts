"use client";

import {
  LineupPlayerWithoutVotes,
  MyLineupContext,
} from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { useContext, useMemo } from "react";

export default function useMyLineup(players?: TeamPlayer[]) {
  const context = useContext(MyLineupContext);

  if (!context) {
    throw new Error("useMyLineupProvider must be used within MyLineupProvider");
  }

  const availablePlayers = useMemo(
    () => (players ? getAvailablePlayers(players, context) : null),
    [players, context.myLineup]
  ) as TeamPlayer[] | LineupPlayerWithoutVotes[] ;

  return { ...context, availablePlayers };
}

export function getAvailablePlayers(
  teamPlayers: TeamPlayer[],
  { myLineup, playersDialog: { type } }: MyLineupContext
){
  const benchPlayers = myLineup?.benchPlayers ?? [];
  const starterPlayers = myLineup?.starterPlayers ?? [];

  const lineupPlayersIds = new Set(
    [...benchPlayers, ...starterPlayers].map((p) => p.id)
  );
  const availablePlayers = teamPlayers.filter(
    (p) => !lineupPlayersIds.has(p.id)
  );

  if (type === "starter") {
    return [...availablePlayers, ...benchPlayers];
  }

  if (type === "bench") {
    return [...availablePlayers, ...starterPlayers];
  }

  return teamPlayers;
}
