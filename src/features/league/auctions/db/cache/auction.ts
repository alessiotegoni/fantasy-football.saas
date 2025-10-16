import { getIdTag, getLeagueTag } from "@/cache/helpers";
import { updateTag } from "next/cache";

export type AUCTION_TAG =
  | "auctions"
  | "auction-settings"
  | "auction-available-players"
  | "auction-participants"
  | "auction-participants-acquisitions";

export const getLeagueAuctionsTag = (leagueId: string) =>
  getLeagueTag("auctions", leagueId);

export const getAuctionIdTag = (auctionId: string) =>
  getIdTag("auctions", auctionId);

export const getAuctionSettingTag = (auctionId: string) =>
  getIdTag("auction-settings", auctionId);

export const getAuctionParticipantsTag = (auctionId: string) =>
  getIdTag("auction-participants", auctionId);

export const getParticipantsAcquisitionsTag = (auctionId: string) =>
  getIdTag("auction-participants-acquisitions", auctionId);

export const getAuctionAvailablePlayersTag = (auctionId: string) =>
  getIdTag("auction-available-players", auctionId);

export const revalidateLeagueAuctionsCache = (
  leagueId: string,
  auctionId: string
) => {
  updateTag(getLeagueAuctionsTag(leagueId));
  updateTag(getAuctionIdTag(auctionId));
};

export const revalidateAuctionSettingsCache = (auctionId: string) => {
  updateTag(getAuctionSettingTag(auctionId));
};

export const revalidateAuctionParticipantsCache = (auctionId: string) => {
  updateTag(getAuctionParticipantsTag(auctionId));
};

export const revalidateParticipantsAcquisitionsCache = (auctionId: string) => {
  updateTag(getParticipantsAcquisitionsTag(auctionId));
};

export const revalidateAuctionPlayersCache = (auctionId: string) =>
  updateTag(getAuctionAvailablePlayersTag(auctionId));
