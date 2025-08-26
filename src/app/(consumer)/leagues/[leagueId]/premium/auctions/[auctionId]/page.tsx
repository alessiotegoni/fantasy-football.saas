import AuctionProvider from "@/contexts/AuctionProvider";
import AuctionHeader from "@/features/(league)/auctions/components/AuctionHeader";
import BidWrapper from "@/features/(league)/auctions/components/BidWrapper";
import {
  AuctionWithSettings,
  getAuctionAvailablePlayers,
  getAuctionWithSettings,
} from "@/features/(league)/auctions/queries/auction";
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

  const [participants, isAdmin] = await Promise.all([
    getAuctionParticipants(auctionId),
    isLeagueAdmin(userId, leagueId),
  ]);
  const userParticipant = participants.find((p) => p.teamId === userTeamId);
  if (!userParticipant) redirect(`/leagues/${leagueId}/premium/auctions`);

  return (
    <div>
      <AuctionHeader auction={auction} isAdmin={isAdmin} />

      <div className="flex">
        <main className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-0 sm:p-6">
            <AuctionProvider>
              <div className="lg:col-span-3">
                {/* <Suspense>
                  <AuctionAvailablePlayers {...auction} />
                </Suspense> */}
              </div>

              <BidWrapper
                userParticipant={userParticipant}
                isAdmin={isAdmin}
                auction={auction}
                currentNominationPromise={getCurrentNomination(auction.id)}
              />
            </AuctionProvider>
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
