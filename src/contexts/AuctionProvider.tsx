"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { Player } from "@/features/players/queries/player";
import useAuctionBid from "@/hooks/useAuctionBid";
import useAuctionNomination from "@/hooks/useAuctionNomination";
import useAuctionParticipants from "@/hooks/useAuctionParticipants";
import { createContext, useCallback, useContext, useState } from "react";

type AuctionContextType = {
  selectedPlayer: Player | null;
  toggleSelectPlayer: (player: Player | null) => void;
} & Pick<Props, "auction" | "isLeagueAdmin"> &
  ReturnType<typeof useAuctionParticipants> &
  ReturnType<typeof useAuctionNomination> &
  ReturnType<typeof useAuctionBid>;

const AuctionContext = createContext<AuctionContextType | null>(null);

type Props = {
  children: React.ReactNode;
  defaultParticipants: AuctionParticipant[];
  isLeagueAdmin: boolean;
  userTeamId: string;
  auction: NonNullable<AuctionWithSettings>;
  defaultNomination: CurrentNomination;
  defaultBid: CurrentBid;
};

export default function AuctionProvider({ children, ...props }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const toggleSelectPlayer = useCallback(setSelectedPlayer, [selectedPlayer]);

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
  });

  return (
    <AuctionContext.Provider
      value={{
        ...participants,
        ...nomination,
        ...bid,
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
