"use client";

import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import useMyLineup from "@/hooks/useMyLineup";
import PlayersSelectTrigger from "./PlayersSelectTrigger";
import { Plus } from "iconoir-react";
import RemovePlayerDroppableArea from "./RemovePlayerDroppableArea";
import BenchPlayersList from "./BenchPlayersList";

type Props = {
  players: LineupPlayer[];
  canEditLineup: boolean;
  className?: string;
  isAwayTeam: boolean;
};

export default function BenchLineup({
  players: lineupPlayers,
  canEditLineup,
  className,
  isAwayTeam,
}: Props) {
  const {
    myLineup: { benchPlayers },
  } = useMyLineup();

  const players = canEditLineup ? benchPlayers : lineupPlayers;

  return (
    <div
      className={cn(
        `bg-input/30 rounded-3xl min-h-[500px] h-[500px] border-border
        flex flex-col pb-3 sm:pb-0`,
        className
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center gap-2 p-3 sm:p-4 !pb-2",
          isAwayTeam && "flex-row-reverse 2xl:flex-row"
        )}
      >
        <h2 className="text-sm xs:text-base">Panchina</h2>
        {canEditLineup && (
          <PlayersSelectTrigger
            lineupType="bench"
            className="bg-primary text-primary-foreground size-[26px] p-0 rounded-full 2xl:size-6 shrink-0"
          >
            <Plus className="size-5 font-semibold" />
          </PlayersSelectTrigger>
        )}
      </div>

      <BenchPlayersList
        players={players}
        canEditLineup={canEditLineup}
        isAwayTeam={isAwayTeam}
      />

      {canEditLineup && <RemovePlayerDroppableArea />}
    </div>
  );
}
