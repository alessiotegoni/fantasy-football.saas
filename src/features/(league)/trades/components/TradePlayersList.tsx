"use client";

import { UseFieldArrayRemove } from "react-hook-form";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { Xmark } from "iconoir-react";
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

export function TradePlayersList({
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
    <div className="flex flex-wrap gap-1.5 mt-4">
      {players.map(({ purchaseCost, ...player }) => (
        <div
          key={player.id}
          className="flex items-center gap-3.5 border border-border rounded-3xl p-2 pr-2.5 py-2 bg-background w-fit"
        >
          <PlayerCard
            {...player}
            showSelectButton={false}
            className="border-transparent p-0 text-xs"
            avatarSize={9}
          />
          <Button
            variant="destructive"
            className="shrink-0 !p-0 size-[22px] rounded-full"
            onClick={onRemovePlayer.bind(null, player.index)}
          >
            <Xmark />
          </Button>
        </div>
      ))}
    </div>
  );
}
