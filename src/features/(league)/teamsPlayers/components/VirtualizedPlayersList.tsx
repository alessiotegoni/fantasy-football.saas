"use client";

import { VirtualizedList } from "@/components/VirtualizedList";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import PlayerCard from "./PlayerCard";
import React, { Suspense } from "react";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";

export default function VirtualizedPlayersList({
  actionsDialog,
}: {
  actionsDialog: React.ReactNode;
}) {
  const { filteredPlayers } = usePlayersFilters();
  const { isSelectionMode, toggleSelectPlayer } = usePlayerSelection();

  return (
    <>
      <VirtualizedList
        items={filteredPlayers}
        estimateSize={80}
        renderItem={(player) => (
          <PlayerCard
            key={player.id}
            {...player}
            showSelectButton={isSelectionMode}
            onSelect={toggleSelectPlayer}
          />
        )}
      />

      <Suspense>{actionsDialog}</Suspense>
    </>
  );
}
