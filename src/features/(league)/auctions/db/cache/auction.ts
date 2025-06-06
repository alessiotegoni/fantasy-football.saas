import { getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type AUCTION_TAG = "auctions"

export const getLeagueAuctionTag = (leagueId: string) =>
  getLeagueTag("auctions", leagueId);

export const revalidateLeagueAuctionTag = (leagueId: string) => {
  revalidateTag(getLeagueAuctionTag(leagueId));
};
