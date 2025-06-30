import { Clock, FastArrowDown, FastArrowRight } from "iconoir-react";
import { TradeStatusTheme } from "../utils/trade";
import { TradeCardProps } from "./TradeCard";
import TeamInfo from "./TradeTeamInfo";
import { cn } from "@/lib/utils";
import TradeStatusBadge from "./TradeStatusBadge";
import PlayersSection from "./TradePlayerSection";

export default function LeagueTradeCard({
  trade,
  theme,
}: TradeCardProps & { theme: TradeStatusTheme }) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={cn(
        "w-full rounded-3xl transition-all duration-200 p-4 ring-2 min-h-[300px]",
        theme.cardBg,
        theme.cardRing
      )}
    >
      <div className="flex flex-col w-fit sm:w-full sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <TeamInfo
              team={trade.proposerTeam}
              size="sm"
              textMuted={theme.textMuted}
            />
          </div>
          <FastArrowRight
            className={cn(
              "hidden sm:block size-5 mx-2 self-center sm:mx-2",
              theme.textMuted
            )}
          />
          <FastArrowDown
            className={cn(
              "sm:hidden size-5 mx-2 self-center sm:mx-2",
              theme.textMuted
            )}
          />
          <div className="flex items-center gap-2 min-w-0">
            <TeamInfo
              team={trade.receiverTeam}
              size="sm"
              textMuted={theme.textMuted}
            />
          </div>
        </div>

        <div className="flex-shrink-0 self-start">
          <TradeStatusBadge theme={theme} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Clock className={cn("size-4", theme.textMuted)} />
        <span className={cn("text-sm font-medium", theme.textMuted)}>
          {formatDate(trade.createdAt)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlayersSection
          players={trade.proposedPlayers.filter((p) => p.offeredByProposer)}
          title={`${trade.proposerTeam.name} offre`}
          leagueTeamId={trade.proposerTeamId}
          credits={trade.creditOfferedByProposer}
          creditsType="offered"
          theme={theme}
        />
        <PlayersSection
          players={trade.proposedPlayers.filter((p) => !p.offeredByProposer)}
          title={`${trade.receiverTeam.name} offre`}
          leagueTeamId={trade.receiverTeamId}
          credits={trade.creditRequestedByProposer}
          creditsType="requested"
          theme={theme}
        />
      </div>
    </div>
  );
}
