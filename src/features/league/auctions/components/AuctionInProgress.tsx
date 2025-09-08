"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import BiddingControls from "./BiddingControls";
import BidTurn from "./BidTurn";
import CurrentBid from "./CurrentBid";
import { useAuctionTimer } from "@/hooks/useAuctionTimer";

export default function AuctionInProgress() {
  const { currentNomination, currentBid, turnParticipant } = useAuction();
  const timeLeft = useAuctionTimer();

  return (
    <>
      {(currentNomination || currentBid) && <CurrentBid timeLeft={timeLeft} />}
      {turnParticipant && !currentBid && !currentNomination && <BidTurn />}
      <BiddingControls canShowControls={timeLeft !== 0} />
    </>
  );
}
