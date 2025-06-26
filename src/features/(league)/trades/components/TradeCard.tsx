"use client";

import { Trades } from "../queries/trade";
import { getTradeContext } from "./TradesList";
import { TRADE_STATUS_THEMES } from "../utils/trade";
import LeagueTradeCard from "./LeagueTradeCard";
import UserTradeCard from "./UserTradeCard";

export type TradeCardProps = {
  trade: Trades[number];
  currentUserTeamId: string;
  leagueId: string;
} & ReturnType<typeof getTradeContext>;

export default function TradeCard(props: TradeCardProps) {
  const { trade, variant } = props;
  const theme = TRADE_STATUS_THEMES[trade.status];

  if (variant === "league") {
    return <LeagueTradeCard {...props} theme={theme} />;
  }

  return <UserTradeCard {...props} theme={theme} />;
}
