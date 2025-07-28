"use client";

import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import LineupPlayerCard from "./LineupPlayerCard";
import useMyLineup from "@/hooks/useMyLineup";
import PlayersSelectTrigger from "./PlayersSelectTrigger";
import { Plus } from "iconoir-react";

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
        `bg-input/30 rounded-3xl min-h-[500px] border-border p-4`,
        className
      )}
    >
      <div className="flex justify-between items-center gap-2 mb-3">
        <h2>Panchina</h2>
        {canEditLineup && (
          <PlayersSelectTrigger
            lineupType="bench"
            className="bg-primary text-primary-foreground size-7 xs:size-fit rounded-full xs:rounded-xl xs:p-2 xs:px-3 gap-1.5 2xl:p-0 2xl:rounded-full 2xl:size-6"
          >
            <Plus className="size-5 xs:size-6 2xl:size-5 font-semibold" />
            <p className="hidden xs:block 2xl:hidden text-sm font-medium">
              Aggiungi giocatore
            </p>
          </PlayersSelectTrigger>
        )}
      </div>
      <div className="space-y-3">
        {players.map((player) => (
          <LineupPlayerCard
            key={player.id}
            player={player}
            type="bench"
            canEdit={canEditLineup}
            className="p-0 w-full text-left text-xs"
          />
        ))}
      </div>
    </div>
  );
}
