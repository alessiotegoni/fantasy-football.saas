"use client";

import { createClient } from "@/services/supabase/client/supabase";
import { AuctionBids } from "./AuctionBids";
import { PlayerDetails } from "./PlayerDetailts";
import { use, useEffect, useState } from "react";
import { AuctionWithSettings } from "../queries/auction";
import { Nomination } from "../queries/auctionNomination";

type Props = {
  auction: NonNullable<AuctionWithSettings>;
  currentNominationPromise: Promise<Nomination>;
};

export default function BidWrapper({
  auction,
  currentNominationPromise,
}: Props) {
  const { currentNomination } = useCurrentNomination({
    auction,
    currentNominationPromise,
  });

  return (
    <>
      <div className="lg:col-span-6">
        <AuctionBids />
      </div>
      <div className="lg:col-span-3">
        <PlayerDetails />
      </div>
      ;
    </>
  );
}

function useCurrentNomination({ auction, currentNominationPromise }: Props) {
  const [currentNomination, setCurrentNomination] = useState<Nomination | null>(
    null
  );

  function subscribeNominations() {
    const supabase = createClient();

    const subscription = supabase
      .channel(`id:${auction.id}-auction-nomination`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_nominations" },
        (payload) => {
          const nomination =
            payload.eventType === "INSERT"
              ? use(currentNominationPromise)
              : null;
          setCurrentNomination(nomination);
        }
      )
      .subscribe();

    return subscription;
  }

  useEffect(() => {
    const subscription = subscribeNominations();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { currentNomination, setCurrentNomination };
}
