"use client";

import { useState } from "react";
import { useAuction } from "@/contexts/AuctionProvider";
import PlayersList from "@/features/(league)/teamsPlayers/components/PlayersList";
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
  players: TeamPlayer[];
  teams: Team[];
  roles: PlayerRole[];
  leagueId: string;
};

export default function AuctionPlayersDialog({
  players,
  teams,
  roles,
  leagueId,
}: Props) {
  const { toggleSelectPlayer } = useAuction();
  const [open, setOpen] = useState(false);

  const handlePlayerClick = (player: TeamPlayer) => {
    toggleSelectPlayer(player);
    setOpen(false);
  };

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
      <DialogContent className="flex h-5/6 max-w-3xl flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Giocatori disponibili</DialogTitle>
        </DialogHeader>
        <PlayersList players={players} teams={teams} roles={roles}>
          {(filteredPlayers) => (
            <div className="relative grow overflow-y-auto">
              {filteredPlayers.length > 0 ? (
                <VirtualizedList
                  items={filteredPlayers}
                  estimateSize={80}
                  renderItem={(player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerClick(player)}
                      className="cursor-pointer"
                    >
                      <PlayerCard
                        {...player}
                        showSelectButton={false}
                        onSelect={() => {}}
                      />
                    </div>
                  )}
                />
              ) : (
                <EmptyState
                  title="Nessun giocatore trovato"
                  description="Prova a modificare i filtri di ricerca."
                />
              )}
            </div>
          )}
        </PlayersList>
      </DialogContent>
    </Dialog>
  );
}
