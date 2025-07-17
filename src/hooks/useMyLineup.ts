"use client";

import { MyLineupContext } from "@/contexts/MyLineupProvider";
import { getTeamPlayers } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { useContext } from "react";

export default function useMyLineup(
  players: Awaited<ReturnType<typeof getTeamPlayers>>
) {
  const context = useContext(MyLineupContext);

  if (!context) {
    throw new Error("useMyLineupProvider must be used within MyLineupProvider");
  }

  return context;
}
