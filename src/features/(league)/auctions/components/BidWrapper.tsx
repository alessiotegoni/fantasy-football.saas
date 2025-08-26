"use client";

import { AuctionBids } from "./AuctionBids";
import { PlayerDetails } from "./PlayerDetailts";
import { AuctionWithSettings } from "../queries/auction";
import { NominationWithPlayer } from "../queries/auctionNomination";
import useCurrentNomination from "@/hooks/useCurrentNomination";

type Props = {
  auction: NonNullable<AuctionWithSettings>;
  lastNominationPromise: Promise<NominationWithPlayer>;
};

export default function BidWrapper({ auction, lastNominationPromise }: Props) {
  const { currentNomination } = useCurrentNomination({
    auction,
    lastNominationPromise,
  });

  return (
    <>
      <div className="lg:col-span-6">
        <AuctionBids currentNomination={currentNomination} />
      </div>
      <div className="lg:col-span-3">
        <PlayerDetails currentNomination={currentNomination} />
      </div>
    </>
  );
}
