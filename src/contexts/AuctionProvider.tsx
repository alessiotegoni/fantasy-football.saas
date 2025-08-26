"use client";

import { AuctionWithSettings } from "@/features/(league)/auctions/queries/auction";
import { CurrentBid } from "@/features/(league)/auctions/queries/auctionBid";
import { CurrentNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { AuctionParticipant } from "@/features/(league)/auctions/queries/auctionParticipant";
import { Player } from "@/features/players/queries/player";
import useAuctionBid from "@/hooks/useAuctionBid";
import useAuctionNomination from "@/hooks/useAuctionNomination";
import { createContext, useCallback, useContext, useState } from "react";

type AuctionContextType = {
  currentNomination: CurrentNomination;
  currentBid: CurrentBid;
  participants: AuctionParticipant[];
  handleSetParticipants: (participants: AuctionParticipant[]) => void;
  selectedPlayer: Player | null;
  toggleSelectPlayer: (player: Player | null) => void;
} & Pick<Props, "auction" | "userParticipant" | "isLeagueAdmin">;

const AuctionContext = createContext<AuctionContextType | null>(null);

type Props = {
  children: React.ReactNode;
  defaultParticipants: AuctionParticipant[];
  isLeagueAdmin: boolean;
  userParticipant: AuctionParticipant;
  auction: NonNullable<AuctionWithSettings>;
  defaultNomination: CurrentNomination;
  defaultBid: CurrentBid;
};

export default function AuctionProvider({ children, ...props }: Props) {
  const nomination = useAuctionNomination(props);
  const bid = useAuctionBid({
    ...nomination,
    ...props,
  });

  const [participants, setParticipants] = useState(props.defaultParticipants);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleSetParticipants = useCallback(setParticipants, []);
  const toggleSelectPlayer = useCallback(setSelectedPlayer, []);

  return (
    <AuctionContext.Provider
      value={{
        ...nomination,
        ...bid,
        ...props,
        participants,
        handleSetParticipants,
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
