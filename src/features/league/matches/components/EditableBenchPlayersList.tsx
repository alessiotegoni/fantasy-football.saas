"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SwipeableList, Type } from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

import ScrollArea from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import SortableLineupPlayerCard from "./SortableLineupPlayerCard";
import SwipeableLineupPlayerCard from "./SwipeableLineupPlayerCard";

type Props = {
  players: LineupPlayer[];
  isAwayTeam: boolean;
};

export default function EditableBenchPlayersList({ players, isAwayTeam }: Props) {
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
                isAwayTeam={isAwayTeam}
              />
            ))}
          </SwipeableList>
        ) : (
          players.map((player) => (
            <SortableLineupPlayerCard
              key={player.id}
              player={player}
              className={cn(
                "p-3 sm:p-4 !py-0 first:2xl:!pt-2.5",
                players.length > 6 && "!pr-0"
              )}
              isAwayTeam={isAwayTeam}
            />
          ))
        )}
      </ScrollArea>
    </SortableContext>
  );
}
