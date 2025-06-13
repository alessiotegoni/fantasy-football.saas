"use client";

import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import PlayerCard from "./PlayerCard";
import { Suspense } from "react";

interface SimplePlayersListProps {
  actionsDialog?: React.ReactNode;
}

export default function SimplePlayersList({
  actionsDialog,
}: SimplePlayersListProps) {
  const { filteredPlayers } = usePlayersFilters();

  return (
    <>
      <div className="space-y-2">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} {...player} />
        ))}
      </div>

      {actionsDialog && <Suspense>{actionsDialog}</Suspense>}
    </>
  );
}
