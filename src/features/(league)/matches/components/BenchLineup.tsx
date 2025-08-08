"use client";

import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import useMyLineup from "@/hooks/useMyLineup";
import PlayersSelectTrigger from "./PlayersSelectTrigger";
import { Plus } from "iconoir-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableLineupPlayerCard from "./SortableLineupPlayerCard";
import ScrollArea from "@/components/ui/scroll-area";
import DroppablePlayerArea from "./DroppablePlayerArea";
import RemovePlayerDroppableArea from "./RemovePlayerDroppableArea";

type Props = {
  players: LineupPlayer[];
  canEditLineup: boolean;
  className?: string;
};

export default function BenchLineup({
  players: lineupPlayers,
  canEditLineup,
  className,
}: Props) {
  const {
    myLineup: { benchPlayers },
  } = useMyLineup();

  const players = canEditLineup ? benchPlayers : lineupPlayers;

  return (
    <div
      className={cn(
        `bg-input/30 rounded-3xl min-h-[500px] h-[500px] border-border p-3 sm:p-4 flex flex-col`,
        className
      )}
    >
      <div className="flex justify-between items-center gap-2 mb-4">
        <h2 className="text-sm xs:text-base">Panchina</h2>
        {canEditLineup && (
          <PlayersSelectTrigger
            lineupType="bench"
            className="bg-primary text-primary-foreground size-6 sm:size-7 p-0 rounded-full 2xl:size-6 shrink-0"
          >
            <Plus className="size-5 font-semibold" />
          </PlayersSelectTrigger>
        )}
      </div>

      <SortableContext
        items={players.map((player) => player.id)}
        strategy={verticalListSortingStrategy}
      >
        <ScrollArea
          className={cn(
            "space-y-4 overflow-visible grow",
            players.length <= 8 && "p-0"
          )}
        >
          {players.map((player) => (
            <SortableLineupPlayerCard
              key={player.id}
              player={player}
              canEdit={canEditLineup}
            />
          ))}
        </ScrollArea>
      </SortableContext>
      {canEditLineup && <RemovePlayerDroppableArea />}
    </div>
  );
}
