"use client";

import ScrollArea from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import EditableBenchPlayersList from "./EditableBenchPlayersList";
import LineupPlayerCard from "./LineupPlayerCard";

type Props = {
  players: LineupPlayer[];
  canEditLineup: boolean;
};

export default function BenchPlayersList({ players, canEditLineup }: Props) {
  if (!canEditLineup) {
    return (
      <ScrollArea
        className={cn(
          "space-y-3.5 max-h-[calc(500px-12px)] grow",
          players.length <= 8 && "p-0"
        )}
      >
        {players.map((player) => (
          <LineupPlayerCard
            key={player.id}
            type="bench"
            player={player}
            className="p-0 w-full text-left text-xs"
            canEdit={false}
          />
        ))}
      </ScrollArea>
    );
  }

  return <EditableBenchPlayersList players={players} canEditLineup />;
}
