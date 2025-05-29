"use client";

import { useWindowVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { ScrollToTopButton } from "./ScrollToBottom";
import { cn } from "@/lib/utils";

type VirtualizedListProps<T> = {
  items: T[];
  estimateSize: number;
  gap?: number;
  overscan?: number;
  className?: string;
  renderItem: (item: T, virtualRow: VirtualItem) => React.ReactNode;
};

export function VirtualizedList<T>({
  items,
  estimateSize,
  gap = 0,
  overscan = 5,
  className = "",
  renderItem,
}: VirtualizedListProps<T>) {
  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => estimateSize,
    gap,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <>
      <div className={cn("h-full", className)}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          <div
            className="absolute top-0 left-0 w-full space-y-4"
            style={{
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const item = items[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                >
                  {renderItem(item, virtualRow)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
