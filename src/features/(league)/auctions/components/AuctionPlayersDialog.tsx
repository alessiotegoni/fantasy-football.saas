"use client";

import { useState } from "react";
import { useAuction } from "@/contexts/AuctionProvider";
import PlayersList from "@/components/PlayersList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PlayerRole, TeamPlayer } from "../../teamsPlayers/queries/teamsPlayer";
import { Team } from "@/features/teams/queries/team";
import { VirtualizedList } from "@/components/VirtualizedList";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import EmptyState from "@/components/EmptyState";

type Props = {
  players?: TeamPlayer[];
  teams?: Team[];
  playersRoles: PlayerRole[];
};

export default function AuctionPlayersDialog({
  players = [],
  teams = [],
  playersRoles,
}: Props) {
  const { toggleSelectPlayer } = useAuction();
  const [open, setOpen] = useState(false);

  function handlePlayerClick(player: TeamPlayer) {
    toggleSelectPlayer(player);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            readOnly
            placeholder="Cerca giocatori..."
            className="cursor-pointer pl-9"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="flex h-5/6 max-w-3xl flex-col gap-4 sm:max-w-2xl pt-6 p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">Giocatori disponibili</DialogTitle>
        </DialogHeader>
        <PlayersList players={players} teams={teams} roles={playersRoles}>
          {(players) => (
            <div className="relative grow overflow-y-auto">
              {players.length > 0 ? (
                <VirtualizedList
                  items={players}
                  estimateSize={80}
                  renderItem={(player) => (
                    <PlayerCard
                      {...player}
                      showSelectButton={false}
                      onSelect={handlePlayerClick}
                    />
                  )}
                />
              ) : (
                <EmptyState
                  title="Nessun giocatore trovato"
                  description="Prova a modificare i filtri di ricerca."
                  className="!bg-transparent"
                />
              )}
            </div>
          )}
        </PlayersList>
      </DialogContent>
    </Dialog>
  );
}
