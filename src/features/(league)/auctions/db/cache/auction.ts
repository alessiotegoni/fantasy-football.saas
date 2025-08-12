import { getIdTag, getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type AUCTION_TAG = "auctions" | "auctions-settings";

export const getLeagueAuctionsTag = (leagueId: string) =>
  getLeagueTag("auctions", leagueId);

export const getAuctionIdTag = (auctionId: string) =>
  getIdTag("auctions", auctionId);

export const getLeagueAuctionsSettingsTag = (leagueId: string) =>
  getLeagueTag("auctions-settings", leagueId);

export const revalidateLeagueAuctionsCache = (
  leagueId: string,
  auctionId: string
) => {
  revalidateTag(getLeagueAuctionsTag(leagueId));
  revalidateTag(getAuctionIdTag(auctionId));
};

export const revalidateLeagueAuctionsSettingsCache = (leagueId: string) => {
  revalidateTag(getLeagueAuctionsSettingsTag(leagueId));
};
