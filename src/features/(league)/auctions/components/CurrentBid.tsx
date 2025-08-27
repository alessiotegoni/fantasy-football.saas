import { Badge } from "@/components/ui/badge";
import { useAuction } from "@/contexts/AuctionProvider";
import { Coins, Timer } from "iconoir-react";
import { useEffect, useState } from "react";

export default function CurrentBid() {
  const { currentNomination, bidAmount, currentBidTeam } = useAuction();

  const [timeLeft, setTimeLeft] = useState(0);

  const bidExpiresAt = currentNomination?.expiresAt;
  useEffect(() => {
    if (!bidExpiresAt) return;

    const target = new Date(bidExpiresAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [bidExpiresAt]);

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-8 flex justify-center items-center gap-4
            bg-card border border-border p-2 px-4 rounded-xl"
      >
        <Timer className="size-10 text-primary" />
        <span className="text-3xl font-bold text-primary">{timeLeft}</span>
      </div>
      <div className="flex gap-2 items-center mt-3">
        <Coins className="size-12 text-primary" />
        <p className="text-3xl font-bold">{bidAmount}</p>
      </div>
      <Badge className="p-2 px-4 rounded-lg bg-input w-fit text-md font-medium border border-border">
        {currentBidTeam?.team?.name || "Nessuna squadra"}
      </Badge>
      {currentNomination && <h2>{currentNomination.player.displayName}</h2>}
    </div>
  );
}
