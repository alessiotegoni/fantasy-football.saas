import ActionButton from "@/components/ActionButton";
import { Badge } from "@/components/ui/badge";
import { useAuction } from "@/contexts/AuctionProvider";
import { Coins, Timer, Xmark } from "iconoir-react";
import { useEffect, useState } from "react";
import { deleteNomination } from "../actions/auctionNomination";

export default function CurrentBid() {
  const {
    currentNomination,
    currentNominationTeam,
    bidAmount,
    currentBidTeam,
    isLeagueAdmin,
  } = useAuction();

  const currentTeamName =
    currentBidTeam?.team?.name || currentNominationTeam?.team?.name;

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      {currentNomination && isLeagueAdmin && (
        <DeleteNominationButton nominationId={currentNomination.id} />
      )}
      {currentNomination && (
        <BidExiprationTimer expiresAt={currentNomination.expiresAt} />
      )}
      <div className="flex gap-2 items-center">
        <Coins className="size-12 text-primary" />
        <p className="text-3xl font-bold">{bidAmount}</p>
      </div>
      <Badge className="p-2 px-4 rounded-lg bg-input w-fit text-md font-medium border border-border">
        {currentTeamName || "Nessuna squadra"}
      </Badge>
      {currentNomination && <h2>{currentNomination.player.displayName}</h2>}
    </div>
  );
}

function DeleteNominationButton({ nominationId }: { nominationId: string }) {
  return (
    <ActionButton
      className="size-8 absolute right-4 top-4"
      action={deleteNomination.bind(null, nominationId)}
    >
      <Xmark />
    </ActionButton>
  );
}

function BidExiprationTimer({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const target = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 -top-8 flex justify-center items-center gap-4
            bg-card border border-border p-2 px-4 rounded-xl"
    >
      <Timer className="size-10 text-primary" />
      <span className="text-3xl font-bold text-primary">{timeLeft}</span>
    </div>
  );
}
