import { getIdTag, getLeagueTag, getTeamTag } from "@/cache/helpers";
import { updateTag } from "next/cache";

export type TRADES_TAG =
  | "league-trades"
  | "my-proposed-trades"
  | "my-received-trades"
  | "not-mine-trades"
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

export const getNotMineTradesTag = (myTeamId: string) =>
  getTeamTag("not-mine-trades", myTeamId);

export const revalidateLeagueTradesCache = ({
  leagueId,
  tradesIds,
}: {
  leagueId: string;
  tradesIds: string[];
}) => {
  updateTag(getLeagueTradesTag(leagueId));
  tradesIds.forEach((tradeId) => updateTag(getTradeIdTag(tradeId)));
};
