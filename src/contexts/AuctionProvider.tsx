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

type AuctionContextType = {
  customBidMode: boolean;
  toggleCustomBidMode: () => void;
  selectedPlayer: TeamPlayer | null;
  toggleSelectPlayer: (player: TeamPlayer | null) => void;
} & Pick<Props, "auction" | "isLeagueAdmin" | "userTeamId" | "playersRoles"> &
  ReturnType<typeof useAuctionAcquisitions> &
  ReturnType<typeof useAuctionParticipants> &
  ReturnType<typeof useAuctionNomination> &
  ReturnType<typeof useAuctionBid> &
  ReturnType<typeof useAuctionPlayerAssign>;

const AuctionContext = createContext<AuctionContextType | null>(null);

type Props = {
  children: React.ReactNode;
  auction: NonNullable<AuctionWithSettings>;
  playersRoles: (typeof playerRoles.$inferSelect)[];
  defaultParticipants: AuctionParticipant[];
  defaultAcquisitions: ParticipantAcquisition[];
  isLeagueAdmin?: boolean;
  userTeamId?: string;
  defaultNomination?: CurrentNomination;
  defaultBid?: CurrentBid;
};

export default function AuctionProvider({ children, ...props }: Props) {
  const [customBidMode, setCustomBidMode] = useState(false);
  const toggleCustomBidMode = useCallback(
    () => setCustomBidMode(!customBidMode),
    [customBidMode]
  );

  const [selectedPlayer, setSelectedPlayer] = useState<TeamPlayer | null>(null);
  const toggleSelectPlayer = useCallback(setSelectedPlayer, []);

  const acquisitions = useAuctionAcquisitions(props);
  const participants = useAuctionParticipants(props);
  const playerAssign = useAuctionPlayerAssign();
  const nomination = useAuctionNomination({
    ...props,
    ...participants,
    selectedPlayer,
    toggleSelectPlayer,
  });
  const bid = useAuctionBid({
    ...nomination,
    ...participants,
    ...acquisitions,
    ...props,
  });

  return (
    <AuctionContext.Provider
      value={{
        ...acquisitions,
        ...participants,
        ...nomination,
        ...bid,
        ...playerAssign,
        ...props,
        customBidMode,
        toggleCustomBidMode,
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
