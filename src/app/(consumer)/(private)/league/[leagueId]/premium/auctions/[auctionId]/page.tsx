import { playerRoles } from "@/drizzle/schema";
import AuctionHeader from "@/features/league/auctions/components/AuctionHeader";
import AuctionWrapper from "@/features/league/auctions/components/AuctionWrapper";
import {
  AuctionWithSettings,
  getAuctionWithSettings,
} from "@/features/league/auctions/queries/auction";
import { ParticipantAcquisition } from "@/features/league/auctions/queries/auctionAcquisition";
import { getHighestBid } from "@/features/league/auctions/queries/auctionBid";
import { getCurrentNomination } from "@/features/league/auctions/queries/auctionNomination";
import {
  AuctionParticipant,
  getParticipantsWithAcquisitions,
} from "@/features/league/auctions/queries/auctionParticipant";
import { isLeagueAdmin } from "@/features/league/members/permissions/leagueMember";
import { getPlayersRoles } from "@/features/league/teamsPlayers/queries/teamsPlayer";
import { getUserTeamId } from "@/features/dashboard/user/queries/user";
import { getUserId } from "@/features/dashboard/user/utils/user";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AuctionPage({
  params,
}: PageProps<"/league/[leagueId]/premium/auctions/[auctionId]">) {
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
    defaultAuction: auction,
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
  defaultAuction: NonNullable<AuctionWithSettings>;
  defaultParticipants: AuctionParticipant[];
  defaultAcquisitions: ParticipantAcquisition[];
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const [userTeamId, currentNomination, isAdmin] = await Promise.all([
    getUserTeamId(userId, leagueId),
    getCurrentNomination(auctionId),
    isLeagueAdmin(userId, leagueId),
  ]);

  if (!userTeamId) redirect(`/leagues/${leagueId}/teams/create`);

  if (!props.defaultParticipants.find((p) => p.team?.id === userTeamId)) {
    redirect(`/league/${leagueId}/premium/auctions`);
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
