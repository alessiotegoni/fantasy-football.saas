"use client";

import { AuctionBids } from "./AuctionBids";
import { PlayerDetails } from "./PlayerDetailts";
import { AuctionWithSettings } from "../queries/auction";
import { NominationWithPlayer } from "../queries/auctionNomination";
import useCurrentNomination from "@/hooks/useCurrentNomination";

type Props = {
  isAdmin: boolean;
  auction: NonNullable<AuctionWithSettings>;
  lastNominationPromise: Promise<NominationWithPlayer>;
};

export default function BidWrapper(props: Props) {
  const { currentNomination } = useCurrentNomination(props);

  return (
    <>
      <div className="lg:col-span-6">
        <AuctionBids currentNomination={currentNomination} {...props} />
      </div>
      <div className="lg:col-span-3">
        <PlayerDetails currentNomination={currentNomination} {...props} />
      </div>
    </>
  );
}
