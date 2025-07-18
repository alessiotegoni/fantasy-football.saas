import { cn } from "@/lib/utils";
import PlayerCard from "../../teamsPlayers/components/PlayerCard";
import { TradeCardProps } from "./TradeCard";
import TradeCreditsBadge from "./TradeCreditsBadge";
import { TradeStatusTheme } from "../utils/trade";

type Props = {
  players: TradeCardProps["trade"]["proposedPlayers"];
  isTradeOver: boolean;
  title: string;
  leagueTeamId: string;
  credits?: number | null;
  creditsType: "offered" | "requested" | "give" | "receive";
  theme: TradeStatusTheme;
};

export default function PlayersSection({
  players,
  isTradeOver,
  title,
  leagueTeamId,
  credits,
  creditsType,
  theme,
}: Props) {
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
              className={cn("p-1 rounded-full pr-5", theme.playerCardBg)}
            />
          ))}
        </div>
      )}

      {credits && (
        <TradeCreditsBadge
          isTradeOver={isTradeOver}
          credits={credits}
          type={creditsType}
        />
      )}
    </div>
  );
}
