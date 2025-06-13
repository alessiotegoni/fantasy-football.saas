"use client";

import { VirtualizedList } from "@/components/VirtualizedList";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import PlayerCard from "./PlayerCard";
import React, { Suspense } from "react";

export default function VirtualizedPlayersList({
  actionsDialog,
}: {
  actionsDialog: React.ReactNode;
}) {
  const { filteredPlayers } = usePlayersFilters();

  return (
    <>
      <VirtualizedList
        items={filteredPlayers}
        estimateSize={80}
        renderItem={(player) => <PlayerCard key={player.id} {...player} />}
      />

      <Suspense>{actionsDialog}</Suspense>
    </>
  );
}
