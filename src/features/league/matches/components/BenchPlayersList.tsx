"use client";

import ScrollArea from "@/components/ui/scroll-area";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SwipeableList, Type } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { LineupPlayer } from "../queries/match";
import SortableLineupPlayerCard from "./SortableLineupPlayerCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";
import SwipeableLineupPlayerCard from "./SwipeableLineupPlayerCard";

type Props = {
  players: LineupPlayer[];
  canEditLineup: boolean;
};

export default function BenchPlayersList({ players, canEditLineup }: Props) {
  const isMobile = useIsMobile(640);

  return (
    <SortableContext
      items={players.map((player) => player.id)}
      strategy={verticalListSortingStrategy}
    >
      <ScrollArea
        className={cn(
          "space-y-3.5 max-h-[calc(500px-12px)] grow",
          players.length <= 8 && "p-0"
        )}
      >
        {isMobile ? (
          <SwipeableList className="custom-scrollbar" type={Type.MS}>
            {players.map((player) => (
              <SwipeableLineupPlayerCard
                key={player.id}
                player={player}
                canEditLineup={canEditLineup}
              />
            ))}
          </SwipeableList>
        ) : (
          players.map((player) => (
            <SortableLineupPlayerCard
              key={player.id}
              player={player}
              canEdit={canEditLineup}
              className="p-3 sm:p-4 !py-0 first:!pt-1.5 first:sm:!pt-2.5"
            />
          ))
        )}
      </ScrollArea>
    </SortableContext>
  );
}
