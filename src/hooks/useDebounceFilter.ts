"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

export function useDebouncedFilter<T extends { name: string }>(
  items: T[],
  options?: {
    filterFn?: (item: T, term: string) => boolean;
    debounceMs?: number;
    defaultValue?: string;
  }
) {
  const { filterFn, defaultValue } = options ?? {};

  const [debounced, setDebounced] = useState(defaultValue ?? "");

  useEffect(() => {
    if (defaultValue !== undefined) setDebounced(defaultValue);
  }, [defaultValue]);

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
