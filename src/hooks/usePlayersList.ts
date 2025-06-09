import {
  EnrichPlayer,
  PlayerListContext,
  playersListContext,
} from "@/contexts/PlayersListProvider";
import { useContext } from "react";
import { useFilter } from "./useFilter";

export default function usePlayersList() {
  const context = useContext(playersListContext);
  if (!context) {
    throw new Error("usePlayersList must be used within its provider");
  }

  const { filteredItems: filteredPlayers } = useFilter(context.players, {
    defaultFilters: context.filters,
    filterFn,
  });

  return {
    ...context,
    filteredPlayers,
  };
}

function filterFn(player: EnrichPlayer, filters: PlayerListContext["filters"]) {
  const matchesSearch = player.displayName
    .toLowerCase()
    .includes(filters.search.toLowerCase());
  const matchesTeam =
    filters.teams.length === 0 || filters.teams.includes(player.team?.id ?? -1);
  const matchesRole =
    filters.roles.length === 0 || filters.roles.includes(player.role?.id ?? -1);

  return matchesSearch && matchesTeam && matchesRole;
}
