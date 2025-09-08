import { TeamPlayer } from "@/features/league/teamsPlayers/queries/teamsPlayer";
import { useCallback, useMemo } from "react";

export default function useSortPlayers(players?: TeamPlayer[]) {
  const sortPlayers = useCallback(
    (players: TeamPlayer[]) => players.sort((a, b) => a.role.id - b.role.id),
    []
  );

  const sortedPlayers = useMemo(
    () => (players ? sortPlayers(players) : []),
    [players]
  );

  return { sortedPlayers, sortPlayers };
}
