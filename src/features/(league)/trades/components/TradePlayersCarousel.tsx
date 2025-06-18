"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { UseFieldArrayRemove } from "react-hook-form";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";

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
              <PlayerCard
                {...player}
                showSelectButton={false}
                role={null}
                team={null}
              />
              {/* <div className="relative group">
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-xl min-w-[80px]">
                  <div className="relative">
                    <Image
                      src={
                        player.imageUrl || "/placeholder.svg?height=40&width=40"
                      }
                      alt={player.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemovePlayer(player.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-xs font-medium text-center mt-2 line-clamp-2">
                    {player.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {player.position}
                  </span>
                </div>
              </div> */}
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
