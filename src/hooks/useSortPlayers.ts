import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { useCallback, useMemo } from "react";

export default function useSortPlayers(players?: TeamPlayer[]) {
  const sortedPlayers = useMemo(
    () => (players ? sortPlayers(players) : []),
    [players]
  );

  const sortPlayers = useCallback(
    (players: TeamPlayer[]) => players.sort((a, b) => a.role.id - b.role.id),
    []
  );

  return { sortedPlayers, sortPlayers };
}
