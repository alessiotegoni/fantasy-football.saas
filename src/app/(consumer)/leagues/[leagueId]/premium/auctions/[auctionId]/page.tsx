import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { AuctionBids } from "@/features/(league)/auctions/components/AuctionBids";
import AuctionHeader from "@/features/(league)/auctions/components/AuctionHeader";
import { PlayerDetails } from "@/features/(league)/auctions/components/PlayerDetailts";
import { PlayerSearch } from "@/features/(league)/auctions/components/PlayerSearch";
import {
  AuctionWithSettings,
  getAuctionWithSettings,
} from "@/features/(league)/auctions/queries/auction";
import { getAuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { isLeagueAdmin } from "@/features/(league)/members/permissions/leagueMember";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { Menu } from "iconoir-react";
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

  // TODO: prima mockup di ui con V0 passando lo screen di fantalab
  // capire come funziona il realtime di supabase
  // dopodiche creare query prima per i partecipanti in questa page
  // mentre per i players dei partecipanti fare la query in un componente apparte wrappato
  // con suspense
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

  const [userParticipant, isAdmin] = await Promise.all([
    getAuctionParticipant(auctionId, userTeamId),
    isLeagueAdmin(userId, leagueId),
  ]);
  if (!userParticipant) redirect(`/leagues/${leagueId}/premium/auctions`);

  return (
    <div>
      <AuctionHeader auction={auction} isAdmin={isAdmin} />

      <div className="flex">
        <main className="flex-1">
          {/* Top Section - 3 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            {/* Left Column - Player Search & List */}
            <div className="lg:col-span-3">
              <PlayerSearch />
            </div>

            {/* Center Column - Auction Status */}
            <div className="lg:col-span-6">
              <AuctionBids />
            </div>

            {/* Right Column - Player Details */}
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
        </main>
      </div>
    </div>
  );
}
