"use client";

import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import PlayerCard from "./PlayerCard";
import { Suspense } from "react";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";
import useSortPlayers from "@/hooks/useSortPlayers";

interface SimplePlayersListProps {
  actionsDialog?: React.ReactNode;
}

export default function SimplePlayersList({
  actionsDialog,
}: SimplePlayersListProps) {
  const { filteredPlayers } = usePlayersFilters();
  const sortedPlayers = useSortPlayers(filteredPlayers);

  const { isSelectionMode, toggleSelectPlayer } = usePlayerSelection();

  return (
    <>
      <div className="space-y-2">
        {sortedPlayers.map((player) => (
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
