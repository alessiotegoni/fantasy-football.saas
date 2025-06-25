import { getIdTag, getLeagueTag, getTeamTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type TRADES_TAG =
  | "league-trades"
  | "my-proposed-trades"
  | "my-received-trades"
  | "trade-players";

export const getLeagueTradesTag = (leagueId: string) =>
  getLeagueTag("league-trades", leagueId);

export const getTradeIdTag = (tradeId: string) =>
  getIdTag("league-trades", tradeId);

export const getTradePlayersIdTag = (tradeId: string) =>
  getIdTag("trade-players", tradeId);

export const getMyProposedTradesTag = (myTeamId: string) =>
  getTeamTag("my-proposed-trades", myTeamId);

export const getMyReceivedProposedTradesTag = (myTeamId: string) =>
  getTeamTag("my-received-trades", myTeamId);

export const revalidateLeagueTradesCache = ({
  leagueId,
  tradeId,
}: {
  leagueId: string;
  tradeId: string;
}) => {
  revalidateTag(getLeagueTradesTag(leagueId));
  revalidateTag(getTradeIdTag(tradeId));
};
