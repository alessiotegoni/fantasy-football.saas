import AuctionProvider from "@/contexts/AuctionProvider";
import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import PlayerDetails from "./PlayerDetailts";
import { AuctionParticipant } from "../queries/auctionParticipant";
import AuctionHeader from "./AuctionHeader";
import { ParticipantAcquisition } from "../queries/auctionAcquisition";
import { playerRoles } from "@/drizzle/schema";
import AuctionCentralPanel from "./AuctionCentralPanel";
import { ParticipantsWithAcquisitions } from "./ParticipantsWithAcquisitions";
import { Suspense } from "react";
import AuctionPlayers from "./AuctionPlayers";
import AuctionPlayersDialog from "./AuctionPlayersDialog";

type Props = {
  playersRoles: (typeof playerRoles.$inferSelect)[];
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
    <AuctionProvider {...props}>
      <AuctionHeader {...props} />

      <div className="flex">
        <main className="flex-1">
          <div className="grid grid-cols-[1fr_200px] lg:grid-cols-12 gap-6 pb-6 sm:p-6">
            <div className="hidden lg:block lg:col-span-3">
              <Suspense
                fallback={<AuctionPlayersDialog {...props} />}
              >
                <AuctionPlayers {...props} />
              </Suspense>
            </div>

            <div className="lg:col-span-6">
              <AuctionCentralPanel />
            </div>
            <div className="lg:col-span-3">
              <PlayerDetails />
            </div>
          </div>

          <ParticipantsWithAcquisitions />
        </main>
      </div>
    </AuctionProvider>
  );
}
