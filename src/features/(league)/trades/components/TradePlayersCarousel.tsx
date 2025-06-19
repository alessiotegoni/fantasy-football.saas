"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { UseFieldArrayRemove } from "react-hook-form";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { XmarkCircleSolid } from "iconoir-react";

interface PlayerCarouselProps {
  players: {
    index: number;
    id: number;
    displayName: string;
    roleId: number;
    teamId: number;
    avatarUrl: string | null;
    offeredByProposer: boolean;
  }[];
  onRemovePlayer: UseFieldArrayRemove;
}

export function TradePlayersCarousel({
  players,
  onRemovePlayer,
}: PlayerCarouselProps) {
  console.log(players);

  return (
    <div className="mt-4">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {players.map((player) => (
            <CarouselItem key={player.id} className="pl-2 md:pl-4 basis-auto">
              <div className="flex items-center gap-3 border border-border rounded-3xl p-2 pr-2.5 py-2 bg-background">
                <PlayerCard
                  {...player}
                  showSelectButton={false}
                  role={null}
                  team={null}
                  className="border-transparent p-0"
                />
                <Button
                  variant="outline"
                  className="shrink-0 p-0 size-6 rounded-full"
                  onClick={onRemovePlayer.bind(null, player.index)}
                  asChild
                >
                  <XmarkCircleSolid />
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {players.length > 3 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
}
