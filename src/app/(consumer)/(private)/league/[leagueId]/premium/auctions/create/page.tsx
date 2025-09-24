import Container from "@/components/Container";
import Disclaimer from "@/components/Disclaimer";
import { PlayersPerRole } from "@/drizzle/schema";
import { getLiveSplit } from "@/features/dashboard/admin/splits/queries/split";
import AuctionForm from "@/features/league/auctions/components/AuctionForm";
import {
  getGeneralSettings,
  getLeaguePlayersPerRole,
} from "@/features/league/settings/queries/setting";
import { getRolesWithoutPresident } from "@/features/league/teamsPlayers/queries/teamsPlayer";
import { Suspense } from "react";

export default async function CreateAuctionPage({
  params,
}: PageProps<"/league/[leagueId]/premium/auctions/create">) {
  const { leagueId } = await params;
  const [playersPerRole, { initialCredits }] = await Promise.all([
    getLeaguePlayersPerRole(leagueId),
    getGeneralSettings(leagueId),
  ]);

  const auctionSettings = {
    playersPerRole,
    initialCredits,
    firstCallTime: 20,
    othersCallsTime: 10,
  };

  return (
    <Container headerLabel="Crea asta">
      <Suspense fallback={<AuctionForm auctionSettings={auctionSettings} />}>
        <SuspenseBoundary auctionSettings={auctionSettings} />
      </Suspense>
      <Disclaimer />
    </Container>
  );
}

async function SuspenseBoundary(props: {
  auctionSettings: {
    playersPerRole: PlayersPerRole;
    initialCredits: number;
    firstCallTime: number;
    othersCallsTime: number;
  };
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
