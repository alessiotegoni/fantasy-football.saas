"use client";

import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import SimplePlayersList from "./SimplePlayersList";
import VirtualizedPlayersList from "./VirtualizedPlayersList";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";
import { Dialog } from "@/components/ui/dialog";

interface PlayersListContentProps {
  virtualized: boolean;
  actionsDialog?: React.ReactNode;
  emptyState: React.ReactNode;
}

export default function PlayersListContent({
  virtualized,
  actionsDialog,
  emptyState,
}: PlayersListContentProps) {
  const { filteredPlayers } = usePlayersFilters();

  const { isDialogOpen, toggleSelectDialog } = usePlayerSelection();

  const content = filteredPlayers.length ? (
    virtualized ? (
      <VirtualizedPlayersList actionsDialog={actionsDialog} />
    ) : (
      <SimplePlayersList actionsDialog={actionsDialog} />
    )
  ) : (
    emptyState
  );

  return actionsDialog ? (
    <Dialog open={isDialogOpen} onOpenChange={toggleSelectDialog}>
      {content}
    </Dialog>
  ) : (
    content
  );
}
