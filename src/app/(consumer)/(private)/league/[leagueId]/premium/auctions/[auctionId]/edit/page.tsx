import Container from "@/components/Container";
import Disclaimer from "@/components/Disclaimer";
import { getLiveSplit } from "@/features/dashboard/admin/splits/queries/split";
import AuctionForm from "@/features/league/auctions/components/AuctionForm";
import {
  AuctionWithSettings,
  getAuctionWithSettings,
} from "@/features/league/auctions/queries/auction";
import { getRolesWithoutPresident } from "@/features/league/teamsPlayers/queries/teamsPlayer";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function EditAuctionPage({
  params,
}: PageProps<"/league/[leagueId]/premium/auctions/[auctionId]/edit">) {
  const { auctionId } = await params;

  const auction = await getAuctionWithSettings(auctionId);
  if (!auction) notFound();

  const { settings, ...restAuction } = auction;

  return (
    <Container headerLabel="Crea asta">
      <Suspense
        fallback={
          <AuctionForm auction={restAuction} auctionSettings={settings} />
        }
      >
        <SuspenseBoundary auction={auction} />
      </Suspense>
      <Disclaimer />
    </Container>
  );
}

async function SuspenseBoundary({
  auction,
}: {
  auction: NonNullable<AuctionWithSettings>;
}) {
  const [playersRoles, isSplitLive] = await Promise.all([
    getRolesWithoutPresident(),
    getLiveSplit().then(Boolean),
  ]);

  const { settings, ...restAuction } = auction;

  return (
    <AuctionForm
      auction={restAuction}
      auctionSettings={settings}
      playersRoles={playersRoles}
      isSplitLive={isSplitLive}
    />
  );
}
