"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormContext } from "react-hook-form";
import { CreateTradeProposalSchema } from "../schema/trade";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { useCallback, useState } from "react";
import { NavArrowDown, Check } from "iconoir-react";
import { EnrichedPlayer } from "@/contexts/PlayersProvider";
import SearchBar from "@/components/SearchBar";
import { useFilter } from "@/hooks/useFilter";

type Props = {
  offeredByProposer?: boolean;
  players: EnrichedPlayer[];
  onPlayerSelect: (
    player: CreateTradeProposalSchema["players"][number]
  ) => void;
  triggerText: string;
  className?: string;
};

export default function TradePlayersDialog({
  offeredByProposer = true,
  players,
  triggerText,
  onPlayerSelect,
  className,
}: Props) {
  const [search, setSearch] = useState("");
  const form = useFormContext<CreateTradeProposalSchema>();

  const { filteredItems: filteredPlayers, handleFilter } = useFilter(players, {
    defaultFilters: search,
    filterFn: (player) =>
      player.displayName.toLowerCase().includes(search.toLowerCase()),
  });

  const isPlayerSelected = useCallback(
    (playerId: number) => {
      const selectedPlayersIds = form
        .watch("players")
        .map((player) => player.id);
      return selectedPlayersIds.includes(playerId);
    },
    [form]
  );

  const handleSelectPlayer = useCallback(
    ({ id, roleId }: EnrichedPlayer) => {
      if (!isPlayerSelected(id)) {
        onPlayerSelect({
          id,
          roleId,
          offeredByProposer,
        });
      }
    },
    [isPlayerSelected, onPlayerSelect, offeredByProposer]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn("mt-8 bg-background !px-5", className)}>
          {triggerText}
          <NavArrowDown className="size-5 shrink-0 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg sm:max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Seleziona Giocatori</DialogTitle>
        </DialogHeader>

        <SearchBar onSearch={setSearch} className="mb-4" />

        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {filteredPlayers.length === 0 ? (
            <p className="text-muted-foreground px-1">
              Nessun giocatore trovato
            </p>
          ) : (
            filteredPlayers.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "flex items-center gap-3.5 p-2 rounded-2xl transition-colors hover:bg-muted",
                  isPlayerSelected(player.id) && "border border-primary"
                )}
              >
                {isPlayerSelected(player.id) && (
                  <Button
                    variant="ghost"
                    className="rounded-full bg-primary size-6 cursor-default"
                    size="icon"
                  >
                    <Check className="text-white size-4" />
                  </Button>
                )}
                <PlayerCard
                  {...player}
                  showSelectButton={false}
                  canSelectCard
                  onSelect={handleSelectPlayer}
                  className="border-transparent p-0 w-full"
                  avatarSize={10}
                />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
