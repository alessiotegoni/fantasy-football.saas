"use client";

import { cn } from "@/lib/utils";
import { Trades } from "../queries/trade";
import { getTradeContext, TradeContext } from "./TradesList";
import { Badge } from "@/components/ui/badge";
import { TradeProposalStatusType } from "@/drizzle/schema";
import ActionButton from "@/components/ActionButton";
import { Clock, User } from "iconoir-react";
import Avatar from "@/components/Avatar";

type Props = {
  trade: Trades[number];
  currentUserTeamId: string;
  leagueId: string;
} & ReturnType<typeof getTradeContext>;

export default function TradeCard(props: Props) {
  const { leagueId, trade, variant, currentUserTeamId } = props;

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
        "w-full rounded-3xl bg-muted transition-all duration-200",
        trade.status === "accepted" && "ring-2 ring-green-200 bg-green-50/50",
        trade.status === "rejected" && "ring-2 ring-red-200 bg-red-50/50",
        trade.status === "pending" && "ring-2 ring-zinc-600 bg-zinc-600/30"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              imageUrl={otherTeam.imageUrl}
              name={otherTeam.name}
              size={10}
              renderFallback={() => otherTeam.name.charAt(0)}
            />

            <div>
              <h3 className="font-semibold text-base">{otherTeam.name}</h3>
              <p className="text-sm text-muted-foreground">
                {otherTeam.managerName}
              </p>
            </div>
          </div>
          {getStatusBadge(trade.status)}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">
            {formatDate(trade.createdAt)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {renderPlayers({
            players: offeredPlayers,
            title: variant === "sent" ? "Offri" : "Ricevi",
            showCredits: true,
            trade: props.trade,
            variant,
          })}
          {renderPlayers({
            players: requestedPlayers,
            title: variant === "sent" ? "Richiedi" : "Dai",
            trade: props.trade,
            variant,
          })}
        </div>

        {renderActions(props) && (
          <div className="flex justify-end pt-2 border-t">
            {renderActions(props)}
          </div>
        )}
      </div>
    </div>
  );
}

function renderPlayers({
  players,
  showCredits = false,
  title,
  trade,
  variant,
}: {
  players: Props["trade"]["proposedPlayers"];
  title: string;
  variant: TradeContext;
  showCredits?: boolean;
  trade: Props["trade"];
}) {
  if (!players.length && !showCredits) return null;

  return (
    <div className="space-y-2">
      {players.length > 0 && (
        <>
          <p className="text-sm font-medium">{title}</p>
          <div className="flex -space-x-2">
            {players.slice(0, 3).map(({ player }, index) => (
              <Avatar
                key={player.id}
                imageUrl={player.avatarUrl}
                name={player.displayName}
                size={8}
                renderFallback={() => <User />}
              />
            ))}
            {players.length > 3 && (
              <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium">
                  +{players.length - 3}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {showCredits && (
        <div className="flex items-center gap-2">
          {variant === "sent" ? (
            <>
              {trade.creditOfferedByProposer && (
                <Badge variant="secondary" className="text-blue-600">
                  +{trade.creditOfferedByProposer}💰
                </Badge>
              )}
              {trade.creditRequestedByProposer && (
                <Badge variant="secondary" className="text-orange-600">
                  -{trade.creditRequestedByProposer}💰
                </Badge>
              )}
            </>
          ) : (
            <>
              {trade.creditRequestedByProposer && (
                <Badge variant="secondary" className="text-blue-600">
                  +{trade.creditRequestedByProposer}💰
                </Badge>
              )}
              {trade.creditOfferedByProposer && (
                <Badge variant="secondary" className="text-orange-600">
                  -{trade.creditOfferedByProposer}💰
                </Badge>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function renderActions({ variant, actionHandlers, trade, leagueId }: Props) {
  if (variant === "league" || trade.status !== "pending") return null;

  if (variant === "sent" && actionHandlers?.onDelete) {
    return (
      <ActionButton
        loadingText="Elimino scambio"
        variant="destructive"
        className="sm:w-fit sm:min-w-[150px] sm:py-3 rounded-xl"
        action={actionHandlers.onDelete.bind(null, {
          leagueId,
          tradeId: trade.id,
        })}
      >
        Elimina
      </ActionButton>
    );
  }

  if (
    variant === "received" &&
    (actionHandlers?.onAccept || actionHandlers?.onReject)
  ) {
    return (
      <div className="flex gap-2">
        {actionHandlers.onReject && (
          <ActionButton
            loadingText="Rifiuto scambio"
            action={actionHandlers.onReject.bind(null, {
              leagueId,
              players: trade.proposedPlayers.map(
                ({ player, offeredByProposer }) => ({
                  id: player.id,
                  offeredByProposer,
                })
              ),
              status: "rejected",
              tradeId: trade.id,
            })}
          >
            Rifiuta
          </ActionButton>
        )}
        {actionHandlers.onAccept && (
          <ActionButton
            loadingText="Accetto scambio"
            action={actionHandlers.onAccept.bind(null, {
              leagueId,
              players: trade.proposedPlayers.map(
                ({ player, offeredByProposer }) => ({
                  id: player.id,
                  offeredByProposer,
                })
              ),
              status: "rejected",
              tradeId: trade.id,
            })}
          >
            Accetta
          </ActionButton>
        )}
      </div>
    );
  }

  return null;
}

function getStatusBadge(status: TradeProposalStatusType) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-zinc-600 border border-zinc-500 rounded-full p-2 text-sm gap-2"
        >
          <Clock className="!size-5" />
          In attesa
        </Badge>
      );
    case "accepted":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          Accettata
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          Rifiutata
        </Badge>
      );
    default:
      return null;
  }
}
