import AuctionProvider from "@/contexts/AuctionProvider";
import {
  AuctionWithSettings,
  getAuctionAvailablePlayers,
} from "@/features/(league)/auctions/queries/auction";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import PlayerDetails from "./PlayerDetailts";
import PlayersList from "../../teamsPlayers/components/PlayersList";
import { AuctionParticipant } from "../queries/auctionParticipant";
import AuctionHeader from "./AuctionHeader";
import { ParticipantAcquisition } from "../queries/auctionAcquisition";
import { playerRoles } from "@/drizzle/schema";
import AuctionCentralPanel from "./AuctionCentralPanel";
import { ParticipantsList } from "./ParticipantsList";

type Props = {
  playerRoles: (typeof playerRoles.$inferSelect)[];
  auction: NonNullable<AuctionWithSettings>;
  defaultParticipants: AuctionParticipant[];
  defaultAcquisitions: ParticipantAcquisition[];
  isLeagueAdmin?: boolean;
  userTeamId?: string;
  defaultNomination?: CurrentNomination;
  defaultBid?: CurrentBid;
};

export default function AuctionWrapper(props: Props) {
  return (
    <div>
      <AuctionHeader {...props} />

      <div className="flex">
        <main className="flex-1">
          <AuctionProvider {...props}>
            <div className="grid grid-cols-[1fr_200px] lg:grid-cols-12 gap-6 p-0 sm:p-6">
              <div className="hidden lg:block lg:col-span-3">
                {/* <Suspense>
                  <AuctionAvailablePlayers {...props} />
                </Suspense> */}
              </div>

              <div className="lg:col-span-6">
                <AuctionCentralPanel />
              </div>
              <div className="lg:col-span-3">
                <PlayerDetails />
              </div>
            </div>

            <div className="flex justify-center w-full">
              <ParticipantsList />

              {/* <PlayerRoster roles={roles} /> */}
            </div>
          </AuctionProvider>
        </main>
      </div>
    </div>
  );
}

async function AuctionAvailablePlayers({ auction }: Pick<Props, "auction">) {
  const players = await getAuctionAvailablePlayers(auction.id);

  return (
    <PlayersList
      leagueId={auction.leagueId}
      players={players}
      virtualized
      showSelectionButton={false}
    />
  );
}
