"use client";

import ActionButton from "@/components/ActionButton";
import { useAuction } from "@/contexts/AuctionProvider";
import { createBid } from "../actions/auctionBid";
import { validateBidCredits } from "../utils/auctionBid";
import { calculateRemainingSlots } from "../utils/auctionParticipant";

export default function BidPlayerButtons() {
  const { userParticipant, currentNomination, bidAmount } = useAuction();

  function handleCreateBid(plusAmount: number) {
    return createBid({
      nominationId: currentNomination!.id,
      participantId: userParticipant!.id,
      amount: bidAmount + plusAmount,
    });
  }

  return (
    <div className="w-full flex justify-center gap-2">
      {PLUS_AMOUNT.map((plusAmount) => (
        <PlusButton
          key={plusAmount}
          plusAmount={plusAmount}
          onClick={handleCreateBid}
        />
      ))}
    </div>
  );
}

function PlusButton({
  plusAmount,
  onClick,
}: {
  plusAmount: number;
  onClick: (amount: number) => Promise<{ error: boolean; message: string }>;
}) {
  const { userParticipant, bidAmount, canBid, acquisitions, auction } =
    useAuction();

  const slotsRemaining = calculateRemainingSlots(
    acquisitions,
    userParticipant,
    auction
  );

  const hasValidCredits = validateBidCredits({
    bidAmount: bidAmount + plusAmount,
    participantCredits: userParticipant?.credits ?? 0,
    slotsRemaining: slotsRemaining,
  }).isValid;

  const canPlus = canBid && hasValidCredits;

  return (
    <ActionButton
      className="max-w-36"
      loadingText="Rilancio"
      disabled={!canPlus}
      action={canPlus ? onClick.bind(null, plusAmount) : undefined}
    >
      +{plusAmount}
    </ActionButton>
  );
}

const PLUS_AMOUNT = [1, 5, 10];
