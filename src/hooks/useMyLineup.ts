"use client";

import { MyLineupContext } from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { useContext } from "react";

export default function useMyLineup(players?: TeamPlayer[]) {
  const context = useContext(MyLineupContext);

  if (!context) {
    throw new Error("useMyLineupProvider must be used within MyLineupProvider");
  }

  return context;
}
