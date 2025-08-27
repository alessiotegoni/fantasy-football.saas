"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import {
  AuctionAcquisition,
  getAcquisitions,
} from "@/features/(league)/auctions/queries/auctionAcquisition";
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
  selectedPlayer: Player | null;
  toggleSelectPlayer: (player: Player | null) => void;
  acquisitions: Awaited<ReturnType<typeof getAcquisitions>>;
} & Pick<Props, "auction" | "isLeagueAdmin"> &
  ReturnType<typeof useAuctionParticipants> &
  ReturnType<typeof useAuctionNomination> &
  ReturnType<typeof useAuctionBid>;

const AuctionContext = createContext<AuctionContextType | null>(null);

type Props = {
  children: React.ReactNode;
  auction: NonNullable<AuctionWithSettings>;
  defaultParticipants: AuctionParticipant[];
  defaultAcquisitions: AuctionAcquisition[];
  isLeagueAdmin?: boolean;
  userTeamId?: string;
  defaultNomination?: CurrentNomination;
  defaultBid?: CurrentBid;
};

export default function AuctionProvider({ children, ...props }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const toggleSelectPlayer = useCallback(setSelectedPlayer, [selectedPlayer]);

  const { acquisitions } = useAuctionAcquisitions(props);
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
    ...props,
    acquisitions,
  });

  return (
    <AuctionContext.Provider
      value={{
        ...participants,
        ...nomination,
        ...bid,
        ...props,
        acquisitions,
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
