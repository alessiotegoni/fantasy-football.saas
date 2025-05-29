"use client";

import { useState, useMemo, useCallback } from "react";

export function useDebouncedFilter<T extends { name: string }>(
  items: T[],
  options?: {
    filterFn?: (item: T, term: string) => boolean;
    debounceMs?: number;
  }
) {
  const { filterFn } = options ?? {};

  const [debounced, setDebounced] = useState("");

  const filteredItems = useMemo(() => {
    if (!debounced) return items;
    return items.filter(
      (item) =>
        filterFn?.(item, debounced) ??
        item.name.toLowerCase().includes(debounced.toLowerCase())
    );
  }, [items, debounced, filterFn]);

  const handleFilter = useCallback(setDebounced, []);

  return {
    handleFilter,
    filteredItems,
  };
}
