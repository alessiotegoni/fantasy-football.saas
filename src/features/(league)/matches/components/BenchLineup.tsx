"use client";

import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import LineupPlayerCard from "./LineupPlayerCard";
import useMyLineup from "@/hooks/useMyLineup";
import PlayersSelectTrigger from "./PlayersSelectTrigger";
import { Plus } from "iconoir-react";

type Props = {
  team: LineupTeam;
  players: LineupPlayer[];
  canEditLineup: boolean;
  className?: string;
};

export default function BenchLineup({
  team,
  players,
  canEditLineup,
  className,
}: Props) {
  const { removePlayerFromLineup } = useMyLineup();

  return (
    <div
      className={cn(
        `bg-input/30 rounded-3xl min-h-[500px] border-border p-4 pl-5 space-y-2`,
        className
      )}
    >
      <div className="flex justify-between items-center gap-2">
        <h2>Panchina</h2>
        {canEditLineup && (
          <PlayersSelectTrigger
            lineupType="bench"
            className="bg-muted size-7 rounded-full"
          >
            <Plus className="size-5" />
          </PlayersSelectTrigger>
        )}
      </div>
      {players.map((player) => (
        <LineupPlayerCard
          key={player.id}
          player={player}
          type="bench"
          canEdit={canEditLineup}
          onRemove={removePlayerFromLineup}
          className="w-full text-left"
        />
      ))}
    </div>
  );
}
