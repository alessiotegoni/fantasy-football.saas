"use client";

import SearchBar from "@/components/SearchBar";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import { useCallback } from "react";

export default function PlayersListSearchBar() {
  const { filters, handleSetFilters } = usePlayersFilters();

  const handleSearchFilter = useCallback(
    (search: string) => handleSetFilters({ search }),
    [filters.search]
  );

  return (
    <SearchBar
      placeholder="Cerca giocatori"
      onSearch={handleSearchFilter}
      className="mb-3"
      value={filters.search}
    />
  );
}
