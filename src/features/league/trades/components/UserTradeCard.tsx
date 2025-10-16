import { cn } from "@/lib/utils";
import { TRADE_STATUS_THEMES, TradeStatusTheme } from "../utils/trade";
import { TradeCardProps } from "./TradeCard";
import TradeStatusBadge from "./TradeStatusBadge";
import TeamInfo from "./TradeTeamInfo";
import { Clock, ThumbsDown, ThumbsUp, Trash } from "iconoir-react";
import PlayersSection from "./TradePlayerSection";
import ActionButton from "@/components/ActionButton";

type UserTradeCard = Exclude<TradeCardProps, { variant: "league" }> & {
  isTradeOver: boolean;
  theme: TradeStatusTheme;
};

export default function UserTradeCard({
  trade,
  isTradeOver,
  variant,
  currentUserTeamId,
  theme,
  ...props
}: UserTradeCard) {
  const isProposer = trade.proposerTeamId === currentUserTeamId;
  const otherTeam = isProposer ? trade.receiverTeam : trade.proposerTeam;

  const offeredPlayers = trade.proposedPlayers.filter((p) =>
    variant === "sent" ? p.offeredByProposer : !p.offeredByProposer
  );
  const requestedPlayers = trade.proposedPlayers.filter((p) =>
    variant === "sent" ? !p.offeredByProposer : p.offeredByProposer
  );

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
      <div className="flex items-start justify-between mb-4">
        <TeamInfo team={otherTeam} size="lg" textMuted={theme.textMuted} />
        <TradeStatusBadge theme={theme} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Clock className={cn("size-4", theme.textMuted)} />
        <span className={cn("text-sm font-medium", theme.textMuted)}>
          {formatDate(trade.createdAt)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlayersSection
          players={offeredPlayers}
          isTradeOver={isTradeOver}
          title={
            isTradeOver ? "Hai dato" : variant === "sent" ? "Offri" : "Dai"
          }
          leagueTeamId={
            isProposer ? trade.proposerTeamId : trade.receiverTeamId
          }
          credits={getCreditsForSection(trade, isProposer, "give")}
          creditsType="give"
          theme={theme}
        />

        <PlayersSection
          players={requestedPlayers}
          isTradeOver={isTradeOver}
          title={
            isTradeOver
              ? "Hai ricevuto"
              : variant === "sent"
              ? "Richiedi"
              : "Ricevi"
          }
          leagueTeamId={
            isProposer ? trade.receiverTeamId : trade.proposerTeamId
          }
          credits={getCreditsForSection(trade, isProposer, "receive")}
          creditsType="receive"
          theme={theme}
        />
      </div>

      {/* @ts-ignore */}
      <TradeActions {...props} trade={trade} variant={variant} />
    </div>
  );
}

function TradeActions({
  variant,
  actionHandlers,
  trade,
  leagueId,
}: UserTradeCard) {
  if (trade.status !== "pending") return null;

  const actions = [];

  if (variant === "sent" && actionHandlers?.onDelete) {
    actions.push(
      <ActionButton
        key="delete"
        loadingText="Elimino scambio"
        variant="destructive"
        className="sm:w-fit sm:min-w-[150px] sm:py-3 rounded-2xl"
        action={actionHandlers.onDelete.bind(null, {
          leagueId,
          tradeId: trade.id,
        })}
        requireAreYouSure
        areYouSureDescription="Puoi comunque riinviare un'altra proposta in un secondo momento"
      >
        <Trash className="!size-5" />
        Elimina
      </ActionButton>
    );
  }

  if (variant === "received") {
    if (actionHandlers?.onReject) {
      actions.push(
        <ActionButton
          key="reject"
          loadingText="Rifiuto scambio"
          className={cn(
            "!px-4 sm:w-fit sm:min-w-[150px] sm:py-3 rounded-2xl",
            TRADE_STATUS_THEMES["rejected"].button
          )}
          action={actionHandlers.onReject.bind(null, {
            leagueId,
            players: trade.proposedPlayers.map(
              ({ player, offeredByProposer }) => ({
                id: player.id,
                roleId: player.roleId,
                offeredByProposer,
              })
            ),
            status: "rejected",
            tradeId: trade.id,
          })}
        >
          <ThumbsDown className="!size-5" />
          Rifiuta
        </ActionButton>
      );
    }

    if (actionHandlers?.onAccept) {
      actions.push(
        <ActionButton
          key="accept"
          loadingText="Accetto scambio"
          className={cn(
            "!px-4 sm:w-fit sm:min-w-[150px] sm:py-3 rounded-2xl",
            TRADE_STATUS_THEMES["accepted"].button
          )}
          action={actionHandlers.onAccept.bind(null, {
            leagueId,
            players: trade.proposedPlayers.map(
              ({ player, offeredByProposer }) => ({
                id: player.id,
                roleId: player.roleId,
                offeredByProposer,
              })
            ),
            status: "accepted",
            tradeId: trade.id,
          })}
        >
          <ThumbsUp className="!size-5" />
          Accetta
        </ActionButton>
      );
    }
  }

  if (!actions.length) return null;

  return (
    <div className="flex flex-wrap justify-end pt-2 border-t gap-2 mt-4">
      {actions}
    </div>
  );
}

function getCreditsForSection(
  trade: TradeCardProps["trade"],
  isProposer: boolean,
  showType: "give" | "receive"
) {
  if (showType === "give") {
    return isProposer
      ? trade.creditOfferedByProposer
      : trade.creditRequestedByProposer;
  } else {
    return isProposer
      ? trade.creditRequestedByProposer
      : trade.creditOfferedByProposer;
  }
}
