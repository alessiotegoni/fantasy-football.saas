import {
  EnrichPlayer,
  PlayerListContext,
  playersListContext,
} from "@/contexts/PlayersListProvider";
import { useContext, useMemo } from "react";
import { useDebouncedFilter } from "./useDebounceFilter";

export default function usePlayersList() {
  const context = useContext(playersListContext);
  if (!context) {
    throw new Error("usePlayersList must be used within its provider");
  }

  const { filteredItems: searchFilteredPlayers } = useDebouncedFilter(
    context.players,
    {
      defaultValue: context.filters.search,
    }
  );

  const filteredPlayers = useMemo(
    () =>
      searchFilteredPlayers.filter(
        filterByRolesAndTeams.bind(null, context.filters)
      ),
    [context.filters]
  );

  return {
    ...context,
    filteredPlayers,
  };
}

function filterByRolesAndTeams(
  filters: PlayerListContext["filters"],
  player: EnrichPlayer
) {
  const matchesTeam =
    filters.teams.length === 0 || filters.teams.includes(player.team?.id ?? -1);
  const matchesRole =
    filters.roles.length === 0 || filters.roles.includes(player.role?.id ?? -1);

  return matchesTeam && matchesRole;
}
