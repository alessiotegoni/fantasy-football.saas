import { getIdTag, getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type AUCTION_TAG = "auctions";

export const getLeagueAuctionsTag = (leagueId: string) =>
  getLeagueTag("auctions", leagueId);

export const getAuctionIdTag = (auctionId: string) =>
  getIdTag("auctions", auctionId);

export const revalidateLeagueAuctionsTag = (
  leagueId: string,
  auctionId: string
) => {
  revalidateTag(getLeagueAuctionsTag(leagueId));
  revalidateTag(getAuctionIdTag(auctionId));
};
