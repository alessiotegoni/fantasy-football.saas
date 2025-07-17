"use client";

import { VirtualizedList } from "@/components/VirtualizedList";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import PlayerCard from "./PlayerCard";
import React, { Suspense } from "react";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";
import useSortPlayers from "@/hooks/useSortPlayers";

export default function VirtualizedPlayersList({
  actionsDialog,
}: {
  actionsDialog: React.ReactNode;
}) {
  const { filteredPlayers } = usePlayersFilters();
  const sortedPlayers = useSortPlayers(filteredPlayers)

  const { isSelectionMode, toggleSelectPlayer } = usePlayerSelection();

  return (
    <>
      <VirtualizedList
        items={sortedPlayers}
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
