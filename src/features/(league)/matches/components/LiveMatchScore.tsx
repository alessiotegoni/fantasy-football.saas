import { SplitMatchday } from "@/features/splits/queries/split";
import { calculateLineupTotalVote } from "../utils/LineupPlayers";

export default function LiveMatchScore({
  totalVotes,
  currentMatchday,
  splitMatchday: matchMatchday,
  isBye,
}: {
  totalVotes: ReturnType<typeof calculateLineupTotalVote>;
  currentMatchday?: SplitMatchday;
  splitMatchday: SplitMatchday;
  isBye: boolean;
}) {
  if (
    currentMatchday?.id !== matchMatchday.id ||
    currentMatchday.status === "upcoming" ||
    !totalVotes
  )
    return null;

  if (isBye) {
    return <div className="w-2 h-1 sm:w-3 sm:h-1.5 bg-primary rounded-full" />;
  }

  const isHomeWinning = totalVotes.home ?? 0 > (totalVotes.away ?? 0);
  const isAwayWinning = totalVotes.away ?? 0 > (totalVotes.home ?? 0);

  return (
    <div
      className="bg-primary/20 rounded-full
    px-3 sm:px-4.5 py-1 sm:py-1.5 mb-1.5 sm:mb-2"
    >
      <span className="text-xl font-bold text-primary">
        <span className={isHomeWinning ? "font-extrabold" : "font-bold"}>
          {totalVotes.home}
        </span>{" "}
        -{" "}
        <span className={isAwayWinning ? "font-extrabold" : "font-bold"}>
          {totalVotes.away}
        </span>
      </span>
    </div>
  );
}
