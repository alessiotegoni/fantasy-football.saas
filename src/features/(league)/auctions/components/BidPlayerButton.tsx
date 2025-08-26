"use client";

import ActionButton from "@/components/ActionButton";
import { useAuction } from "@/contexts/AuctionProvider";
import { createBid } from "../actions/auctionBid";

export default function BidPlayerButton() {
  const { userParticipant, canBid, currentNomination, bidAmount } =
    useAuction();

  function handleCreateBid() {
    return createBid({
      nominationId: currentNomination!.id,
      participantId: userParticipant!.id,
      amount: bidAmount,
    });
  }

  return (
    <ActionButton
      className="flex-1 max-w-32"
      loadingText="Rilancia"
      disabled={!canBid}
      action={canBid ? handleCreateBid : undefined}
    >
      Rilancia
    </ActionButton>
  );
}
