"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { ParticipantAcquisition } from "@/features/(league)/auctions/queries/auctionAcquisition";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import useAuctionAcquisitions from "@/hooks/useAuctionAcquisitions";
import useAuctionBid from "@/hooks/useAuctionBid";
import useAuctionNomination from "@/hooks/useAuctionNomination";
import useAuctionParticipants from "@/hooks/useAuctionParticipants";
import { createContext, useCallback, useContext, useState } from "react";
import useAuctionPlayerAssign from "@/hooks/useAuctionPlayerAssign";
import { playerRoles } from "@/drizzle/schema";
import { TeamPlayer } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import useCustomBidMode from "@/hooks/useAuctionCustomBid";
import useAuctionCustomBid from "@/hooks/useAuctionCustomBid";
import useAuctionSettings from "@/hooks/useAuctionSettings";

type AuctionContextType = {
  selectedPlayer: TeamPlayer | null;
  toggleSelectPlayer: (player: TeamPlayer | null) => void;
} & Pick<Props, "isLeagueAdmin" | "userTeamId" | "playersRoles"> &
  ReturnType<typeof useAuctionSettings> &
  ReturnType<typeof useAuctionAcquisitions> &
  ReturnType<typeof useAuctionParticipants> &
  ReturnType<typeof useAuctionNomination> &
  ReturnType<typeof useAuctionBid> &
  ReturnType<typeof useAuctionPlayerAssign> &
  ReturnType<typeof useCustomBidMode>;

const AuctionContext = createContext<AuctionContextType | null>(null);

type Props = {
  children: React.ReactNode;
  defaultAuction: NonNullable<AuctionWithSettings>;
  playersRoles: (typeof playerRoles.$inferSelect)[];
  defaultParticipants: AuctionParticipant[];
  defaultAcquisitions: ParticipantAcquisition[];
  isLeagueAdmin?: boolean;
  userTeamId?: string;
  defaultNomination?: CurrentNomination;
  defaultBid?: CurrentBid;
};

export default function AuctionProvider({ children, ...props }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<TeamPlayer | null>(null);
  const toggleSelectPlayer = useCallback(setSelectedPlayer, []);

  // Error: Route "/leagues/[leagueId]/premium/auctions/[auctionId]" used `Math.random()` outside of `"use cache"` and without explicitly calling `await connection()` beforehand. See more info here: https://nextjs.org/docs/messages/next-prerender-random
  //   at String.replace (<anonymous>:2:1)
  //   at createClient (rsc://React/Server/file:///D:/nextJS/fantasy-football-saas/.next/server/chunks/ssr/%255Broot-of-the-server%255D__084addd1._.js?75:63:210)
  //   at useAuctionSettings (rsc://React/Server/file:///D:/nextJS/fantasy-football-saas/.next/server/chunks/ssr/%255Broot-of-the-server%255D__084addd1._.js?76:570:188)
  //   at AuctionProvider (rsc://React/Server/file:///D:/nextJS/fantasy-football-saas/.next/server/chunks/ssr/%255Broot-of-the-server%255D__084addd1._.js?77:684:167)
  //   at resolveErrorDev (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_d87e34ab._.js:3403:48)
  //   at getOutlinedModel (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_d87e34ab._.js:3101:28)
  //   at parseModelString (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_d87e34ab._.js:3182:52)
  //   at Array.<anonymous> (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_d87e34ab._.js:3764:51)
  //   at JSON.parse (<anonymous>)
  //   at resolveConsoleEntry (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_d87e34ab._.js:3551:32)
  //   at processFullStringRow (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_d87e34ab._.js:3737:17)
  //   at processFullBinaryRow (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_d87e34ab._.js:3705:9)
  //   at progress (http://localhost:3000/_next/static/chunks/node_modules_next_dist_compiled_d87e34ab._.js:3857:102)

  const auction = useAuctionSettings(props);
  const acquisitions = useAuctionAcquisitions({ ...props, ...auction });
  const participants = useAuctionParticipants({ ...props, ...auction });
  const playerAssign = useAuctionPlayerAssign();
  const nomination = useAuctionNomination({
    ...props,
    ...auction,
    ...participants,
    selectedPlayer,
    toggleSelectPlayer,
  });
  const bid = useAuctionBid({
    ...auction,
    ...nomination,
    ...participants,
    ...acquisitions,
    ...props,
  });

  const customBid = useAuctionCustomBid({ ...bid, ...nomination });

  return (
    <AuctionContext.Provider
      value={{
        ...auction,
        ...acquisitions,
        ...participants,
        ...nomination,
        ...bid,
        ...playerAssign,
        ...customBid,
        ...props,
        selectedPlayer,
        toggleSelectPlayer,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuction() {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error("useAuction must be used within AuctionContext");
  }
  return context;
}
