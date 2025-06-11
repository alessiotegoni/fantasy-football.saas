"use client";

import { VirtualizedList } from "@/components/VirtualizedList";
import usePlayersList from "@/hooks/usePlayersList";
import PlayerCard from "./PlayerCard";
import React, { Suspense } from "react";
import { Dialog } from "@/components/ui/dialog";
import usePlayerSelection from "@/hooks/usePlayerSelection";

export default function VirtualizedPlayersList({
  emptyState,
  actionsDialog,
}: {
  emptyState: React.ReactNode;
  actionsDialog: React.ReactNode;
}) {
  const { filteredPlayers } = usePlayersList();
  const { isDialogOpen, toggleSelectDialog } = usePlayerSelection();

  return filteredPlayers.length ? (
    <Dialog open={isDialogOpen} onOpenChange={toggleSelectDialog}>
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
