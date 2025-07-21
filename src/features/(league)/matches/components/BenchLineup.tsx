"use client"

import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import LineupPlayerCard from "./LineupPlayerCard";
import useMyLineup from "@/hooks/useMyLineup";

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
        `bg-input/30 rounded-3xl min-h-[500px] border-border p-4 space-y-2`,
        className
      )}
    >
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
