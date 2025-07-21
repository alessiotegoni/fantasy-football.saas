"use client";

import {
  MyLineupContext,
  LineupPlayerWithoutVotes,
} from "@/contexts/MyLineupProvider";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { useContext, useMemo } from "react";

export default function useMyLineup(teamPlayers: TeamPlayer[] = []) {
  const context = useContext(MyLineupContext);

  if (!context) {
    throw new Error("useMyLineup must be used within a MyLineupProvider");
  }

  const { myLineup, playersDialog } = context;
  const { roleId, type } = playersDialog;

  const availablePlayers = useMemo(() => {
    const { starterPlayers, benchPlayers } = myLineup;

    // Players already in the lineup
    const lineupPlayerIds = new Set(
      [...starterPlayers, ...benchPlayers].map(p => p.id)
    );

    // Base available players (not in lineup yet)
    const baseAvailable = teamPlayers.filter(p => !lineupPlayerIds.has(p.id));

    let swappablePlayers: LineupPlayerWithoutVotes[] = [];
    if (type === 'starter') {
      swappablePlayers = benchPlayers;
    } else if (type === 'bench') {
      swappablePlayers = starterPlayers;
    }

    const allAvailable = [...baseAvailable, ...swappablePlayers];

    return roleId ? allAvailable.filter(p => p.role.id === roleId) : allAvailable;
  }, [teamPlayers, myLineup, roleId, type]);

  return { ...context, availablePlayers };
}
