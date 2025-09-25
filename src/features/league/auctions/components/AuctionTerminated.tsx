import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuction } from "@/contexts/AuctionProvider";
import { Arc3dCenterPoint, NavArrowRight } from "iconoir-react";
import Link from "next/link";
import { getAuctionDuration } from "../utils/auction";

export default function AuctionTerminated() {
  const { auction, userParticipant } = useAuction();

  const auctionDuration = getAuctionDuration(auction);

  return (
    <EmptyState
      icon={Arc3dCenterPoint}
      title="Asta terminata"
      subtitle={auctionDuration && `Durata: ${auctionDuration}`}
      description="Tutte le rose sono state automaticamente importate all'interno della lega"
      className="static translate-none !bg-muted/30 max-w-full"
      renderButton={() =>
        userParticipant?.teamId && (
          <Button asChild>
            <Link
              href={`/league/${auction.leagueId}/teams/${userParticipant.teamId}`}
            >
              Vedi i tuoi giocatori
              <NavArrowRight className="size-5" />
            </Link>
          </Button>
        )
      }
    />
  );
}
