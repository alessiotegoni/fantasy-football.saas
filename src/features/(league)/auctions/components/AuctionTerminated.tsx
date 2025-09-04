import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuction } from "@/contexts/AuctionProvider";
import { Arc3dCenterPoint, NavArrowRight } from "iconoir-react";
import Link from "next/link";

export default function AuctionTerminated() {
  const { auction, userParticipant } = useAuction();

  const auctionDuration = getAuctionDuration(auction);

  return (
    <EmptyState
      icon={Arc3dCenterPoint}
      title="Asta terminata"
      subtitle={auctionDuration && `L'asta e' durata ${auctionDuration}`}
      description="Tutte le rose sono state automaticamente importate all'interno della lega"
      className="static translate-none"
      renderButton={() => (
        <Button asChild>
          <Link
            href={`/leagues/${auction.leagueId}/teams/${userParticipant?.teamId}`}
          >
            Vedi i tuoi giocatori
            <NavArrowRight className="size-5" />
          </Link>
        </Button>
      )}
    />
  );
}

function getAuctionDuration({
  startedAt,
  endedAt,
}: {
  startedAt: Date | null;
  endedAt: Date | null;
}) {
  if (!startedAt || !endedAt) return;

  const durationMs =
    new Date(endedAt).getTime() - new Date(startedAt).getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} ${hours > 1 ? "ore" : "ora"}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes > 1 ? "minuti" : "minuto"}`);
  }

  return parts.join(" e ");
}
