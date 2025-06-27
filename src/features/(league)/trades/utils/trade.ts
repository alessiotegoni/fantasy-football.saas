import { Clock, ThumbsDown, ThumbsUp } from "iconoir-react";

export function groupTradePlayers<
  T extends { id: number; offeredByProposer: boolean }
>(players: T[]) {
  return Object.groupBy(players, (player) =>
    player.offeredByProposer ? "proposed" : "requested"
  );
}

export const TRADE_STATUS_THEMES = {
  pending: {
    cardBg: "bg-zinc-600/30",
    cardRing: "ring-zinc-600",
    playerCardBg: "bg-zinc-700/80 border-zinc-600/80",
    textMuted: "text-zinc-400",
    badgeBg: "bg-zinc-600 border-zinc-500",
    badgeIcon: Clock,
    badgeText: "In attesa",
  },
  accepted: {
    cardBg: "bg-green-400/40",
    cardRing: "ring-green-400/70",
    playerCardBg: "bg-green-600/60 border-green-500/70",
    textMuted: "text-green-200",
    badgeBg: "bg-green-500 border-green-400",
    button: "bg-green-500 border border-green-400 hover:bg-green-500/80",
    badgeIcon: ThumbsUp,
    badgeText: "Accettata",
  },
  rejected: {
    cardBg: "bg-red-500/40",
    cardRing: "ring-red-500/70",
    playerCardBg: "bg-red-600/60 border-red-500/70",
    textMuted: "text-red-200",
    badgeBg: "bg-red-500/70 border-red-500",
    button: "bg-red-500/70 border border-red-500 hover:bg-red-500/50",
    badgeIcon: ThumbsDown,
    badgeText: "Rifiutata",
  },
} as const;
export type TradeStatusTheme =
  (typeof TRADE_STATUS_THEMES)[keyof typeof TRADE_STATUS_THEMES];
