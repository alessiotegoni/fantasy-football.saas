import Container from "@/components/Container";
import AuctionForm from "@/features/(league)/auctions/components/AuctionForm";
import {
  Auction,
  getAuction,
} from "@/features/(league)/auctions/queries/auction";
import { getRolesWithoutPresident } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { getLiveSplit } from "@/features/splits/queries/split";
import { Suspense } from "react";

export default async function EditActionPage({
  params,
}: {
  params: Promise<{ leagueId: string; auctionId: string }>;
}) {
  const { leagueId, auctionId } = await params;
  const auction = await getAuction(auctionId);

  return (
    <Container leagueId={leagueId} headerLabel="Crea asta">
      <Suspense fallback={<AuctionForm auction={auction} />}>
        <SuspenseBoundary auction={auction} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary(props: { auction: Auction }) {
  const [playersRoles, isSplitLive] = await Promise.all([
    getRolesWithoutPresident(),
    getLiveSplit().then(Boolean),
  ]);

  return (
    <AuctionForm
      {...props}
      playersRoles={playersRoles}
      isSplitLive={isSplitLive}
    />
  );
}
