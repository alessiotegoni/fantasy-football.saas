import { getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type AUCTION_TAG = "auctions" | "auction-unlocked";

export const getLeagueAuctionTag = (leagueId: string) =>
  getLeagueTag("auction-unlocked", leagueId);

export const revalidateLeagueAuctionTag = (leagueId: string) => {
  revalidateTag(getLeagueAuctionTag(leagueId));
};
