"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import CustomBidAmountInput from "./CustomBidAmountInput";
import NominatePlayerButton from "./NominatePlayerButton";
import BidPlayerButtons from "./BidPlayerButtons";
import { cn } from "@/lib/utils";

export default function BiddingControls() {
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

  if (!isMyTurn && !canBid) return null;

  return (
    <>
      <div className="flex justify-center">
        {(userParticipant?.isCurrent || customBidMode) && (
          <CustomBidAmountInput
            containerClassName="mb-4"
            disabled={currentBid ? !canBid : !canNominate}
            value={bidAmount}
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
        {isMyTurn && !currentBid ? (
          <NominatePlayerButton />
        ) : (
          <BidPlayerButtons />
        )}
      </div>
    </>
  );
}
