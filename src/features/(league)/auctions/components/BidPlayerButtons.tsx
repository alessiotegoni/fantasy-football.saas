"use client";

import ActionButton from "@/components/ActionButton";
import { useAuction } from "@/contexts/AuctionProvider";
import { createBid } from "../actions/auctionBid";
import { validateBidCredits } from "../utils/auctionBid";
import { calculateRemainingSlots } from "../utils/auctionParticipant";
import { useMemo } from "react";

export default function BidPlayerButtons() {
  const { userParticipant, currentNomination, bidAmount, customBidMode } =
    useAuction();

  if (!currentNomination || !userParticipant) return null;

  return (
    <div className="w-full flex justify-center gap-2">
      {customBidMode ? (
        <ActionButton
          loadingText="Rilancio"
          className="w-32"
          action={createBid.bind(null, {
            amount: bidAmount + 1,
            nominationId: currentNomination.id,
            participantId: userParticipant.id,
          })}
        >
          Rilancia
        </ActionButton>
      ) : (
        PLUS_AMOUNT.map((plusAmount) => (
          <PlusButton
            key={plusAmount}
            plusAmount={plusAmount}
            onClick={createBid.bind(null, {
              nominationId: currentNomination.id,
              participantId: userParticipant.id,
              amount: bidAmount + plusAmount,
            })}
          />
        ))
      )}
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

  const canPlus = useMemo(() => {
    const slotsRemaining = calculateRemainingSlots(
      acquisitions,
      userParticipant,
      auction
    );

    const hasValidCredits = validateBidCredits({
      bidAmount: bidAmount + plusAmount,
      participantCredits: userParticipant?.credits ?? 0,
      slotsRemaining,
    }).isValid;

    return canBid && hasValidCredits;
  }, [acquisitions, userParticipant, bidAmount]);

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
