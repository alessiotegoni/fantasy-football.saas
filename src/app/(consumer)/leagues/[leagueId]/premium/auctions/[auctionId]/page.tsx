import { playerRoles } from "@/drizzle/schema";
import AuctionHeader from "@/features/(league)/auctions/components/AuctionHeader";
import AuctionWrapper from "@/features/(league)/auctions/components/AuctionWrapper";
import {
  AuctionWithSettings,
  getAuctionWithSettings,
} from "@/features/(league)/auctions/queries/auction";
import { ParticipantAcquisition } from "@/features/(league)/auctions/queries/auctionAcquisition";
import { getHighestBid } from "@/features/(league)/auctions/queries/auctionBid";
import { getCurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import {
  AuctionParticipant,
  getParticipantsWithAcquisitions,
} from "@/features/(league)/auctions/queries/auctionParticipant";
import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
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

  const [auction, participantsWithAcquisitions, playersRoles] =
    await Promise.all([
      getAuctionWithSettings(ids.auctionId),
      getParticipantsWithAcquisitions(ids.auctionId),
      getPlayersRoles(),
    ]);
  if (!auction) notFound();

  const defaultParticipants = participantsWithAcquisitions.map(
    ({ acquisitions, ...p }) => p
  );
  const defaultAcquisitions = participantsWithAcquisitions.flatMap(
    (p) => p.acquisitions
  );

  const props = {
    ...ids,
    defaultParticipants,
    defaultAcquisitions,
    auction,
    playersRoles,
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <Suspense fallback={<AuctionWrapper {...props} />}>
        <SuspenseBoundary {...props} />
      </Suspense>
    </div>
  );
}

async function SuspenseBoundary({
  leagueId,
  auctionId,
  ...props
}: {
  auctionId: string;
  leagueId: string;
  playersRoles: (typeof playerRoles.$inferSelect)[];
  auction: NonNullable<AuctionWithSettings>;
  defaultParticipants: AuctionParticipant[];
  defaultAcquisitions: ParticipantAcquisition[];
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const userTeamId = await getUserTeamId(userId, leagueId);
  if (!userTeamId) redirect(`/leagues/${leagueId}/teams/create`);

  const [currentNomination, isAdmin] = await Promise.all([
    getCurrentNomination(auctionId),
    getLeagueAdmin(userId, leagueId),
  ]);
  if (!props.defaultParticipants.find((p) => p.team?.id === userTeamId)) {
    redirect(`/leagues/${leagueId}/premium/auctions`);
  }

  const currentBid = currentNomination
    ? await getHighestBid(currentNomination.id)
    : null;

  const wrapperProps = {
    defaultNomination: currentNomination,
    defaultBid: currentBid,
    isLeagueAdmin: isAdmin,
    userTeamId: userTeamId,
    ...props,
  };

  return <AuctionWrapper {...wrapperProps} />;
}
