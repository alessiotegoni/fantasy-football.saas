"use client"

import ActionButton from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useAuction } from "@/contexts/AuctionProvider";
import { BitcoinCircle, Coins, Timer, Xmark } from "iconoir-react";
import { useEffect, useState } from "react";
import { deleteNomination } from "../actions/auctionNomination";
import { cn } from "@/lib/utils";

export default function CurrentBid() {
  const {
    currentNomination,
    currentNominationTeam,
    bidAmount,
    currentBidTeam,
    isLeagueAdmin,
  } = useAuction();

  if (!currentNomination) return null;

  const currentTeamName =
    currentBidTeam?.team?.name || currentNominationTeam?.team?.name;

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      {isLeagueAdmin && (
        <DeleteNominationButton nominationId={currentNomination.id} />
      )}
      <CustomBidButton />

      <BidExiprationTimer expiresAt={currentNomination.expiresAt} />
      <div className="flex gap-2 items-center">
        <Coins className="size-12 text-primary" />
        <p className="text-3xl font-bold">{bidAmount}</p>
      </div>
      <Badge className="p-2 px-4 rounded-lg bg-input w-fit text-md font-medium border border-border">
        {currentTeamName || "Nessuna squadra"}
      </Badge>
      <h2>{currentNomination.player.displayName}</h2>
    </div>
  );
}

export function CustomBidButton() {
  const { customBidMode, toggleCustomBidMode } = useAuction();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "absolute left-4 top-4 size-10 rounded-full border border-border",
            customBidMode ? "bg-primary" : "bg-input/60"
          )}
          onClick={toggleCustomBidMode}
        >
          <BitcoinCircle className="size-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Scegli la puntata</TooltipContent>
    </Tooltip>
  );
}

function DeleteNominationButton({ nominationId }: { nominationId: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ActionButton
          variant="ghost"
          className="absolute right-4 top-4 size-10 rounded-full border border-border bg-input/60"
          action={deleteNomination.bind(null, nominationId)}
        >
          <Xmark className="size-6" />
        </ActionButton>
      </TooltipTrigger>
      <TooltipContent>Rimuovi chiamata</TooltipContent>
    </Tooltip>
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
