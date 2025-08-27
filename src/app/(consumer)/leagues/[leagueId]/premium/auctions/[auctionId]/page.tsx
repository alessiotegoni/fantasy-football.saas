import AuctionHeader from "@/features/(league)/auctions/components/AuctionHeader";
import AuctionWrapper from "@/features/(league)/auctions/components/AuctionWrapper";
import {
  AuctionWithSettings,
  getAuctionAvailablePlayers,
  getAuctionWithSettings,
} from "@/features/(league)/auctions/queries/auction";
import { getAcquisitions } from "@/features/(league)/auctions/queries/auctionAcquisition";
import { getHighestBid } from "@/features/(league)/auctions/queries/auctionBid";
import { getCurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { getAuctionParticipants } from "@/features/(league)/auctions/queries/auctionParticipant";
import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import PlayersList from "@/features/(league)/teamsPlayers/components/PlayersList";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
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

  const [auction, playerRoles] = await Promise.all([
    getAuctionWithSettings(ids.auctionId),
    getPlayersRoles(),
  ]);
  if (!auction) notFound();

  return (
    <div className="max-w-[1600px] mx-auto">
      <Suspense>
        <SuspenseBoundary
          {...ids}
          auction={auction}
          playerRoles={playerRoles}
        />
      </Suspense>
    </div>
  );
}

async function SuspenseBoundary({
  leagueId,
  auctionId,
  auction,
  playerRoles,
}: {
  leagueId: string;
  auctionId: string;
  auction: NonNullable<AuctionWithSettings>;
  playerRoles: {
    id: number;
    name: string;
    shortName: string;
  }[];
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const userTeamId = await getUserTeamId(userId, leagueId);
  if (!userTeamId) redirect(`/leagues/${leagueId}/teams/create`);

  const [participants, currentNomination, isAdmin] = await Promise.all([
    getAuctionParticipants(auctionId),
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
  };

  return (
    <>
      <AuctionHeader auction={auction} isAdmin={isAdmin} />

      <div className="flex">
        <main className="flex-1">
          <Suspense fallback={<AuctionWrapper {...wrapperProps} />}>
            <AuctionAcquisitions {...wrapperProps} />
          </Suspense>
        </main>
      </div>
    </>
  );
}

async function AuctionAcquisitions(
  props: React.ComponentProps<typeof AuctionWrapper>
) {
  const acquisitions = await getAcquisitions(props.auction.id);
  return <AuctionWrapper {...props} acquisitions={acquisitions} />;
}
