"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { TradeProposalSchema } from "../schema/trade";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { useCallback } from "react";
import { NavArrowDown } from "iconoir-react";
import { Check } from "iconoir-react/regular";
import { EnrichedPlayer } from "@/contexts/PlayersProvider";

interface MultiSelectProps {
  offeredByProposer?: boolean;
  players: EnrichedPlayer[];
  onPlayerSelect: (player: TradeProposalSchema["players"][number]) => void;
  triggerText: string;
}

export default function TradePlayersMultiSelect({
  offeredByProposer = true,
  players,
  triggerText,
  onPlayerSelect,
}: MultiSelectProps) {
  const form = useFormContext<TradeProposalSchema>();

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
    ({ id }: EnrichedPlayer) => {
    if (!isPlayerSelected(id)) {
      onPlayerSelect({
        id,
        offeredByProposer,
      });
    }
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="mt-8 bg-background">
          {triggerText}
          <NavArrowDown className="size-5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] sm:min-w-[400px] p-0 rounded-2xl">
        <Command>
          <CommandInput placeholder="Cerca giocatori" />
          <CommandList className="px-4">
            <CommandEmpty>Nessun giocatore trovato</CommandEmpty>
            {players.map((player) => (
              <CommandItem
                key={player.id}
                className={cn(
                  "p-0 py-3",
                  isPlayerSelected(player.id)
                    ? "border-primary"
                    : "cursor-pointer"
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
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
