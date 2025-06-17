"use client";

import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getTeamPlayers } from "../../teamsPlayers/queries/teamsPlayer";
import { useFormContext } from "react-hook-form";
import { TradeProposalSchema } from "../schema/trade";
import { CheckCircle } from "iconoir-react/solid";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";

interface MultiSelectProps {
  players: Awaited<ReturnType<typeof getTeamPlayers>>;
  triggerText: string;
}

export default function TradePlayersMultiSelect({
  players,
  triggerText,
}: MultiSelectProps) {
  const form = useFormContext<TradeProposalSchema>();
  const selectedPlayersIds = form.watch("players").map((player) => player.id);

  console.log(players);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          {triggerText}
          <ChevronDown className="size-5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-2xl">
        <Command>
          <CommandInput placeholder="Cerca giocatori" />
          <CommandList>
            <CommandEmpty>Nessun giocatore trovato</CommandEmpty>
            <CommandGroup>
              {players.map((player) => (
                <CommandItem key={player.id}>
                  <PlayerCard
                    {...player}
                    role={null}
                    team={null}
                    showSelectButton={false}
                    className={cn(
                      selectedPlayersIds.includes(player.id) && "border-primary"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
