import AuctionHeader from "@/features/(league)/auctions/components/AuctionHeader";
import AuctionWrapper from "@/features/(league)/auctions/components/AuctionWrapper";
import {
  AuctionWithSettings,
  getAuctionWithSettings,
} from "@/features/(league)/auctions/queries/auction";
import { getHighestBid } from "@/features/(league)/auctions/queries/auctionBid";
import { getCurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import {
  AuctionParticipantWithAcquisitions,
  getParticipantsWithAcquisitions,
} from "@/features/(league)/auctions/queries/auctionParticipant";
import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    leagueId: string;
    auctionId: string;
  }>;
};

export default async function AuctionPage({ params }: Props) {
  const ids = await params;

  const [auction, participantsWithAcquisitions] = await Promise.all([
    getAuctionWithSettings(ids.auctionId),
    getParticipantsWithAcquisitions(ids.auctionId),
  ]);
  if (!auction) notFound();

  return (
    <div className="max-w-[1600px] mx-auto">
      <Suspense>
        <SuspenseBoundary
          {...ids}
          auction={auction}
          participantsWithAcquisitions={participantsWithAcquisitions}
        />
      </Suspense>
    </div>
  );
}

async function SuspenseBoundary({
  leagueId,
  auctionId,
  auction,
  participantsWithAcquisitions,
}: {
  leagueId: string;
  auctionId: string;
  auction: NonNullable<AuctionWithSettings>;
  participantsWithAcquisitions: AuctionParticipantWithAcquisitions[];
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const userTeamId = await getUserTeamId(userId, leagueId);
  if (!userTeamId) redirect(`/leagues/${leagueId}/teams/create`);

  const [currentNomination, isAdmin] = await Promise.all([
    getCurrentNomination(auction.id),
    getLeagueAdmin(userId, leagueId),
  ]);
  if (!participantsWithAcquisitions.find((p) => p.team?.id === userTeamId)) {
    redirect(`/leagues/${leagueId}/premium/auctions`);
  }

  const currentBid = currentNomination
    ? await getHighestBid(currentNomination.id)
    : null;

  const allAcquisitions = participantsWithAcquisitions.flatMap(
    (p) => p.acquisitions
  );

  const wrapperProps = {
    defaultParticipants: participantsWithAcquisitions,
    defaultNomination: currentNomination,
    defaultBid: currentBid,
    auction: auction,
    isLeagueAdmin: isAdmin,
    userTeamId: userTeamId,
    defaultAcquisitions: allAcquisitions,
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
