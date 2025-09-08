import { useAuction } from "@/contexts/AuctionProvider";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function AuctionPlayerCard({
  onSelect,
  ...player
}: React.ComponentProps<typeof PlayerCard>) {
  const { acquisitions, selectedPlayer, currentNomination } = useAuction();

  const isAlreadyAcquired = useMemo(
    () => acquisitions.some((a) => a.player.id === player.id),
    [acquisitions]
  );

  const className = cn(
    selectedPlayer?.id === player.id && "border-primary",
    isAlreadyAcquired && "cursor-not-allowed opacity-60"
  );

  return (
    <PlayerCard
      {...player}
      onSelect={onSelect}
      showSelectButton={false}
      className={className}
      canSelectCard={!isAlreadyAcquired && !currentNomination}
    />
  );
}
