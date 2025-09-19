"use client";

import ScrollArea from "@/components/ui/scroll-area";
import { LineupPlayer } from "../queries/match";
import EditableBenchPlayersList from "./EditableBenchPlayersList";
import LineupPlayerCard from "./LineupPlayerCard";
import useMyLineup from "@/hooks/useMyLineup";

type Props = {
  players: LineupPlayer[];
  canEditLineup: boolean;
};

export default function BenchPlayersList({ players, canEditLineup }: Props) {

  const { myTeam } = useMyLineup()

  if (!canEditLineup) {
    return (
      <ScrollArea className="max-h-[calc(500px-12px)] grow">
        {players.map((player) => (
          <LineupPlayerCard
            key={player.id}
            type="bench"
            player={player}
            className="px-3 sm:px-4 w-full text-left text-xs"
            canEdit={false}
          />
        ))}
      </ScrollArea>
    );
  }

  return <EditableBenchPlayersList players={players} />;
}
