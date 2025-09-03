"use client";

import { ComponentProps, useMemo, useState } from "react";
import { useAuction } from "@/contexts/AuctionProvider";
import PlayersList from "@/components/PlayersList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputSearch } from "iconoir-react";
import { TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import { Team } from "@/features/teams/queries/team";
import { VirtualizedList } from "@/components/VirtualizedList";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  players?: TeamPlayer[];
  teams?: Team[];
};

export default function AuctionPlayersDialog({
  players = [],
  teams = [],
}: Props) {
  const {
    acquisitions,
    playersRoles,
    selectedPlayer,
    toggleSelectPlayer,
    currentNomination,
  } = useAuction();
  const [open, setOpen] = useState(false);

  function handlePlayerClick(player: TeamPlayer) {
    if (currentNomination) return;
    toggleSelectPlayer(selectedPlayer?.id === player.id ? null : player);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="size-full bg-card rounded-3xl p-4 sm:p-6 flex flex-col justify-center items-center gap-5 text-center">
        <div className="hidden lg:flex flex-col justify-center items-center gap-3">
          <InputSearch className="size-15 size-text-muted-foreground" />
          <p className="text-muted-foreground">Cerca i giocatori rimasti</p>
        </div>
        <Button
          variant="ghost"
          onClick={setOpen.bind(null, true)}
          className="py-3 lg:w-30"
        >
          Cerca <span className="lg:hidden">giocatori</span>
        </Button>
      </div>
      <DialogContent className="flex h-5/6 max-w-3xl flex-col gap-4 sm:max-w-2xl pt-6 p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">Giocatori disponibili</DialogTitle>
        </DialogHeader>
        <PlayersList players={players} teams={teams} roles={playersRoles}>
          {(players) =>
            players.length > 0 ? (
              <VirtualizedList
                items={players}
                estimateSize={80}
                renderItem={(player) => (
                  <AuctionPlayerCard {...player} onSelect={handlePlayerClick} />
                )}
              />
            ) : (
              <EmptyState
                title="Nessun giocatore trovato"
                description="Prova a modificare i filtri di ricerca."
                className="!bg-transparent"
              />
            )
          }
        </PlayersList>
      </DialogContent>
    </Dialog>
  );
}

function AuctionPlayerCard({
  onSelect,
  ...player
}: ComponentProps<typeof PlayerCard>) {
  const { acquisitions, selectedPlayer, currentNomination } = useAuction();

  const isAlreadyAcquired = useMemo(
    () => acquisitions.some((a) => a.player.id === player.id),
    [acquisitions]
  );

  const className = cn(
    selectedPlayer?.id === player.id && "border-primary",
    isAlreadyAcquired && "cursor-not-allowed opacity-60"
  );

  return (
    <PlayerCard
      {...player}
      onSelect={onSelect}
      showSelectButton={false}
      className={className}
      canSelectCard={!isAlreadyAcquired && !currentNomination}
    />
  );
}
