'use client';

import { useAuction } from '@/contexts/AuctionProvider';
import BiddingControls from './BiddingControls';
import BidTurn from './BidTurn';
import CurrentBid from './CurrentBid';

export default function AuctionInProgress() {
  const { currentNomination, currentBid, turnParticipant } = useAuction();

  return (
    <>
      {(currentNomination || currentBid) && <CurrentBid />}
      {turnParticipant && !currentBid && !currentNomination && <BidTurn />}
      <BiddingControls />
    </>
  );
}
