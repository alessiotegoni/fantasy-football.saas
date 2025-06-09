"use client";

import { VirtualizedList } from "@/components/VirtualizedList";
import usePlayersList from "@/hooks/usePlayersList";
import PlayerCard from "./PlayerCard";
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import PlayersActionsDialog from "./PlayersActionsDialog";

export default function VirtualizedPlayersList({
  emptyState,
  leagueId,
}: {
  leagueId: string;
  emptyState: React.ReactNode;
}) {
  const { filteredPlayers } = usePlayersList();

  return filteredPlayers.length ? (
    <Dialog>
      <VirtualizedList
        items={filteredPlayers}
        estimateSize={80}
        renderItem={(player) => <PlayerCard key={player.id} {...player} />}
      />
      <PlayersActionsDialog leagueId={leagueId} />
    </Dialog>
  ) : (
    emptyState
  );
}
