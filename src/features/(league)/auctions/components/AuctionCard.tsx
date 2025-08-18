"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { AuctionWithCreator } from "../queries/auction";
import AuctionStatus from "../components/AuctionStatus";
import AuctionDropdownMenu from "./AuctionDropdownMenu";

type Props = {
  auction: AuctionWithCreator;
  leagueId: string;
  isLeagueAdmin: boolean;
  canEdit: boolean;
};

export default function AuctionCard({
  auction,
  leagueId,
  isLeagueAdmin,
  canEdit,
}: Props) {
  const canUpdateAuction = canEdit && auction.status !== "ended";

  // FIXME: quando elimino un'asta l'overlay dell'alert dialog di ActionButton rimane aperto

  return (
    <div className="bg-input/30 border border-border rounded-4xl p-5 min-h-40 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-card-foreground flex-1 min-w-0">
            {auction.name}
          </h3>

          <div className="flex items-center gap-2 flex-shrink-0">
            <AuctionStatus
              auction={auction}
              canUpdate={isLeagueAdmin && canUpdateAuction}
            />

            {isLeagueAdmin && (
              <AuctionDropdownMenu
                auction={auction}
                canUpdate={canUpdateAuction}
                leagueId={leagueId}
              />
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground sm:mt-1">
          Creata da{" "}
          <span className="font-semibold">{auction.creator.managerName}</span>
        </div>
      </div>

      {auction.description && (
        <p className="text-sm text-muted-foreground leading-relaxed sm:mb-3 mt-1.5">
          {auction.description}
        </p>
      )}

      <Button asChild className="self-end w-fit mt-3 sm:mt-0">
        <Link href={`/leagues/${leagueId}/auctions/${auction.id}`}>
          Partecipa
        </Link>
      </Button>
    </div>
  );
}
