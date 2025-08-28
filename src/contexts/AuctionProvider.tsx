"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { ParticipantAcquisition } from "@/features/(league)/auctions/queries/auctionAcquisition";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { Player } from "@/features/players/queries/player";
import useAuctionAcquisitions from "@/hooks/useAuctionAcquisitions";
import useAuctionBid from "@/hooks/useAuctionBid";
import useAuctionNomination from "@/hooks/useAuctionNomination";
import useAuctionParticipants from "@/hooks/useAuctionParticipants";
import { createContext, useCallback, useContext, useState } from "react";

type AuctionContextType = {
  customBidMode: boolean;
  toggleCustomBidMode: () => void;
  assignPlayerMode: boolean;
  toggleAssignPlayerMode: () => void;
  selectedPlayer: Player | null;
  toggleSelectPlayer: (player: Player | null) => void;
} & Pick<Props, "auction" | "isLeagueAdmin"> &
  ReturnType<typeof useAuctionAcquisitions> &
  ReturnType<typeof useAuctionParticipants> &
  ReturnType<typeof useAuctionNomination> &
  ReturnType<typeof useAuctionBid>;

const AuctionContext = createContext<AuctionContextType | null>(null);

type Props = {
  children: React.ReactNode;
  auction: NonNullable<AuctionWithSettings>;
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

  const [assignPlayerMode, setAssignPlayerMode] = useState(false);
  const toggleAssignPlayerMode = useCallback(
    () => setAssignPlayerMode(!assignPlayerMode),
    [assignPlayerMode]
  );

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const toggleSelectPlayer = useCallback(setSelectedPlayer, []);

  const acquisitions = useAuctionAcquisitions(props);
  const participants = useAuctionParticipants(props);
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
        ...props,
        customBidMode,
        toggleCustomBidMode,
        assignPlayerMode,
        toggleAssignPlayerMode,
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
