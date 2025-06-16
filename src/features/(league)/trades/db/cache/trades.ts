import { getIdTag, getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type TRADES_TAG = "league-trades";

export const getLeagueTradeTag = (leagueId: string) =>
  getLeagueTag("league-trades", leagueId);

export const getTradeIdTag = (tradeId: string) =>
  getIdTag("league-trades", tradeId);

export const revalidateLeagueTradesCache = ({
  leagueId,
  tradeId,
}: {
  leagueId: string;
  tradeId: string;
}) => {
  revalidateTag(getLeagueTradeTag(leagueId));
  revalidateTag(getTradeIdTag(tradeId));
};
