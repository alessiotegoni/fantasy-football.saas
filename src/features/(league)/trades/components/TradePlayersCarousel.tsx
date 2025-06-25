"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { UseFieldArrayRemove } from "react-hook-form";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { XmarkCircleSolid } from "iconoir-react";
import { usePlayersEnrichment } from "@/contexts/PlayersEnrichmentProvider";
import { useMemo } from "react";

interface PlayerCarouselProps {
  tradePlayers: {
    index: number;
    id: number;
    offeredByProposer: boolean;
  }[];
  onRemovePlayer: UseFieldArrayRemove;
}

export function TradePlayersCarousel({
  tradePlayers,
  onRemovePlayer,
}: PlayerCarouselProps) {
  const { enrichedPlayers } = usePlayersEnrichment();

  const players = useMemo(
    () =>
      tradePlayers.map((tradePlayer) => ({
        ...tradePlayer,
        ...enrichedPlayers.find(
          (enrichPlayer) => enrichPlayer.id === tradePlayer.id
        )!,
      })),

    [enrichedPlayers, tradePlayers]
  );

  return (
    <div className="mt-4">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {players.map(({ purchaseCost, ...player }) => (
            <CarouselItem key={player.id} className="pl-2 md:pl-4 basis-auto">
              <div className="flex items-center gap-3 border border-border rounded-3xl p-2 pr-2.5 py-2 bg-background">
                <PlayerCard
                  {...player}
                  showSelectButton={false}
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
      </Carousel>
    </div>
  );
}
