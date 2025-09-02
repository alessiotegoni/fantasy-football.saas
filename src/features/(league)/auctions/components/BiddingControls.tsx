"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import CustomBidAmountInput from "./CustomBidAmountInput";
import NominatePlayerButton from "./NominatePlayerButton";
import BidPlayerButtons from "./BidPlayerButtons";
import { cn } from "@/lib/utils";

export default function BiddingControls({
  canShowControls,
}: {
  canShowControls: boolean;
}) {
  const {
    canBid,
    currentBid,
    userParticipant,
    customBidMode,
    canNominate,
    bidAmount,
    handleSetBidAmount,
    currentNomination,
  } = useAuction();

  const isMyTurn = userParticipant?.isCurrent ?? false;

  if (!canShowControls || (!isMyTurn && !canBid)) return null;

  return (
    <>
      <div className="flex justify-center">
        {((isMyTurn && !currentNomination) || customBidMode) && (
          <CustomBidAmountInput
            disabled={currentBid ? !canBid : !canNominate}
            value={customBidMode ? bidAmount + 1 : bidAmount}
            onChange={handleSetBidAmount}
            min={currentBid ? bidAmount : 1}
            max={userParticipant?.credits}
          />
        )}
      </div>
      <div
        className={cn(
          "flex gap-3 justify-center",
          (currentBid || currentNomination) && "mt-4"
        )}
      >
        {isMyTurn && !currentNomination && <NominatePlayerButton />}
        {((!isMyTurn && currentNomination) || (isMyTurn && currentBid)) && (
          <BidPlayerButtons />
        )}
      </div>
    </>
  );
}
