"use client";

import { cn } from "@/lib/utils";
import { Trades } from "../queries/trade";
import { getTradeContext } from "./TradesList";
import { Badge } from "@/components/ui/badge";
import { TradeProposalStatusType } from "@/drizzle/schema";
import ActionButton from "@/components/ActionButton";
import { Clock, ArrowRight, ThumbsDown, ThumbsUp } from "iconoir-react";
import Avatar from "@/components/Avatar";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import TeamInfo from "./TradeTeamInfo";

type Props = {
  trade: Trades[number];
  currentUserTeamId: string;
  leagueId: string;
} & ReturnType<typeof getTradeContext>;

export default function TradeCard(props: Props) {
  const { trade, variant } = props;
  const theme = STATUS_THEMES[trade.status];

  if (variant === "league") {
    return <LeagueTradeCard {...props} theme={theme} />;
  }

  return <UserTradeCard {...props} theme={theme} />;
}

function LeagueTradeCard({
  trade,
  theme,
}: Props & { theme: (typeof STATUS_THEMES)[keyof typeof STATUS_THEMES] }) {
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
        "w-full rounded-3xl transition-all duration-200 p-4 ring-2",
        theme.cardBg,
        theme.cardRing
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <TeamInfo
            team={trade.proposerTeam}
            size="sm"
            textMuted={theme.textMuted}
          />
          <ArrowRight className={cn("size-4 mx-2", theme.textMuted)} />
          <TeamInfo
            team={trade.receiverTeam}
            size="sm"
            textMuted={theme.textMuted}
          />
        </div>
        <StatusBadge status={trade.status} theme={theme} />
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

function UserTradeCard({
  trade,
  variant,
  currentUserTeamId,
  theme,
  ...props
}: Props & { theme: (typeof STATUS_THEMES)[keyof typeof STATUS_THEMES] }) {
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
        "w-full rounded-3xl transition-all duration-200 p-4 ring-2",
        theme.cardBg,
        theme.cardRing
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <TeamInfo team={otherTeam} size="lg" textMuted={theme.textMuted} />
        <StatusBadge status={trade.status} theme={theme} />
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
          title={variant === "sent" ? "Offri" : "Ricevi"}
          leagueTeamId={
            isProposer ? trade.proposerTeamId : trade.receiverTeamId
          }
          credits={getCreditsForSection(trade, isProposer, "give")}
          creditsType="give"
          theme={theme}
        />
        <PlayersSection
          players={requestedPlayers}
          title={variant === "sent" ? "Richiedi" : "Dai"}
          leagueTeamId={
            isProposer ? trade.receiverTeamId : trade.proposerTeamId
          }
          credits={getCreditsForSection(trade, isProposer, "receive")}
          creditsType="receive"
          theme={theme}
        />
      </div>

      <TradeActions {...props} trade={trade} variant={variant} />
    </div>
  );
}

function StatusBadge({
  status,
  theme,
}: {
  status: TradeProposalStatusType;
  theme: (typeof STATUS_THEMES)[keyof typeof STATUS_THEMES];
}) {
  const Icon = theme.badgeIcon;

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full p-2 px-3 text-sm gap-2", theme.badgeBg)}
    >
      <Icon className="!size-5" />
      {theme.badgeText}
    </Badge>
  );
}

function PlayersSection({
  players,
  title,
  leagueTeamId,
  credits,
  creditsType,
  theme,
}: {
  players: Props["trade"]["proposedPlayers"];
  title: string;
  leagueTeamId: string;
  credits?: number | null;
  creditsType: "offered" | "requested" | "give" | "receive";
  theme: (typeof STATUS_THEMES)[keyof typeof STATUS_THEMES];
}) {
  if (!players.length && !credits) return null;

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
              className={cn("p-1 rounded-full pr-5", theme.playerCardBg)}
            />
          ))}
        </div>
      )}

      {credits && <CreditsBadge credits={credits} type={creditsType} />}
    </div>
  );
}


function TradeActions({ variant, actionHandlers, trade, leagueId }: Props) {
  if (variant === "league" || trade.status !== "pending") return null;

  const actions = [];

  if (variant === "sent" && actionHandlers?.onDelete) {
    actions.push(
      <ActionButton
        key="delete"
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

  if (variant === "received") {
    if (actionHandlers?.onReject) {
      actions.push(
        <ActionButton
          key="reject"
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
      );
    }

    if (actionHandlers?.onAccept) {
      actions.push(
        <ActionButton
          key="accept"
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
      );
    }
  }

  if (!actions.length) return null;

  return (
    <div className="flex justify-end pt-2 border-t gap-2 mt-4">{actions}</div>
  );
}

// Utility functions
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
