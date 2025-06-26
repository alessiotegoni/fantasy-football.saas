"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Trades } from "../queries/trade";
import { getTradeContext } from "./TradesList";

type Props = {
  trade: Trades[number];
  currentUserTeamId: string;
} & ReturnType<typeof getTradeContext>;

export default function TradeCard({
  trade,
  variant,
  currentUserTeamId,
  actionHandlers,
}: Props) {
  const isProposer = trade.proposerTeamId === currentUserTeamId;
  const otherTeam = isProposer ? trade.receiverTeam : trade.proposerTeam;

  // Separa i giocatori offerti da quelli richiesti
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

  const getStatusBadge = () => {
    switch (trade.status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            Pendente
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
  };

  const handleAction = async (
    action: string,
    handler?: (tradeId: string) => Promise<void>
  ) => {
    if (!handler) return;

    setIsLoading(true);
    setLoadingAction(action);

    try {
      await handler(trade.id);
    } catch (error) {
      console.error(`Errore durante ${action}:`, error);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const renderPlayers = (
    players: Player[],
    title: string,
    showCredits = false
  ) => {
    if (players.length === 0 && !showCredits) return null;

    return (
      <div className="space-y-2">
        {players.length > 0 && (
          <>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex -space-x-2">
              {players.slice(0, 3).map((player, index) => (
                <Avatar
                  key={player.playerId}
                  className="w-8 h-8 border-2 border-white"
                >
                  <AvatarImage src={player.player.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">P</AvatarFallback>
                </Avatar>
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
  };

  const renderActions = () => {
    if (variant === "league" || trade.status !== "pending") return null;

    if (variant === "sent" && onDelete) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("delete", onDelete)}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {loadingAction === "delete" ? (
            <Clock className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          Cancella
        </Button>
      );
    }

    if (variant === "received" && (onAccept || onReject)) {
      return (
        <div className="flex gap-2">
          {onReject && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("reject", onReject)}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {loadingAction === "reject" ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Rifiuta
            </Button>
          )}
          {onAccept && (
            <Button
              size="sm"
              onClick={() => handleAction("accept", onAccept)}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loadingAction === "accept" ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Accetta
            </Button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card
      className={cn(
        "w-full transition-all duration-200",
        trade.status === "accepted" && "ring-2 ring-green-200 bg-green-50/50",
        trade.status === "rejected" && "ring-2 ring-red-200 bg-red-50/50",
        trade.status === "pending" && "hover:shadow-md"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={otherTeam.imageUrl || undefined} />
              <AvatarFallback>{otherTeam.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base">{otherTeam.name}</h3>
              <p className="text-sm text-gray-600">{otherTeam.managerName}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {formatDate(trade.createdAt)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {renderPlayers(
            offeredPlayers,
            variant === "sent" ? "Offri" : "Ricevi",
            true
          )}
          {renderPlayers(
            requestedPlayers,
            variant === "sent" ? "Richiedi" : "Dai"
          )}
        </div>

        {renderActions() && (
          <div className="flex justify-end pt-2 border-t">
            {renderActions()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
