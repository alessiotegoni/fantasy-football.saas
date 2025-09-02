"use client";

import ActionButton from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useAuction } from "@/contexts/AuctionProvider";
import { BitcoinCircle, Check, Coins, Timer, Xmark } from "iconoir-react";
import { deleteNomination } from "../actions/auctionNomination";
import { cn } from "@/lib/utils";
import { confirmAcquisition } from "../actions/auctionAcquisition";

export default function CurrentBid({
  timeLeft,
}: {
  timeLeft: number | undefined;
}) {
  const {
    currentNomination,
    currentNominationTeam,
    bidAmount,
    currentBid,
    currentBidTeam,
    isLeagueAdmin,
    userParticipant,
  } = useAuction();

  if (!currentNomination) return null;

  const currentTeamName =
    currentBidTeam?.team?.name || currentNominationTeam?.team?.name;

  const isBidExpired = timeLeft !== undefined && timeLeft === 0;

  const isMyTurn = userParticipant?.isCurrent ?? false;
  const canShowCustomBidBtn =
    !isBidExpired &&
    ((!isMyTurn && currentNomination) || (isMyTurn && currentBid));

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      {isLeagueAdmin && (
        <DeleteNominationButton nominationId={currentNomination.id} />
      )}
      {canShowCustomBidBtn && <CustomBidButton />}

      <BidExiprationTimer timeLeft={timeLeft} />
      <div className="flex gap-2 items-center">
        <Coins className="size-12 text-primary" />
        <p className="text-3xl font-bold">{bidAmount}</p>
      </div>
      <Badge className="p-2 px-4 rounded-lg bg-input w-fit text-md font-medium border border-border">
        {currentTeamName || "Nessuna squadra"}
      </Badge>
      {isBidExpired && currentNomination && isLeagueAdmin && (
        <ConfirmAcquisitionButton />
      )}
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
  const { handleSetBidAmount } = useAuction();

  function handleDelete() {
    handleSetBidAmount(1);

    return deleteNomination(nominationId);
  }

  return (
    <ActionButton
      loadingText=""
      variant="destructive"
      className="absolute right-4 top-4 size-10 rounded-full border border-border bg-input/60"
      action={handleDelete}
    >
      <Xmark className="size-6" />
    </ActionButton>
  );
}

function ConfirmAcquisitionButton() {
  const { auction, currentNomination, bidAmount, currentBidTeam } =
    useAuction();

  if (!currentBidTeam || !currentNomination) return null;

  function handleConfirmAcquisition() {
    return confirmAcquisition({
      auctionId: auction.id,
      participantId: currentBidTeam!.id,
      playerId: currentNomination!.player.id,
      price: bidAmount,
    });
  }

  return (
    <ActionButton
      loadingText="Confermo"
      className="bg-green-600 hover:bg-green-500 max-w-50"
      action={handleConfirmAcquisition}
    >
      <Check className="size-5" />
      Conferma acquisto
    </ActionButton>
  );
}

function BidExiprationTimer({ timeLeft }: { timeLeft: number | undefined }) {
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
