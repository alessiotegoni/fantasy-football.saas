import { useState, useEffect, useMemo, useCallback } from "react";

type UseFilterOptions<TItem, TFilters> = {
  filterFn: (item: TItem, filters: TFilters) => boolean;
  defaultFilters: TFilters;
};

export function useFilter<TItem, TFilters>(
  items: TItem[],
  { filterFn, defaultFilters }: UseFilterOptions<TItem, TFilters>
) {
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const handleFilter = useCallback(
    (updated: Partial<TFilters>) =>
      setFilters((prev) => ({ ...prev, ...updated })),
    []
  );

  const filteredItems = useMemo(() => {
    if (!defaultFilters) return items;
    return items.filter((item) => filterFn(item, filters));
  }, [items, filters, filterFn]);

  return {
    filters,
    handleFilter,
    filteredItems,
  };
}
