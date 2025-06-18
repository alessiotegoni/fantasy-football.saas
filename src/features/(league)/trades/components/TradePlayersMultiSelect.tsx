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
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { useCallback } from "react";
import { BasePlayer } from "@/contexts/PlayersProvider";

interface MultiSelectProps {
  offeredByProposer?: boolean;
  players: Awaited<ReturnType<typeof getTeamPlayers>>;
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
    ({ id }: BasePlayer) => {
      const selectedPlayersIds = form
        .watch("players")
        .map((player) => player.id);
      return selectedPlayersIds.includes(id);
    },
    [form]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="mt-8">
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
                    canSelectCard
                    onSelect={({
                      id,
                      displayName,
                      roleId,
                      teamId,
                      avatarUrl,
                    }) =>
                      !isPlayerSelected(player) &&
                      onPlayerSelect({
                        id,
                        displayName,
                        roleId,
                        teamId,
                        avatarUrl,
                        offeredByProposer,
                      })
                    }
                    className={cn(isPlayerSelected(player) && "border-primary")}
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
