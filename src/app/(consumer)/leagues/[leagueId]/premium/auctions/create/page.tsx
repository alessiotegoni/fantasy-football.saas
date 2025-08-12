import Container from "@/components/Container";
import { PlayersPerRole } from "@/drizzle/schema";
import AuctionForm from "@/features/(league)/auctions/components/AuctionForm";
import { getLeaguePlayersPerRole } from "@/features/(league)/leagues/queries/league";
import { getGeneralSettings } from "@/features/(league)/settings/queries/setting";
import { getRolesWithoutPresident } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { getLiveSplit } from "@/features/splits/queries/split";
import { Suspense } from "react";

export default async function CreateAuctionPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const [playersPerRole, { initialCredits }] = await Promise.all([
    getLeaguePlayersPerRole(leagueId),
    getGeneralSettings(leagueId),
  ]);

  const auction = { playersPerRole, initialCredits };

  return (
    <Container leagueId={leagueId} headerLabel="Crea asta">
      <Suspense fallback={<AuctionForm auction={auction} />}>
        <SuspenseBoundary auction={auction} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary(props: {
  auction: { playersPerRole: PlayersPerRole; initialCredits: number };
}) {
  const [playersRoles, isSplitLive] = await Promise.all([
    getRolesWithoutPresident(),
    getLiveSplit().then(Boolean),
  ]);

  return (
    <AuctionForm
      {...props}
      playersRoles={playersRoles}
      isSplitLive={isSplitLive}
    />
  );
}
