import { getIdTag, getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type AUCTION_TAG =
  | "auctions"
  | "auction-settings"
  | "auction-available-players"
  | "auction-participants";

export const getLeagueAuctionsTag = (leagueId: string) =>
  getLeagueTag("auctions", leagueId);

export const getAuctionIdTag = (auctionId: string) =>
  getIdTag("auctions", auctionId);

export const getAuctionSettingTag = (auctionId: string) =>
  getIdTag("auction-settings", auctionId);

export const getAuctionParticipantsTag = (auctionId: string) =>
  getIdTag("auction-participants", auctionId);

export const getAuctionAvailablePlayersTag = (auctionId: string) =>
  getIdTag("auction-available-players", auctionId);

export const revalidateLeagueAuctionsCache = (
  leagueId: string,
  auctionId: string,
) => {
  revalidateTag(getLeagueAuctionsTag(leagueId));
  revalidateTag(getAuctionIdTag(auctionId));
};

export const revalidateAuctionSettingsCache = (auctionId: string) => {
  revalidateTag(getAuctionSettingTag(auctionId));
};

export const revalidateAuctionParticipantsCache = (auctionId: string) => {
  revalidateTag(getAuctionParticipantsTag(auctionId));
};

export const revalidateAuctionPlayersCache = (auctionId: string) =>
  revalidateTag(getAuctionAvailablePlayersTag(auctionId));

