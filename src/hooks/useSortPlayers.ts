import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { useMemo } from "react";

export default function useSortPlayers(players: TeamPlayer[]) {
  const sortedPlayers = useMemo(() => {
    if (!players.length) return [];

    return players.sort((a, b) => a.role.id - b.role.id);
  }, [players]);

  return sortedPlayers;
}
