"use client";

import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import PlayerCard from "./PlayerCard";
import { Suspense } from "react";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";

interface SimplePlayersListProps {
  actionsDialog?: React.ReactNode;
}

export default function SimplePlayersList({
  actionsDialog,
}: SimplePlayersListProps) {
  const { filteredPlayers } = usePlayersFilters();
  const { isSelectionMode, toggleSelectPlayer } = usePlayerSelection();

  return (
    <>
      <div className="space-y-2">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            {...player}
            showSelectButton={isSelectionMode}
            onSelect={toggleSelectPlayer}
          />
        ))}
      </div>

      {actionsDialog && <Suspense>{actionsDialog}</Suspense>}
    </>
  );
}
