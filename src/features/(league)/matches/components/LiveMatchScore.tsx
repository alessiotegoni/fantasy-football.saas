import { SplitMatchday } from "@/features/splits/queries/split";
import { calculateLineupTotalVote } from "../utils/LineupPlayers";
import ScoresSeparator from "./ScoresSeparator";

type Props = {
  totalVotes: ReturnType<typeof calculateLineupTotalVote>;
  currentMatchday?: SplitMatchday;
  splitMatchday: SplitMatchday;
  isBye: boolean;
};

export default function LiveMatchScore({
  totalVotes,
  currentMatchday,
  splitMatchday: matchMatchday,
  isBye,
}: Props) {
  if (
    currentMatchday?.id !== matchMatchday.id ||
    currentMatchday.status === "upcoming" ||
    !totalVotes ||
    isBye
  ) {
    return <ScoresSeparator />;
  }

  return (
    <div
      className="bg-primary/20 rounded-full
    px-3 sm:px-4.5 py-1 sm:py-1.5 mb-1.5 sm:mb-2"
    >
      <span className="text-xl font-bold text-primary">
        <span className="font-bold">{totalVotes.home}</span> -{" "}
        <span className="font-bold">{totalVotes.away}</span>
      </span>
    </div>
  );
}
