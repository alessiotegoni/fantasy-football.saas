'use client';

import { useAuction } from '@/contexts/AuctionProvider';
import BiddingControls from './BiddingControls';
import BidTurn from './BidTurn';
import CurrentBid from './CurrentBid';
import { useAuctionTimer } from '@/hooks/useAuctionTimer';

export default function AuctionInProgress() {
  const { currentNomination, currentBid, turnParticipant } = useAuction();
   const timeLeft = useAuctionTimer({
      expiresAt: currentNomination?.expiresAt ?? null,
      // onExpire: () => {
      //   if (currentNomination) {
      //     handleSetCurrentNomination(null);
      //   }
      // },
    });

  return (
    <>
      {(currentNomination || currentBid) && <CurrentBid timeLeft={timeLeft} />}
      {turnParticipant && !currentBid && !currentNomination && <BidTurn />}
      <BiddingControls />
    </>
  );
}
