'use client';

import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import React from "react";

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
  gap = 10,
  overscan = 5,
  className = "",
  renderItem,
}: VirtualizedListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    gap,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className={cn("size-full overflow-y-auto pr-1.5 custom-scrollbar", className)}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
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
                style={{
                  paddingBottom: `${gap}px`,
                }}
              >
                {renderItem(item, virtualRow)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
