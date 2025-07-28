import { cn } from "@/lib/utils";

type Props = {
  homeScore?: string;
  awayScore?: string;
  isHomeWinner: boolean;
  isAwayWinner: boolean;
};

export default function MatchScores({
  homeScore,
  awayScore,
  isHomeWinner,
  isAwayWinner,
}: Props) {
  if (!homeScore && !awayScore) return null;

  return (
    <div className="text-sm text-muted-foreground">
      <span className={cn(isHomeWinner && "font-medium text-white")}>
        {homeScore || "-"}
      </span>
      <span className="font-semibold mx-2">-</span>
      <span className={cn(isAwayWinner && "font-medium text-white/90")}>
        {awayScore || "-"}
      </span>
    </div>
  );
}
