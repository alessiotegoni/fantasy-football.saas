import AuctionHeader from "@/features/(league)/auctions/components/AuctionHeader";
import AuctionWrapper from "@/features/(league)/auctions/components/AuctionWrapper";
import {
  AuctionWithSettings,
  getAuctionWithSettings,
} from "@/features/(league)/auctions/queries/auction";
import { getAcquisitions } from "@/features/(league)/auctions/queries/auctionAcquisition";
import { getHighestBid } from "@/features/(league)/auctions/queries/auctionBid";
import { getCurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import {
  AuctionParticipant,
  getAuctionParticipants,
} from "@/features/(league)/auctions/queries/auctionParticipant";
import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: Promise<{
    leagueId: string;
    auctionId: string;
  }>;
};

function AuctionPageFallback({
  auction,
}: {
  auction: NonNullable<AuctionWithSettings>;
}) {
  return (
    <div>
      <AuctionHeader auction={auction} isAdmin={false} />
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="grid grid-cols-[1fr_200px] lg:grid-cols-12 gap-6">
            <div className="hidden lg:block lg:col-span-3">
              <Skeleton className="h-[600px] w-full" />
            </div>
            <div className="lg:col-span-6">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default async function AuctionPage({ params }: Props) {
  const ids = await params;

  const [auction, participants] = await Promise.all([
    getAuctionWithSettings(ids.auctionId),
    getAuctionParticipants(ids.auctionId),
  ]);
  if (!auction) notFound();

  return (
    <div className="max-w-[1600px] mx-auto">
      <Suspense fallback={<AuctionPageFallback auction={auction} />}>
        <SuspenseBoundary
          {...ids}
          auction={auction}
          participants={participants}
        />
      </Suspense>
    </div>
  );
}

async function SuspenseBoundary({
  leagueId,
  auctionId,
  auction,
  participants,
}: {
  leagueId: string;
  auctionId: string;
  auction: NonNullable<AuctionWithSettings>;
  participants: AuctionParticipant[];
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const userTeamId = await getUserTeamId(userId, leagueId);
  if (!userTeamId) redirect(`/leagues/${leagueId}/teams/create`);

  const [acquisitions, currentNomination, isAdmin] = await Promise.all([
    getAcquisitions(auctionId),
    getCurrentNomination(auction.id),
    getLeagueAdmin(userId, leagueId),
  ]);
  if (!participants.find((p) => p.team?.id === userTeamId)) {
    redirect(`/leagues/${leagueId}/premium/auctions`);
  }

  const currentBid = currentNomination
    ? await getHighestBid(currentNomination.id)
    : null;

  const wrapperProps = {
    defaultParticipants: participants,
    defaultNomination: currentNomination,
    defaultBid: currentBid,
    auction: auction,
    isLeagueAdmin: isAdmin,
    userTeamId: userTeamId,
    defaultAcquisitions: acquisitions,
  };

  return (
    <div>
      <AuctionHeader auction={auction} isAdmin={isAdmin} />
      <div className="flex">
        <main className="flex-1">
          <AuctionWrapper {...wrapperProps} />
        </main>
      </div>
    </div>
  );
}
