import Container from "@/components/Container";
import { getAuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { getAuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
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
    <Container {...ids} headerLabel={auction.name} className="max-w-full">
      <Suspense>
        <SuspenseBoundary {...ids} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  auctionId,
}: {
  leagueId: string;
  auctionId: string;
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const userTeamId = await getUserTeamId(userId, leagueId);

  const userParticipant = await getAuctionParticipant(auctionId, userTeamId);
  if (!userParticipant) redirect(`/leagues/${leagueId}/premium/auctions`);

  return <></>;
}
