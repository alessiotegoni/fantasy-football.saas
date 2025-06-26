"use client";

import { cn } from "@/lib/utils";
import { Trades } from "../queries/trade";
import { getTradeContext, TradeContext } from "./TradesList";
import { Badge } from "@/components/ui/badge";
import { TradeProposalStatusType } from "@/drizzle/schema";
import ActionButton from "@/components/ActionButton";
import { Clock, Coins, ArrowRight } from "iconoir-react";
import Avatar from "@/components/Avatar";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";

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

  if (variant === "league") {
    return (
      <div
        className={cn(
          "w-full rounded-3xl transition-all duration-200 p-4",
          trade.status === "accepted" && "ring-2 ring-green-200 bg-green-50/50",
          trade.status === "rejected" && "ring-2 ring-red-200 bg-red-50/50",
          trade.status === "pending" && "ring-2 ring-zinc-600 bg-zinc-600/30"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              imageUrl={trade.proposerTeam.imageUrl}
              name={trade.proposerTeam.name}
              className="size-10"
              renderFallback={() => trade.proposerTeam.name.charAt(0)}
            />
            <div>
              <h4 className="font-medium text-sm">{trade.proposerTeam.name}</h4>
              <p className="text-xs text-muted-foreground">
                {trade.proposerTeam.managerName}
              </p>
            </div>

            <ArrowRight className="size-4 text-muted-foreground mx-2" />

            <Avatar
              imageUrl={trade.receiverTeam.imageUrl}
              name={trade.receiverTeam.name}
              className="size-10"
              renderFallback={() => trade.receiverTeam.name.charAt(0)}
            />
            <div>
              <h4 className="font-medium text-sm">{trade.receiverTeam.name}</h4>
              <p className="text-xs text-muted-foreground">
                {trade.receiverTeam.managerName}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderPlayersForLeague({
            players: trade.proposedPlayers.filter((p) => p.offeredByProposer),
            title: `${trade.proposerTeam.name} offre`,
            leagueTeamId: trade.proposerTeamId,
            credits: trade.creditOfferedByProposer,
            creditsType: "offered",
          })}
          {renderPlayersForLeague({
            players: trade.proposedPlayers.filter((p) => !p.offeredByProposer),
            title: `${trade.receiverTeam.name} offre`,
            leagueTeamId: trade.receiverTeamId,
            credits: trade.creditRequestedByProposer,
            creditsType: "requested",
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-3xl transition-all duration-200 p-4",
        trade.status === "accepted" && "ring-2 ring-green-200 bg-green-50/50",
        trade.status === "rejected" && "ring-2 ring-red-200 bg-red-50/50",
        trade.status === "pending" && "ring-2 ring-zinc-600 bg-zinc-600/30"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            imageUrl={otherTeam.imageUrl}
            name={otherTeam.name}
            className="size-12"
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
          trade: props.trade,
          variant,
          leagueTeamId: isProposer
            ? trade.proposerTeamId
            : trade.receiverTeamId,
          isProposer,
          showType: "give",
        })}
        {renderPlayers({
          players: requestedPlayers,
          title: variant === "sent" ? "Richiedi" : "Dai",
          trade: props.trade,
          variant,
          leagueTeamId: isProposer
            ? trade.receiverTeamId
            : trade.proposerTeamId,
          isProposer,
          showType: "receive",
        })}
      </div>

      {renderActions(props) && (
        <div className="flex justify-end pt-2 border-t">
          {renderActions(props)}
        </div>
      )}
    </div>
  );
}

function renderPlayersForLeague({
  players,
  title,
  leagueTeamId,
  credits,
  creditsType,
}: {
  players: Props["trade"]["proposedPlayers"];
  title: string;
  leagueTeamId: string;
  credits?: number | null;
  creditsType: "offered" | "requested";
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      {players.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {players.map(({ player }) => (
            <PlayerCard
              key={player.id}
              {...player}
              leagueTeamId={leagueTeamId}
              showSelectButton={false}
              role={null}
              team={null}
              className="p-1 border border-zinc-600/80 bg-zinc-700/80 rounded-full pr-5"
            />
          ))}
        </div>
      )}

      {credits && (
        <Badge
          variant="secondary"
          className={cn(
            "text-sm rounded-lg font-semibold",
            creditsType === "offered" ? "text-orange-600" : "text-blue-600"
          )}
        >
          {creditsType === "offered" ? "-" : "+"}
          {credits}💰
        </Badge>
      )}
    </div>
  );
}

function renderPlayers({
  players,
  title,
  trade,
  variant,
  leagueTeamId,
  isProposer,
  showType,
}: {
  players: Props["trade"]["proposedPlayers"];
  title: string;
  variant: TradeContext;
  trade: Props["trade"];
  leagueTeamId: string;
  isProposer: boolean;
  showType: "give" | "receive";
}) {
  if (!players.length && !getCreditsForSection(trade, isProposer, showType))
    return null;

  return (
    <div className="space-y-2">
      {players.length > 0 && (
        <>
          <p className="text-sm font-medium">{title}</p>
          <div className="flex flex-wrap gap-2">
            {players.map(({ player }) => (
              <PlayerCard
                key={player.id}
                {...player}
                leagueTeamId={leagueTeamId}
                showSelectButton={false}
                role={null}
                team={null}
                className="p-1 border border-zinc-600/80 bg-zinc-700/80 rounded-full pr-5"
              />
            ))}
          </div>
        </>
      )}

      {renderCreditsSection(trade, isProposer, showType)}
    </div>
  );
}

function getCreditsForSection(
  trade: Props["trade"],
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

function renderCreditsSection(
  trade: Props["trade"],
  isProposer: boolean,
  showType: "give" | "receive"
) {
  const credits = getCreditsForSection(trade, isProposer, showType);
  if (!credits) return null;

  const isGiving = showType === "give";

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className={cn(
          "text-sm rounded-lg font-semibold flex items-center gap-1",
          isGiving ? "text-red-600" : "text-green-600"
        )}
      >
        {isGiving ? "-" : "+"}
        {credits}
        <Coins className="!size-4" />
        <span className="text-xs">{isGiving ? "(perdi)" : "(guadagni)"}</span>
      </Badge>
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
        className="sm:w-fit sm:min-w-[150px] sm:py-3 rounded-full"
        action={actionHandlers.onDelete.bind(null, {
          leagueId,
          tradeId: trade.id,
        })}
        requireAreYouSure
        areYouSureDescription="Puoi comunque riinviare un'altra proposta in un secondo momento"
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
            className="sm:basis-1/2 sm:min-w-[150px] sm:py-3 rounded-full"
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
            className="sm:basis-1/2 sm:min-w-[150px] sm:py-3 rounded-full"
            action={actionHandlers.onAccept.bind(null, {
              leagueId,
              players: trade.proposedPlayers.map(
                ({ player, offeredByProposer }) => ({
                  id: player.id,
                  offeredByProposer,
                })
              ),
              status: "accepted",
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
