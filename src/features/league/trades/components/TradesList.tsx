import { Trades } from "../queries/trade";
import TradesEmptyState from "./TradesEmptyState";
import TradeCard from "./TradeCard";
import { acceptTrade, deleteTrade, rejectTrade } from "../actions/trade";

export type TradeContext = "sent" | "received" | "league";

type Props = {
  leagueId: string;
  userTeamId: string;
  context: TradeContext;
  emptyState?: {
    title?: string;
    description?: string;
  };
  getTrades: (
    leagueId: string,
    userTeamId: string,
    context: TradeContext
  ) => Promise<Trades>;
};

export default async function TradesList({
  leagueId,
  userTeamId,
  context,
  emptyState,
  getTrades,
}: Props) {
  const trades = await getTrades(leagueId, userTeamId, context);

  if (!trades.length) {
    return (
      <TradesEmptyState
        {...emptyState}
        leagueId={leagueId}
        userTeamId={userTeamId}
      />
    );
  }

  const contextConfig = getTradeContext(context);

  return (
    <div className="space-y-4">
      {trades.map((trade) => (
        <TradeCard
          key={trade.id}
          leagueId={leagueId}
          trade={trade}
          currentUserTeamId={userTeamId}
          {...contextConfig}
        />
      ))}
    </div>
  );
}

export function getTradeContext(context: TradeContext) {
  switch (context) {
    case "sent":
      return {
        variant: "sent",
        actionHandlers: {
          onDelete: deleteTrade,
        },
      } as const;

    case "received":
      return {
        variant: "received",
        actionHandlers: {
          onAccept: acceptTrade,
          onReject: rejectTrade,
        },
      } as const;

    case "league":
      return {
        variant: "league",
      } as const;

    default:
      throw new Error(`Contesto non supportato: ${context}`);
  }
}
