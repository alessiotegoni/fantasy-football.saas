import AuctionProvider from "@/contexts/AuctionProvider";
import {
  AuctionWithSettings,
  getAuctionAvailablePlayers,
} from "@/features/(league)/auctions/queries/auction";
import { AuctionAcquisition } from "@/features/(league)/auctions/queries/auctionAcquisition";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import AuctionBids from "./AuctionBids";
import PlayerDetails from "./PlayerDetailts";
import PlayersList from "../../teamsPlayers/components/PlayersList";

type Props = {
  defaultParticipants: AuctionParticipant[];
  isLeagueAdmin: boolean;
  userTeamId: string;
  auction: NonNullable<AuctionWithSettings>;
  defaultNomination: CurrentNomination;
  defaultBid: CurrentBid;
  defaultAcquisitions?: AuctionAcquisition[];
};

export default function AuctionWrapper(props: Props) {
  return (
    <AuctionProvider {...props}>
      <div className="grid grid-cols-[1fr_200px] lg:grid-cols-12 gap-6 p-0 sm:p-6">
        <div className="hidden lg:block lg:col-span-3">
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
