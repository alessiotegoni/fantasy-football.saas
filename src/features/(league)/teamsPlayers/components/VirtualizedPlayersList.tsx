"use client";

import { VirtualizedList } from "@/components/VirtualizedList";
import usePlayersList from "@/hooks/usePlayersList";
import PlayerCard from "./PlayerCard";
import React, { Suspense } from "react";
import { Dialog } from "@/components/ui/dialog";

export default function VirtualizedPlayersList({
  emptyState,
  actionsDialog,
}: {
  emptyState: React.ReactNode;
  actionsDialog: React.ReactNode;
}) {
  const { filteredPlayers } = usePlayersList();

  return filteredPlayers.length ? (
    <Dialog>
      <VirtualizedList
        items={filteredPlayers}
        estimateSize={80}
        renderItem={(player) => <PlayerCard key={player.id} {...player} />}
      />
      <Suspense>{actionsDialog}</Suspense>
    </Dialog>
  ) : (
    emptyState
  );
}
