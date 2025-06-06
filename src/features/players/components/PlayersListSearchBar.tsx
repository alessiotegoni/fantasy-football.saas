"use client";

import SearchBar from "@/components/SearchBar";
import usePlayersList from "@/hooks/usePlayersList";
import { useCallback } from "react";

export default function PlayersListSearchBar() {
  const { filters, handleSetFilters } = usePlayersList();

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
