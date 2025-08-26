import AuctionProvider from "@/contexts/AuctionProvider";
import AuctionBids from "@/features/(league)/auctions/components/AuctionBids";
import AuctionHeader from "@/features/(league)/auctions/components/AuctionHeader";
import BidWrapper from "@/features/(league)/auctions/components/BidWrapper";
import PlayerDetails from "@/features/(league)/auctions/components/PlayerDetailts";
import {
  AuctionWithSettings,
  getAuctionAvailablePlayers,
  getAuctionWithSettings,
} from "@/features/(league)/auctions/queries/auction";
import { getHighestBid } from "@/features/(league)/auctions/queries/auctionBid";
import { getCurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import {
  getAuctionParticipant,
  getAuctionParticipants,
} from "@/features/(league)/auctions/queries/auctionParticipant";
import { isLeagueAdmin } from "@/features/(league)/members/permissions/leagueMember";
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
    <div>
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
    isLeagueAdmin(userId, leagueId),
  ]);
  const userParticipant = participants.find((p) => p.team?.id === userTeamId);
  if (!userParticipant) redirect(`/leagues/${leagueId}/premium/auctions`);

  const currentBid = currentNomination
    ? await getHighestBid(currentNomination.id)
    : null;

  return (
    <div>
      <AuctionHeader auction={auction} isAdmin={isAdmin} />

      <div className="flex">
        <main className="flex-1">
          <AuctionProvider
            defaultParticipants={participants}
            defaultNomination={currentNomination}
            defaultBid={currentBid}
            auction={auction}
            isLeagueAdmin={isAdmin}
            userParticipant={userParticipant}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-0 sm:p-6">
              <div className="lg:col-span-3">
                {/* <Suspense>
                  <AuctionAvailablePlayers {...auction} />
                </Suspense> */}
              </div>

              <div className="lg:col-span-6">
                <AuctionBids />
              </div>
              <div className="lg:col-span-3">
                <PlayerDetails />
              </div>
            </div>

            {/* <div className="px-6 pb-6">
            <ParticipantsList participants={participants} />
            </div>

            <div className="px-6 pb-6">
            <PlayerRoster roles={roles} />
            </div> */}
          </AuctionProvider>
        </main>
      </div>
    </div>
  );
}

async function AuctionAvailablePlayers({
  id,
  leagueId,
}: {
  id: string;
  leagueId: string;
}) {
  const players = await getAuctionAvailablePlayers(id);

  return (
    <PlayersList
      leagueId={leagueId}
      players={players}
      virtualized
      showSelectionButton={false}
    />
  );
}
