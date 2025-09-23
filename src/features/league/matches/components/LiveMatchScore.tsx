import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { calculateLineupsTotalVote } from "../utils/lineup";
import ScoresSeparator from "./ScoresSeparator";
import { formatVoteValue } from "@/features/dashboard/redaction/votes/utils/vote";
import { Badge } from "@/components/ui/badge";

type Props = {
  totalVotes: ReturnType<typeof calculateLineupsTotalVote>;
  currentMatchday?: SplitMatchday;
  splitMatchday: SplitMatchday;
  isBye: boolean;
};

export default function LiveMatchScore({
  totalVotes,
  splitMatchday: matchMatchday,
  isBye,
}: Props) {
  if (!totalVotes || isBye || matchMatchday.status === "upcoming") {
    return <ScoresSeparator />;
  }

  return (
    <Badge
      className="bg-primary/20 rounded-full
    px-3 sm:px-4.5 py-1 sm:py-1.5"
    >
      <span className="text-xl font-bold text-primary">
        <span className="font-bold">
          {formatVoteValue(totalVotes.homeScore ?? 0)}
        </span>{" "}
        -{" "}
        <span className="font-bold">
          {formatVoteValue(totalVotes.awayScore ?? 0)}
        </span>
      </span>
    </Badge>
  );
}
