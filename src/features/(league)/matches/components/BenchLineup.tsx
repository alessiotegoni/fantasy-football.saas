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
        `bg-input/30 rounded-3xl min-h-[500px] h-[500px] border-border p-3 sm:p-4`,
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

      {/* <ScrollArea className={cn("space-y-4 max-h-[430px]", players.length <= 8 && "p-0")}> */}
      <SortableContext
        items={players.map((player) => player.id)}
        strategy={verticalListSortingStrategy}
      >
        {players.map((player) => (
          <SortableLineupPlayerCard
            key={player.id}
            player={player}
            type="bench"
            canEdit={canEditLineup}
          />
        ))}
      </SortableContext>
      {/* </ScrollArea> */}
    </div>
  );
}
